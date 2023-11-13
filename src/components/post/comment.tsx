import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  Button,
  Spinner,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import {
  ClockIcon,
  ExclamationTriangleIcon,
  HandThumbUpIcon,
  ChatBubbleLeftIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowUturnLeftIcon,
  EyeDropperIcon,
  PaintBrushIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import LevelChip from "../common/level-chip";
import CommentForm from "./comment-form";

import postService from "../../services/post-service";
import { Post } from "../../utils/types";
import { PostType } from "../../utils/constant";
import { formatTime, formatTimeDistanceToNow } from "../../utils/string-utils";
import {
  selectReportModal,
  setReportModal,
} from "../../redux/features/report-modal-slice";
import { setConfirmModal } from "../../redux/features/confirm-modal-slice";

interface CommentProps {
  comment: Post;
  userId: string;
  postUserId: string;
  isPinComment: boolean;
  votePost: (postId: string, otherUserId: string, type: boolean) => void;
  pinComment: (commentId: string | null, otherUserId: string) => Promise<void>;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  userId,
  postUserId,
  isPinComment,
  votePost,
  pinComment,
}) => {
  const { i18n } = useTranslation();
  const { reportModal } = useSelector(selectReportModal);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [children, setChildren] = useState<Post[]>();
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [vote, setVote] = useState(comment.is_voted);
  const [votesCount, setVotesCount] = useState(comment.votes_count);
  const [report, setReport] = useState(comment.is_reported);
  const [showEditCommentForm, setShowEditCommentForm] = useState(false);

  useEffect(() => {
    if (reportModal.isReported && reportModal.postId === comment._id)
      setReport(true);
  }, [reportModal, comment._id]);

  const getReplies = async (show: boolean) => {
    setLoadingReplies(true);
    setShowReplies(show);

    if (show) {
      if (comment._id) {
        const { response } = await postService.getComments({
          post_id: comment._id,
          limit: 20,
          page: 1,
          sort_field: "created_at",
          sort_value: -1,
        });

        if (response) {
          setChildren(response.data.result.post_children);
        }
      }
    }
    setLoadingReplies(false);
  };

  const handleVote = (postId: string, userId: string, type: boolean) => {
    votePost(postId, userId, type);
    setVote(!type);
    setVotesCount((prevCount) => (type ? prevCount - 1 : prevCount + 1));
  };

  const handleReport = () => {
    dispatch(
      setReportModal({
        reportModalOpen: true,
        postId: comment._id,
        otherUserId: comment.user_detail._id,
        isReported: false,
      })
    );
  };

  const handleDelete = () => {
    dispatch(
      setConfirmModal({
        confirmModalOpen: true,
        postId: comment._id,
        type: 1,
      })
    );
  };

  const handlePinComment = () => {
    if (isPinComment) {
      pinComment(null, comment.user_detail._id);
    } else {
      pinComment(comment._id, comment.user_detail._id);
    }
  };

  return (
    <div className="flex gap-4">
      <Avatar
        src={comment.user_detail.avatar}
        size="sm"
        alt="avatar"
        withBorder={true}
        className="p-0.5"
      />
      <div
        className={`space-y-2 border rounded-lg w-full min-w-0 p-2 ${
          isPinComment && "border-blue-500 bg-blue-50"
        }`}
      >
        <div className="flex items-center justify-between">
          {postUserId === comment.user_detail._id ? (
            <div className="flex items-center gap-1 text-gray-600">
              <PaintBrushIcon className="w-4 h-4" />
              <Typography className="text-xs font-semibold">Author</Typography>
            </div>
          ) : (
            <div></div>
          )}
          {isPinComment && <EyeDropperIcon className="w-4 h-4 text-blue-500" />}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Typography
              onClick={() =>
                navigate(`/profile/${comment.user_detail.username}`)
              }
              className="font-bold text-sm text-blue-500 hover:text-gray-900 cursor-pointer"
            >
              {comment.user_detail.name}
            </Typography>

            <LevelChip level={comment.user_detail.point} />

            <div className="text-orange-500 flex gap-1">
              <StarIcon className="w-4 h-4" />
              <Typography className="text-sm font-semibold">
                {comment.user_detail.point} points
              </Typography>
            </div>
          </div>

          <Tooltip content={formatTime(comment.created_at, i18n.language)}>
            <Typography className="text-sm text-gray-600 hover:text-blue-500 cursor-pointer flex items-center gap-1">
              <ClockIcon className="w-4 h-4 mb-1" />
              {formatTimeDistanceToNow(comment.created_at, i18n.language)}
            </Typography>
          </Tooltip>
        </div>

        {showEditCommentForm ? (
          // Edit comment form
          <CommentForm
            post_id={comment._id}
            parent_id={comment._id}
            type={PostType.Comment}
            content={comment.content}
            medias={comment.medias}
          />
        ) : (
          // Content comment
          <div
            className="break-words"
            dangerouslySetInnerHTML={{ __html: comment.content }}
          />
        )}

        <div className="flex items-center gap-4">
          <Button
            onClick={() =>
              handleVote(comment._id, comment.user_detail._id, vote)
            }
            variant="text"
            className={`p-2 flex items-center justify-center gap-2 normal-case text-xs ${
              vote ? "text-blue-500" : "text-gray-900 dark:text-gray-50"
            }`}
          >
            <HandThumbUpIcon className="w-4 h-4" />
            {votesCount > 0 && votesCount} Like
          </Button>

          <Button
            onClick={() => setShowCommentForm(!showCommentForm)}
            variant="text"
            className="p-2 flex items-center justify-center gap-2 normal-case text-xs"
          >
            <ChatBubbleLeftIcon className="w-4 h-4" />
            Reply
          </Button>

          {comment.user_detail._id !== userId && !report && (
            <Button
              onClick={handleReport}
              variant="text"
              className="p-2 flex items-center justify-center gap-2 normal-case text-xs"
            >
              <ExclamationTriangleIcon className="w-4 h-4" />
              Report
            </Button>
          )}

          {comment.user_detail._id === userId && (
            <Button
              onClick={() => setShowEditCommentForm(!showEditCommentForm)}
              variant="text"
              className="p-2 flex items-center justify-center gap-2 normal-case text-xs"
            >
              <PencilSquareIcon className="w-4 h-4" />
              Edit
            </Button>
          )}

          {comment.user_detail._id === userId && !isPinComment && (
            <Button
              onClick={handleDelete}
              variant="text"
              className="p-2 flex items-center justify-center gap-2 normal-case text-xs"
            >
              <TrashIcon className="w-4 h-4" />
              Delete
            </Button>
          )}

          {postUserId === userId && (
            <Button
              onClick={handlePinComment}
              variant="text"
              className="p-2 flex items-center justify-center gap-2 normal-case text-xs"
            >
              <EyeDropperIcon className="w-4 h-4" />
              {isPinComment ? "Unpin" : "Pin"}
            </Button>
          )}
        </div>

        {/* Comment form start */}
        {showCommentForm && (
          <CommentForm
            post_id=""
            parent_id={comment._id}
            type={PostType.Comment}
            content=""
          />
        )}
        {/* Comment form end */}

        {/* Button show reply start */}
        {comment.comments_count > 0 && (
          <Button
            onClick={() => getReplies(!showReplies)}
            className="py-1 px-2 flex items-center gap-1 normal-case"
            variant="text"
            disabled={loadingReplies}
          >
            {loadingReplies ? (
              <Spinner className="h-4 w-4 m-auto" />
            ) : (
              <ArrowUturnLeftIcon
                className={`w-3 h-3 ${!showReplies && "rotate-180"}`}
              />
            )}{" "}
            {comment.comments_count > 0 && comment.comments_count}{" "}
            {comment.comments_count === 1 ? "Reply" : "Replies"}
          </Button>
        )}
        {/* Button show reply end */}

        {/* Comment children start */}
        {showReplies &&
          children &&
          children.map((reply) => (
            <Comment
              key={reply._id}
              comment={reply}
              userId={userId}
              postUserId={comment.user_detail._id}
              isPinComment={isPinComment}
              votePost={votePost}
              pinComment={pinComment}
            />
          ))}
        {/* Comment children end */}
      </div>
    </div>
  );
};

export default Comment;
