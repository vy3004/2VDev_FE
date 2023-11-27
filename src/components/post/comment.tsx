import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Avatar, Button, Spinner, Typography } from "@material-tailwind/react";
import {
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
} from "@heroicons/react/24/solid";
import LevelChip from "../common/level-chip";
import CommentForm from "./comment-form";
import UserPoint from "../common/user-point";
import Time from "../common/time";

import postService from "../../services/post-service";

import { Post, User } from "../../utils/types";
import { POST_TYPE } from "../../utils/constant";

import {
  selectReportModal,
  setReportModal,
} from "../../redux/features/report-modal-slice";
import { setConfirmModal } from "../../redux/features/confirm-modal-slice";

interface CommentProps {
  comment: Post;
  currentUser: User;
  postUserId: string;
  resolvedId: string;
  levelComment: number;
  superChild: Post[];
  userParent: User;
  votePost: (postId: string, otherUserId: string, type: boolean) => void;
  pinComment: (commentId: string | null, otherUserId: string) => Promise<void>;
  getSuperChild: (posts: Post[]) => void;
  getCommentsAfterComment: () => Promise<void>;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  currentUser,
  postUserId,
  resolvedId,
  levelComment,
  superChild,
  userParent,
  votePost,
  pinComment,
  getSuperChild,
  getCommentsAfterComment,
}) => {
  const { t } = useTranslation();
  const { reportModal } = useSelector(selectReportModal);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [children, setChildren] = useState<Post[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [vote, setVote] = useState(comment.is_voted);
  const [votesCount, setVotesCount] = useState(comment.votes_count);
  const [report, setReport] = useState(comment.is_reported);
  const [showEditCommentForm, setShowEditCommentForm] = useState(false);

  const isResolved = resolvedId === comment._id;
  levelComment++;

  useEffect(() => {
    if (reportModal.isReported && reportModal.postId === comment._id)
      setReport(true);
  }, [reportModal, comment._id]);

  useEffect(() => {
    if (levelComment >= 2) {
      getSuperChild(children);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

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
        role: currentUser.role,
      })
    );
  };

  const handlePinComment = () => {
    if (isResolved) {
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
        className="p-0.5 hidden sm:inline"
      />
      <div
        className={`space-y-2 border rounded-lg w-full min-w-0 p-2 ${
          isResolved ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <div className="flex items-center justify-between">
          {postUserId === comment.user_detail._id ? (
            <div className="flex items-center gap-1 text-gray-600">
              <PaintBrushIcon className="w-4 h-4" />
              <Typography className="text-xs font-semibold">
                {t("post.Author")}
              </Typography>
            </div>
          ) : (
            <div></div>
          )}

          {isResolved && <EyeDropperIcon className="w-4 h-4 text-blue-500" />}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Avatar
              src={comment.user_detail.avatar}
              size="sm"
              alt="avatar"
              withBorder={true}
              className="p-0.5 inline sm:hidden"
            />

            <Typography
              onClick={() =>
                navigate(`/profile/${comment.user_detail.username}`)
              }
              className="font-bold text-sm text-blue-500 hover:text-gray-900 cursor-pointer"
            >
              {comment.user_detail.name}
            </Typography>

            <div className="hidden sm:inline">
              <LevelChip level={comment.user_detail.point} />
            </div>

            <div className="hidden sm:inline">
              <UserPoint point={comment.user_detail.point} />
            </div>
          </div>

          <Time time={comment.created_at} />
        </div>

        {levelComment > 2 && (
          <Typography className="text-xs font-bold">
            {t("post.Reply")}{" "}
            <span
              onClick={() => navigate(`/profile/${userParent.username}`)}
              className="text-blue-500 hover:text-gray-900 cursor-pointer"
            >
              {userParent.name}
            </span>
          </Typography>
        )}

        {showEditCommentForm ? (
          // Edit comment form
          <CommentForm
            post_id={comment._id}
            parent_id={comment._id}
            type={POST_TYPE.Comment}
            content={comment.content}
            medias={comment.medias}
            getCommentsAfterComment={getCommentsAfterComment}
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
            {votesCount > 0 && votesCount}{" "}
            <span className="hidden md:inline">{t("post.Vote")}</span>
          </Button>

          <Button
            onClick={() => setShowCommentForm(!showCommentForm)}
            variant="text"
            className="p-2 flex items-center justify-center gap-2 normal-case text-xs"
          >
            <ChatBubbleLeftIcon className="w-4 h-4" />
            <span className="hidden md:inline">{t("post.Reply")}</span>
          </Button>

          {comment.user_detail._id !== currentUser._id && !report && (
            <Button
              onClick={handleReport}
              variant="text"
              className="p-2 flex items-center justify-center gap-2 normal-case text-xs"
            >
              <ExclamationTriangleIcon className="w-4 h-4" />
              <span className="hidden md:inline">{t("post.Report")}</span>
            </Button>
          )}

          {comment.user_detail._id === currentUser._id && (
            <Button
              onClick={() => setShowEditCommentForm(!showEditCommentForm)}
              variant="text"
              className="p-2 flex items-center justify-center gap-2 normal-case text-xs"
            >
              <PencilSquareIcon className="w-4 h-4" />
              <span className="hidden md:inline">{t("post.Edit")}</span>
            </Button>
          )}

          {(comment.user_detail._id === currentUser._id && !isResolved) ||
          currentUser.role === 1 ? (
            <Button
              onClick={handleDelete}
              variant="text"
              className="p-2 flex items-center justify-center gap-2 normal-case text-xs"
            >
              <TrashIcon className="w-4 h-4" />
              <span className="hidden md:inline">{t("post.Delete")}</span>
            </Button>
          ) : (
            <></>
          )}

          {postUserId === currentUser._id && (
            <Button
              onClick={handlePinComment}
              variant="text"
              className="p-2 flex items-center justify-center gap-2 normal-case text-xs"
            >
              <EyeDropperIcon className="w-4 h-4" />
              <span className="hidden md:inline">
                {isResolved ? t("post.Unpin") : t("post.Pin")}
              </span>
            </Button>
          )}
        </div>

        {/* Comment form start */}
        {showCommentForm && (
          <CommentForm
            post_id=""
            parent_id={comment._id}
            type={POST_TYPE.Comment}
            content=""
            getCommentsAfterComment={getCommentsAfterComment}
          />
        )}
        {/* Comment form end */}

        {/* Button show reply start */}
        {comment.comments_count > 0 && !showReplies && (
          <Button
            onClick={() => getReplies(!showReplies)}
            className="py-1 px-2 flex items-center gap-1 normal-case"
            variant="text"
            disabled={loadingReplies}
          >
            {loadingReplies ? (
              <Spinner className="h-4 w-4 m-auto" />
            ) : (
              <ArrowUturnLeftIcon className="w-3 h-3 rotate-180" />
            )}{" "}
            {comment.comments_count > 0 && comment.comments_count}{" "}
            {comment.comments_count === 1 ? t("post.Reply") : t("post.Replies")}
          </Button>
        )}
        {/* Button show reply end */}

        {/* Comment children start */}
        {levelComment < 2 &&
          children &&
          children.map((reply) => (
            <Comment
              key={reply._id}
              comment={reply}
              currentUser={currentUser}
              postUserId={postUserId}
              resolvedId={resolvedId}
              levelComment={levelComment}
              superChild={superChild}
              userParent={comment.user_detail}
              votePost={votePost}
              pinComment={pinComment}
              getSuperChild={getSuperChild}
              getCommentsAfterComment={getCommentsAfterComment}
            />
          ))}
        {/* Comment children end */}

        {superChild.length > 0 &&
          comment._id === superChild[0].parent_id &&
          superChild.map((reply) => (
            <Comment
              key={reply._id}
              comment={reply}
              currentUser={currentUser}
              postUserId={postUserId}
              resolvedId={resolvedId}
              levelComment={levelComment}
              superChild={superChild}
              userParent={
                superChild.find((item) => item._id === reply.parent_id)
                  ?.user_detail || comment.user_detail
              }
              votePost={votePost}
              pinComment={pinComment}
              getSuperChild={getSuperChild}
              getCommentsAfterComment={getCommentsAfterComment}
            />
          ))}
      </div>
    </div>
  );
};

export default Comment;
