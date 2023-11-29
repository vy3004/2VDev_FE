/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  Button,
  Chip,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import {
  BookmarkIcon,
  BookmarkSlashIcon,
  ExclamationTriangleIcon,
  HandThumbUpIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  EllipsisHorizontalIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";

import NotFoundAlert from "../common/not-found-alert";
import TagButton from "../common/tag-button";
import MenuFilter from "../common/menu-filter";
import PostInfoUser from "../common/post-info-user";
import Loading from "../common/loading";
import Time from "../common/time";
import View from "../common/view";
import TypingComment from "./typing-comment";
import CommentForm from "./comment-form";
import Comment from "./comment";

import voteService from "../../services/vote-service";
import bookmarkService from "../../services/bookmark-service";
import userService from "../../services/user-service";
import postService from "../../services/post-service";
import openaiService from "../../services/openai-service";

import { selectUser } from "../../redux/features/user-slice";
import { setConfirmModal } from "../../redux/features/confirm-modal-slice";
import { setRepostModal } from "../../redux/features/repost-modal-slice";
import {
  selectReportModal,
  setReportModal,
} from "../../redux/features/report-modal-slice";
import {
  setAuthModalOpen,
  setAuthModalName,
} from "../../redux/features/auth-modal-slice";

import { Post } from "../../utils/types";
import {
  COMMENTS_SORT,
  POST_TYPE,
  USER_UPDATE_POINT,
} from "../../utils/constant";

interface PostCardProps {
  post: Post;
  isDetail: boolean;
  isRepost?: boolean;
  isView?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  isDetail,
  isRepost,
  isView,
}) => {
  const { t } = useTranslation();
  const { user } = useSelector(selectUser);
  const { reportModal } = useSelector(selectReportModal);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // console.log("POST", post);

  const [vote, setVote] = useState(post.is_voted);
  const [votesCount, setVotesCount] = useState(post.votes_count);
  const [bookmark, setBookmark] = useState(post.is_bookmarked);
  const [report, setReport] = useState(post.is_reported);
  const [showFormAnswer, setShowFormAnswer] = useState(false);
  const [comments, setComments] = useState<Post[]>([]);
  const [sortField, setSortField] = useState("votes_count");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [isAILoading, setIsAILoading] = useState(false);
  const [isCmtLoading, setIsCmtLoading] = useState(false);
  const [detailPinComment, setDetailPinComment] = useState<Post>();
  const [repost, setRepost] = useState<Post>();
  const [superChild, setSuperChild] = useState<Post[]>([]);

  useEffect(() => {
    if (reportModal.isReported && reportModal.postId === post._id)
      setReport(true);
  }, [reportModal, post._id]);

  useEffect(() => {
    if (isDetail && !isView) {
      if (page > 1) {
        getComments();
      }
    }
  }, [page]);

  useEffect(() => {
    if (isDetail && !isView && post.comments_count > 0) {
      getComments();
    }
  }, [sortField]);

  useEffect(() => {
    if (isDetail && !isView && post.resolved_id) {
      getPinComment();
    }
  }, []);

  useEffect(() => {
    if (
      isDetail &&
      !isView &&
      post.comments_count === 0 &&
      post.type === POST_TYPE.Post
    ) {
      getOpenAIComment();
    }
  }, []);

  useEffect(() => {
    if (post.type === POST_TYPE.RePost && post.parent_id) {
      getRepost();
    }
  }, []);

  const getRepost = async () => {
    if (post.parent_id) {
      const { response } = await postService.getPost({
        post_id: post.parent_id,
      });

      if (response) {
        setRepost(response.data.result);
      }
    }
  };

  const votePost = async (
    postId: string,
    otherUserId: string,
    type: boolean
  ) => {
    if (!type) {
      const { response } = await voteService.votePost({
        post_id: postId,
      });

      if (response) {
        toast.success(t("post.You have voted successfully"));
        updateUserPoints(otherUserId, USER_UPDATE_POINT.vote);
      }
    } else {
      const { response } = await voteService.removeVotePost({
        post_id: postId,
      });

      if (response) {
        toast.success(t("post.You have unvoted successfully"));
        updateUserPoints(otherUserId, USER_UPDATE_POINT.unVote);
      }
    }
  };

  const handleVote = (postId: string, userId: string, type: boolean) => {
    if (!user) {
      dispatch(setAuthModalOpen(!user));
      dispatch(setAuthModalName("signIn"));
      return;
    }

    votePost(postId, userId, type);
    setVote(!type);
    setVotesCount((prevCount) => (type ? prevCount - 1 : prevCount + 1));
  };

  const bookmarkPost = async (
    postId: string,
    otherUserId: string,
    type: boolean
  ) => {
    if (!type) {
      const { response } = await bookmarkService.bookmarkPost({
        post_id: postId,
      });

      if (response) {
        toast.success(t("post.You have marked the question"));
        updateUserPoints(otherUserId, USER_UPDATE_POINT.bookmark);
      }
    } else {
      const { response } = await bookmarkService.unmarkPost({
        post_id: postId,
      });

      if (response) {
        toast.success(t("post.You have unmarked the question"));
        updateUserPoints(otherUserId, USER_UPDATE_POINT.unBookmark);
      }
    }
  };

  const handleBookmark = (
    postId: string,
    otherUserId: string,
    type: boolean
  ) => {
    bookmarkPost(postId, otherUserId, type);
    setBookmark(!type);
  };

  const handleReport = () => {
    dispatch(
      setReportModal({
        reportModalOpen: true,
        postId: post._id,
        otherUserId: post.user_detail._id,
        isReported: false,
      })
    );
  };

  const handleRepost = () => {
    if (!user) {
      dispatch(setAuthModalOpen(!user));
      dispatch(setAuthModalName("signIn"));
      return;
    }

    dispatch(
      setRepostModal({
        repostModalOpen: true,
        post: post,
      })
    );
  };

  const handleComment = () => {
    isDetail ? setShowFormAnswer(!showFormAnswer) : navigate(`/${post._id}`);
  };

  const handleDelete = () => {
    dispatch(
      setConfirmModal({
        confirmModalOpen: true,
        type: 0,
        postId: post._id,
        role: user?.role || 0,
      })
    );
  };

  const getComments = async () => {
    setIsCmtLoading(true);

    const { response } = await postService.getComments({
      post_id: post._id,
      limit: 10,
      page: page,
      sort_field: sortField,
      sort_value: -1,
    });

    if (response) {
      setTotalPage(response.data.result.total_page);

      if (comments.length > 0) {
        const existingComments = [...comments];
        const resComments = response.data.result.post_children;
        let newComments = [...existingComments, ...resComments];
        if (post.resolved_id) {
          newComments = filterRemovePinComment(
            [...newComments],
            post.resolved_id
          );
        }
        setComments(newComments);
      } else {
        let newComments = response.data.result.post_children;
        if (post.resolved_id) {
          newComments = filterRemovePinComment(
            [...newComments],
            post.resolved_id
          );
        }
        setComments(newComments);
      }
    }

    setIsCmtLoading(false);
  };

  const getCommentsAfterComment = async () => {
    setIsCmtLoading(true);

    const { response } = await postService.getComments({
      post_id: post._id,
      limit: 10,
      page: page,
      sort_field: sortField,
      sort_value: -1,
    });

    if (response) {
      setTotalPage(response.data.result.total_page);
      let newComments = response.data.result.post_children;
      if (post.resolved_id) {
        newComments = filterRemovePinComment(
          [...newComments],
          post.resolved_id
        );
      }
      setComments(newComments);
      setShowFormAnswer(false);
    }

    setIsCmtLoading(false);
  };

  const handleCommentsLoadMore = () => {
    if (page < totalPage) {
      setPage(page + 1);
    }
  };

  const handleChangeSort = (sort: string) => {
    if (sort !== sortField) {
      setSortField(sort);
      setPage(1);
      setComments([]);
    }
  };

  const filterRemovePinComment = (comments: Post[], resolved_id: string) => {
    return comments.filter((comment) => {
      return comment._id !== resolved_id;
    });
  };

  const getPinComment = async () => {
    if (post.resolved_id) {
      const { response } = await postService.getPost({
        post_id: post.resolved_id,
      });

      if (response) {
        setDetailPinComment(response.data.result);
      }
    }
  };

  const pinComment = async (commentId: string | null, otherUserId: string) => {
    const { response } = await postService.pinComment({
      post_id: post._id,
      resolved_id: commentId,
    });
    if (response) {
      window.location.reload();

      if (typeof commentId === "string") {
        updateUserPoints(otherUserId, USER_UPDATE_POINT.pinComment);
        toast.success(t("post.Answer has been pinned"));
      } else {
        toast.success(t("post.Answer has been unpinned"));
        updateUserPoints(otherUserId, USER_UPDATE_POINT.unpinComment);
      }
    }
  };

  const getOpenAIComment = async () => {
    setIsAILoading(true);

    const { response } = await openaiService.chatCompletions({
      content: post.title + " " + post.content,
    });
    if (response && response.trim() !== "") {
      postOpenAIComment(response);
    }

    setIsAILoading(false);
  };

  const postOpenAIComment = async (content: string) => {
    const data = {
      post_id: "",
      parent_id: post._id,
      title: null,
      content: content,
      type: POST_TYPE.Comment,
      hashtags: [],
    };
    const { response } = await postService.postOpenAI(data);

    if (response) {
      window.location.reload();
      toast.success(t("post.OpenAI has answered your question"));
    }
  };

  const updateUserPoints = async (otherUserId: string, point: number) => {
    if (user && user._id !== otherUserId) {
      await userService.updatePoints({
        user_id: otherUserId,
        point: point,
      });
    }
  };

  const getSuperChild = (posts: Post[]) => {
    setSuperChild((prevSuperChild) => [...prevSuperChild, ...posts]);
  };

  return post ? (
    <div
      className={`border rounded-lg p-4 dark:bg-gray-800 dark:border-gray-900 dark:text-gray-300 ${
        !isRepost && "shadow-md"
      }`}
    >
      <div className="space-y-2">
        <div className="flex justify-between">
          {/* Info user start */}
          <PostInfoUser user_detail={post.user_detail} />
          {/* Info user end */}

          {/* Post menu start */}
          {user && !isView && (
            <Menu placement="bottom-end">
              <MenuHandler>
                <IconButton
                  variant="text"
                  className="rounded-full dark:text-gray-300"
                >
                  <EllipsisHorizontalIcon className="w-8 h-8" />
                </IconButton>
              </MenuHandler>
              <MenuList className="dark:bg-gray-900 dark:border-gray-900 dark:text-gray-300">
                <MenuItem
                  className="flex items-center gap-2"
                  onClick={() =>
                    handleBookmark(post._id, post.user_detail._id, bookmark)
                  }
                >
                  {bookmark ? (
                    <>
                      <BookmarkSlashIcon className="w-5 h-5" />{" "}
                      {t("post.Unmark")}
                    </>
                  ) : (
                    <>
                      <BookmarkIcon className="w-5 h-5" /> {t("post.Mark")}
                    </>
                  )}
                </MenuItem>

                {user._id !== post.user_detail._id && !report && (
                  <MenuItem
                    className="flex items-center gap-2"
                    onClick={handleReport}
                  >
                    <ExclamationTriangleIcon className="w-5 h-5" />{" "}
                    {t("post.Report")}
                  </MenuItem>
                )}

                {user._id === post.user_detail._id && (
                  <MenuItem
                    className="flex items-center gap-2"
                    onClick={() => navigate(`/post?post_id=${post._id}`)}
                  >
                    <PencilSquareIcon className="w-5 h-5" /> {t("post.Edit")}
                  </MenuItem>
                )}

                {user._id === post.user_detail._id || user.role === 1 ? (
                  <MenuItem
                    className="flex items-center gap-2"
                    onClick={handleDelete}
                  >
                    <TrashIcon className="w-5 h-5" /> {t("post.Delete")}
                  </MenuItem>
                ) : (
                  <></>
                )}
              </MenuList>
            </Menu>
          )}
          {/* Post menu end */}
        </div>

        <div className="space-y-4">
          {/* Post title start */}
          <div className="space-y-2">
            <div className="mt-4 sm:flex sm:items-center sm:justify-between space-y-2">
              <div className="flex items-center gap-2">
                {post.resolved_id ? (
                  <Chip value={t("post.Resolved")} color="yellow" />
                ) : (
                  <></>
                )}
                {post.is_bookmarked ? (
                  <Chip value={t("post.Marked")} color="green" />
                ) : (
                  <></>
                )}
              </div>
              <div className="flex items-center justify-end gap-4">
                {post.created_at && <Time time={post.created_at} />}
                {post.views_count && <View view={post.views_count} />}
              </div>
            </div>

            {post.title && (
              <Typography
                onClick={() => navigate(`/${post._id}`)}
                className="font-bold text-lg text-gary-900 cursor-pointer hover:text-blue-500"
              >
                {post.title}
              </Typography>
            )}
          </div>
          {/* Post title end */}

          <hr className="dark:border-gray-300" />

          {/* Content start */}
          <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-900">
            <div
              className={`break-words ${!isDetail && "line-clamp-3"}`}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            {!isDetail && (
              <Typography
                onClick={() => navigate(`/${post._id}`)}
                className="w-fit font-bold text-sm cursor-pointer hover:underline"
              >
                {t("post.See more")}
              </Typography>
            )}
          </div>
          {/* Content end */}

          {/* Medias start */}
          {post.medias && post.medias.length > 0 && isDetail
            ? post.medias.map((media, key) => (
                <img
                  className="rounded-lg"
                  src={media}
                  key={key}
                  alt="img"
                  loading="lazy"
                />
              ))
            : post.medias &&
              post.medias[0] && (
                <div className="flex justify-center">
                  <img
                    className="rounded-lg"
                    src={post.medias[0]}
                    alt="img"
                    loading="lazy"
                  />
                </div>
              )}
          {/* Medias end */}

          {/* Repost start */}
          {post.type === POST_TYPE.RePost && repost && (
            <PostCard post={repost} isDetail={false} isRepost={true} isView />
          )}
          {/* Repost end */}

          {/* Tag list start */}
          {post.hashtags.map(
            ({ _id, name }) =>
              _id && name && <TagButton key={_id} id={_id} name={name} />
          )}
          {/* Tag list end */}

          {!isView && (
            <>
              <hr className="dark:border-gray-300" />

              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={() =>
                    handleVote(post._id, post.user_detail._id, vote)
                  }
                  variant="text"
                  fullWidth
                  className={`flex items-center justify-center gap-2 normal-case text-base dark:bg-gray-900 ${
                    vote ? "text-blue-500" : "text-gray-900 dark:text-gray-300"
                  }`}
                >
                  <HandThumbUpIcon className="w-5 h-5" />
                  {votesCount > 0 && votesCount}{" "}
                  <span className="hidden sm:inline">{t("post.Vote")}</span>
                </Button>

                <Button
                  onClick={handleComment}
                  variant="text"
                  fullWidth
                  className="flex items-center justify-center gap-2 normal-case text-base text-gray-900 dark:text-gray-300 dark:bg-gray-900"
                >
                  <ChatBubbleLeftIcon className="w-5 h-5" />
                  {post.comments_count > 0 && post.comments_count}{" "}
                  <span className="hidden sm:inline">{t("post.Answer")}</span>
                </Button>

                <Button
                  onClick={handleRepost}
                  variant="text"
                  fullWidth
                  className="flex items-center justify-center gap-2 normal-case text-base text-gray-900 dark:text-gray-300 dark:bg-gray-900"
                >
                  <ShareIcon className="w-5 h-5" />
                  {post.reposts_count > 0 && post.reposts_count}{" "}
                  <span className="hidden sm:inline">{t("post.Repost")}</span>
                </Button>
              </div>
            </>
          )}

          {isDetail && !isView && user && (
            <div className="space-y-4">
              {/* Comment form start */}
              {showFormAnswer && (
                <>
                  <hr className="dark:border-gray-300" />
                  <CommentForm
                    post_id=""
                    parent_id={post._id}
                    type={POST_TYPE.Comment}
                    content=""
                    getCommentsAfterComment={getCommentsAfterComment}
                  />
                </>
              )}
              {/* Comment form end */}

              {/* OpenAI is typing comments */}
              {isAILoading && <TypingComment />}

              {/* Comments start */}
              {post.comments_count > 0 && (
                <div className="space-y-4">
                  {/* Comments menu start */}
                  <div className="flex justify-end">
                    <MenuFilter
                      content={COMMENTS_SORT}
                      selected={sortField}
                      handleChange={handleChangeSort}
                    />
                  </div>

                  {isCmtLoading ? (
                    <div className="relative h-80">
                      <Loading />
                    </div>
                  ) : (
                    <>
                      {detailPinComment && (
                        <Comment
                          comment={detailPinComment}
                          currentUser={user}
                          postUserId={post.user_detail._id}
                          resolvedId={post.resolved_id}
                          levelComment={0}
                          superChild={superChild}
                          userParent={post.user_detail}
                          votePost={votePost}
                          pinComment={pinComment}
                          getSuperChild={getSuperChild}
                          getCommentsAfterComment={getCommentsAfterComment}
                        />
                      )}
                      {comments.length > 0 &&
                        comments.map((item) => (
                          <Comment
                            key={item._id}
                            comment={item}
                            currentUser={user}
                            postUserId={post.user_detail._id}
                            resolvedId={post.resolved_id}
                            levelComment={0}
                            superChild={superChild}
                            userParent={post.user_detail}
                            votePost={votePost}
                            pinComment={pinComment}
                            getSuperChild={getSuperChild}
                            getCommentsAfterComment={getCommentsAfterComment}
                          />
                        ))}
                    </>
                  )}
                  {/* Comments menu end */}
                </div>
              )}
              {/* Comments end */}

              {/* Load more comments start */}
              <hr className="dark:border-gray-300" />

              <div className="flex items-center justify-between">
                {page < totalPage ? (
                  <Button
                    className="!overflow-visible normal-case flex items-center justify-center gap-1 dark:text-gray-300"
                    size="sm"
                    variant="text"
                    onClick={handleCommentsLoadMore}
                  >
                    {isCmtLoading ? (
                      <Spinner className="w-5 h-5" />
                    ) : (
                      <PlusCircleIcon className="w-5 h-5" />
                    )}
                    {t("post.Load more")}
                  </Button>
                ) : (
                  <div></div>
                )}

                {comments.length > 0 && post.comments_count > 0 && (
                  <Typography>
                    {post.resolved_id ? comments.length + 1 : comments.length}{" "}
                    {t("post.of")} {post.comments_count}
                  </Typography>
                )}
              </div>
              {/* Load more comments end */}
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <NotFoundAlert message={t("post.Question not found")} type={"error"} />
  );
};

export default PostCard;
