/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  Avatar,
  Button,
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
  UserMinusIcon,
  UserPlusIcon,
  HandThumbUpIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  EllipsisHorizontalIcon,
  PlusCircleIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import LevelChip from "../common/level-chip";
import NotFoundAlert from "../common/not-found-alert";
import TagButton from "../common/tag-button";
import MenuFilter from "../common/menu-filter";
import CommentForm from "./comment-form";
import Comment from "./comment";

import voteService from "../../services/vote-service";
import bookmarkService from "../../services/bookmark-service";
import userService from "../../services/user-service";
import postService from "../../services/post-service";

import { selectUser } from "../../redux/features/user-slice";
import {
  selectReportModal,
  setReportModal,
} from "../../redux/features/report-modal-slice";
import { setConfirmModal } from "../../redux/features/confirm-modal-slice";

import { Post } from "../../utils/types";
import { COMMENTS_SORT, PostType } from "../../utils/constant";
import { formatTime, formatTimeDistanceToNow } from "../../utils/string-utils";

interface PostCardProps {
  post: Post;
  is_detail: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, is_detail }) => {
  const { i18n } = useTranslation();
  const { user } = useSelector(selectUser);
  const { reportModal } = useSelector(selectReportModal);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // console.log("POST", post);

  const [vote, setVote] = useState(post.is_voted);
  const [votesCount, setVotesCount] = useState(post.votes_count);
  const [bookmark, setBookmark] = useState(false);
  const [follow, setFollow] = useState(false);
  const [report, setReport] = useState(post.is_reported);
  const [showFormAnswer, setShowFormAnswer] = useState(false);
  const [comments, setComments] = useState<Post[]>([]);
  const [sortField, setSortField] = useState("created_at");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (reportModal.isReported && reportModal.postId === post._id)
      setReport(true);
  }, [reportModal, post._id]);

  useEffect(() => {
    if (is_detail) {
      if (page > 1) {
        getComments();
      }
    }
  }, [page]);

  useEffect(() => {
    if (is_detail) {
      getComments();
    }
  }, [sortField]);

  const votePost = async (postId: string, type: boolean) => {
    try {
      if (!type) {
        const { response } = await voteService.votePost({
          post_id: postId,
        });

        if (response) {
          toast.success(response.data.message);
        }
      } else {
        const { response } = await voteService.removeVotePost({
          post_id: postId,
        });

        if (response) {
          toast.success(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleVote = (postId: string, type: boolean) => {
    votePost(postId, type);
    setVote(!type);
    setVotesCount((prevCount) => (type ? prevCount - 1 : prevCount + 1));
  };

  const followUser = async (otherUserId: string, type: boolean) => {
    try {
      if (!type) {
        const { response } = await userService.follow({
          followed_user_id: otherUserId,
        });

        if (response) {
          toast.success(response.data.message);
        }
      } else {
        const { response } = await userService.unfollow({
          user_id: otherUserId,
        });

        if (response) {
          toast.success(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollow = (otherUserId: string, type: boolean) => {
    followUser(otherUserId, type);
    setFollow(!type);
  };

  const bookmarkPost = async (postId: string, type: boolean) => {
    try {
      if (!type) {
        const { response } = await bookmarkService.bookmarkPost({
          post_id: postId,
        });

        if (response) {
          toast.success(response.data.message);
        }
      } else {
        const { response } = await bookmarkService.unmarkPost({
          post_id: postId,
        });

        if (response) {
          toast.success(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookmark = (postId: string, type: boolean) => {
    bookmarkPost(postId, type);
    setBookmark(!type);
  };

  const handleReport = () => {
    dispatch(
      setReportModal({
        reportModalOpen: true,
        postId: post._id,
        isReported: false,
      })
    );
  };

  const handleComment = () => {
    is_detail ? setShowFormAnswer(!showFormAnswer) : navigate(`/${post._id}`);
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
      limit: 20,
      page: page,
      sort_field: sortField,
      sort_value: -1,
    });

    if (response) {
      setTotalPage(response.data.result.total_page);

      if (comments.length > 0) {
        const existingComments = [...comments];
        const newComments = response.data.result.post_children;
        setComments([...existingComments, ...newComments]);
      } else {
        setComments(response.data.result.post_children);
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

  return post && user ? (
    <div className="border rounded-lg shadow-md p-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          {/* Info user start */}
          <div className="flex items-center gap-4">
            <Avatar
              src={post.user_detail.avatar}
              size="lg"
              alt="avatar"
              withBorder={true}
              className="p-0.5"
            />
            <div>
              <div className="flex items-center gap-4">
                <Typography className="font-bold text-blue-500 cursor-pointer hover:text-gray-900">
                  {post.user_detail.name}
                </Typography>
                <LevelChip level={post.user_detail.point} />
              </div>

              <div className="text-orange-500 flex gap-1">
                <StarIcon className="w-4 h-4" />
                <Typography className="text-sm font-semibold">
                  {post.user_detail.point} points
                </Typography>
              </div>
            </div>
          </div>
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
                onClick={() => handleBookmark(post._id, bookmark)}
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

              {user._id !== post.user_detail._id && (
                <MenuItem
                  className="flex items-center gap-2"
                  onClick={() => handleFollow(post.user_detail._id, follow)}
                >
                  {follow ? (
                    <>
                      <UserMinusIcon className="w-5 h-5" /> Unfollow{" "}
                      {post.user_detail.name}
                    </>
                  ) : (
                    <>
                      <UserPlusIcon className="w-5 h-5" /> Follow{" "}
                      {post.user_detail.name}
                    </>
                  )}
                </MenuItem>
              )}

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
          <div>
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

            <Typography
              onClick={() => navigate(`/${post._id}`)}
              className="font-bold text-lg text-gary-900 cursor-pointer hover:text-blue-500"
            >
              {post.title}
            </Typography>
          </div>
          {/* Post title end */}

          <hr />

          {/* Content start */}
          <div className="p-2 rounded-lg bg-gray-50">
            <div
              className={`break-words ${!is_detail && "line-clamp-3"}`}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            {!is_detail && (
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
          {is_detail
            ? post.medias.map((media, key) => (
                <img
                  className="rounded-lg"
                  src={media}
                  key={key}
                  alt="img"
                  loading="lazy"
                />
              ))
            : post.medias[0] && (
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

          {/* Tag list start */}
          {post.hashtags.map((tag) => (
            <TagButton key={tag._id} id={tag._id} name={tag.name} />
          ))}
          {/* Tag list end */}

          <hr />

          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={() => handleVote(post._id, vote)}
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
              {post.comment_count > 0 && post.comment_count} Comment
            </Button>

            <Button
              variant="text"
              fullWidth
              className="flex items-center justify-center gap-2 normal-case text-base"
            >
              <ShareIcon className="w-5 h-5" />
              {post.repost_count > 0 && post.repost_count} Repost
            </Button>
          </div>
          {is_detail && (
            <div className="space-y-4">
              {/* Comment form start */}
              {showFormAnswer && (
                <>
                  <hr />
                  <CommentForm
                    post_id=""
                    user_id={user._id}
                    parent_id={post._id}
                    type={PostType.Comment}
                    content=""
                  />
                </>
              )}
              {/* Comment form end */}

              {/* Comments menu start */}
              <div className="flex justify-end">
                <MenuFilter
                  content={COMMENTS_SORT}
                  handleChange={handleChangeSort}
                />
              </div>
              {/* Comments menu end */}

              {/* Comments start */}
              {comments &&
                comments.map((item) => (
                  <Comment
                    key={item._id}
                    comment={item}
                    user_id={user._id}
                    votePost={votePost}
                    followUser={followUser}
                  />
                ))}
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
                      {comments.length} of {post.comment_count}
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
