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
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import {
  ClockIcon,
  EyeIcon,
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
import TypingComment from "./typing-comment";
import CommentForm from "./comment-form";
import Comment from "./comment";

import voteService from "../../services/vote-service";
import bookmarkService from "../../services/bookmark-service";
import userService from "../../services/user-service";
import postService from "../../services/post-service";
import openaiService from "../../services/openai -service";

import { selectUser } from "../../redux/features/user-slice";
import {
  selectReportModal,
  setReportModal,
} from "../../redux/features/report-modal-slice";
import { setConfirmModal } from "../../redux/features/confirm-modal-slice";
import { setRepostModal } from "../../redux/features/repost-modal-slice";

import { Post } from "../../utils/types";
import {
  COMMENTS_SORT,
  PostType,
  USER_UPDATE_POINT,
} from "../../utils/constant";
import { formatTime, formatTimeDistanceToNow } from "../../utils/string-utils";

interface PostCardProps {
  post: Post;
  isDetail: boolean;
  isRepost?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, isDetail, isRepost }) => {
  const { i18n } = useTranslation();
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
  const [isLoading, setIsLoading] = useState(false);
  const [detailPinComment, setDetailPinComment] = useState<Post>();
  const [repost, setRepost] = useState<Post>();

  useEffect(() => {
    if (reportModal.isReported && reportModal.postId === post._id)
      setReport(true);
  }, [reportModal, post._id]);

  useEffect(() => {
    if (isDetail) {
      if (page > 1) {
        getComments();
      }
    }
  }, [page]);

  useEffect(() => {
    if (isDetail && post.comments_count > 0) {
      getComments();
    }
  }, [sortField]);

  useEffect(() => {
    if (isDetail && post.resolved_id) {
      getPinComment();
    }
  }, []);

  useEffect(() => {
    if (isDetail && post.comments_count === 0 && post.type === PostType.Post) {
      getOpenAIComment();
    }
  }, []);

  useEffect(() => {
    if (post.type === PostType.RePost && post.parent_id) {
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
        toast.success(response.data.message);
        updateUserPoints(otherUserId, USER_UPDATE_POINT.vote);
      }
    } else {
      const { response } = await voteService.removeVotePost({
        post_id: postId,
      });

      if (response) {
        toast.success(response.data.message);
        updateUserPoints(otherUserId, USER_UPDATE_POINT.unVote);
      }
    }
  };

  const handleVote = (postId: string, userId: string, type: boolean) => {
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
        toast.success(response.data.message);
        updateUserPoints(otherUserId, USER_UPDATE_POINT.bookmark);
      }
    } else {
      const { response } = await bookmarkService.unmarkPost({
        post_id: postId,
      });

      if (response) {
        toast.success(response.data.message);
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
      })
    );
  };

  const getComments = async () => {
    setIsLoading(true);

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

    setIsLoading(false);
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
        toast.success("Comment has been pinned");
      } else {
        toast.success("Comment has been unpinned");
        updateUserPoints(otherUserId, USER_UPDATE_POINT.unpinComment);
      }
    }
  };

  const getOpenAIComment = async () => {
    setIsLoading(true);

    const { response } = await openaiService.chatCompletions({
      content: post.title + " " + post.content,
    });
    if (response && response.trim() !== "") {
      postOpenAIComment(response);
    }

    setIsLoading(false);
  };

  const postOpenAIComment = async (content: string) => {
    const data = {
      post_id: "",
      parent_id: post._id,
      title: null,
      content: content,
      type: PostType.Comment,
      hashtags: [],
    };
    const { response } = await postService.postOpenAI(data);

    if (response) {
      window.location.reload();
      toast.success("OpenAI has commented on your post");
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

  return post && user ? (
    <div className={`border rounded-lg p-4 ${!isRepost && "shadow-md"}`}>
      <div className="space-y-2">
        <div className="flex justify-between">
          {/* Info user start */}
          <PostInfoUser user_detail={post.user_detail} />
          {/* Info user end */}

          {/* Post menu start */}
          <Menu placement="bottom-end">
            <MenuHandler>
              <IconButton variant="text" className="rounded-full">
                <EllipsisHorizontalIcon className="w-8 h-8" />
              </IconButton>
            </MenuHandler>
            <MenuList>
              <MenuItem
                className="flex items-center gap-2"
                onClick={() =>
                  handleBookmark(post._id, post.user_detail._id, bookmark)
                }
              >
                {bookmark ? (
                  <>
                    <BookmarkSlashIcon className="w-5 h-5" /> Unmark the post
                  </>
                ) : (
                  <>
                    <BookmarkIcon className="w-5 h-5" /> Bookmark the post
                  </>
                )}
              </MenuItem>

              {user._id !== post.user_detail._id && !report && (
                <MenuItem
                  className="flex items-center gap-2"
                  onClick={handleReport}
                >
                  <ExclamationTriangleIcon className="w-5 h-5" /> Report
                </MenuItem>
              )}

              {user._id === post.user_detail._id && (
                <MenuItem
                  className="flex items-center gap-2"
                  onClick={() => navigate(`/post?post_id=${post._id}`)}
                >
                  <PencilSquareIcon className="w-5 h-5" /> Edit
                </MenuItem>
              )}

              {user._id === post.user_detail._id && (
                <MenuItem
                  className="flex items-center gap-2"
                  onClick={handleDelete}
                >
                  <TrashIcon className="w-5 h-5" /> Delete
                </MenuItem>
              )}
            </MenuList>
          </Menu>
          {/* Post menu end */}
        </div>

        <div className="space-y-4">
          {/* Post title start */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              {post.resolved_id ? (
                <Chip value="Resolved" color="yellow" />
              ) : (
                <div></div>
              )}
              <div className="flex items-center justify-end gap-4">
                <Tooltip content={formatTime(post.created_at, i18n.language)}>
                  <Typography className="text-sm text-gray-600 hover:text-blue-500 cursor-pointer flex items-center gap-1">
                    <ClockIcon className="w-4 h-4" />
                    {formatTimeDistanceToNow(post.created_at, i18n.language)}
                  </Typography>
                </Tooltip>
                <Typography className="text-sm text-gray-600 hover:text-blue-500 cursor-pointer flex items-center gap-1">
                  <EyeIcon className="w-4 h-4" />
                  {post.views_count} views
                </Typography>
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

          <hr />

          {/* Content start */}
          <div className="p-2 rounded-lg bg-gray-50">
            <div
              className={`break-words ${!isDetail && "line-clamp-3"}`}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            {!isDetail && (
              <Typography
                onClick={() => navigate(`/${post._id}`)}
                className="w-fit font-bold text-sm cursor-pointer hover:underline"
              >
                See more
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
          {post.type === PostType.RePost && repost && (
            <PostCard post={repost} isDetail={false} isRepost={true} />
          )}
          {/* Repost end */}

          {/* Tag list start */}
          {post.hashtags.map((tag) => (
            <TagButton key={tag._id} id={tag._id} name={tag.name} />
          ))}
          {/* Tag list end */}

          <hr />

          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={() => handleVote(post._id, post.user_detail._id, vote)}
              variant="text"
              fullWidth
              className={`flex items-center justify-center gap-2 normal-case text-base ${
                vote ? "text-blue-500" : "text-gray-900 dark:text-gray-50"
              }`}
            >
              <HandThumbUpIcon className="w-5 h-5" />
              {votesCount > 0 && votesCount} Like
            </Button>

            <Button
              onClick={handleComment}
              variant="text"
              fullWidth
              className="flex items-center justify-center gap-2 normal-case text-base"
            >
              <ChatBubbleLeftIcon className="w-5 h-5" />
              {post.comments_count > 0 && post.comments_count} Comment
            </Button>

            <Button
              onClick={handleRepost}
              variant="text"
              fullWidth
              className="flex items-center justify-center gap-2 normal-case text-base"
            >
              <ShareIcon className="w-5 h-5" />
              {post.repost_count > 0 && post.repost_count} Repost
            </Button>
          </div>
          {isDetail && (
            <div className="space-y-4">
              {/* Comment form start */}
              {showFormAnswer && (
                <>
                  <hr />
                  <CommentForm
                    post_id=""
                    parent_id={post._id}
                    type={PostType.Comment}
                    content=""
                  />
                </>
              )}
              {/* Comment form end */}

              {/* OpenAI is typing comments */}
              {isLoading && <TypingComment />}

              {/* Comments start */}
              {post.comments_count > 0 && (
                <div className="space-y-4">
                  {/* Comments menu start */}
                  <div className="flex justify-end">
                    <MenuFilter
                      content={COMMENTS_SORT}
                      handleChange={handleChangeSort}
                    />
                  </div>

                  {/* Pin comment start */}
                  {detailPinComment && (
                    <Comment
                      comment={detailPinComment}
                      userId={user._id}
                      postUserId={post.user_detail._id}
                      isPinComment={true}
                      votePost={votePost}
                      pinComment={pinComment}
                    />
                  )}
                  {/* Pin comment end */}

                  {comments.length > 0 &&
                    comments.map((item) => (
                      <Comment
                        key={item._id}
                        comment={item}
                        userId={user._id}
                        postUserId={post.user_detail._id}
                        isPinComment={false}
                        votePost={votePost}
                        pinComment={pinComment}
                      />
                    ))}
                  {/* Comments menu end */}
                </div>
              )}
              {/* Comments end */}

              {/* Load more comments start */}
              {page < totalPage && (
                <>
                  <hr />

                  <div className="flex items-center justify-between">
                    <Button
                      className="!overflow-visible normal-case flex items-center justify-center gap-1"
                      size="sm"
                      variant="text"
                      onClick={handleCommentsLoadMore}
                    >
                      {isLoading ? (
                        <Spinner className="w-5 h-5" />
                      ) : (
                        <PlusCircleIcon className="w-5 h-5" />
                      )}
                      Load more
                    </Button>

                    <Typography>
                      {comments.length} of {post.comments_count}
                    </Typography>
                  </div>
                </>
              )}
              {/* Load more comments end */}
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <NotFoundAlert message="Post not found!" />
  );
};

export default PostCard;
