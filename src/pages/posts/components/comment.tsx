import { useState } from "react";
import { useTranslation } from "react-i18next";

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
  UserPlusIcon,
  HandThumbUpIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import { ArrowUturnLeftIcon, StarIcon } from "@heroicons/react/24/solid";

import LevelChip from "../../../components/common/level-chip";
import CommentForm from "./comment-form";

import postService from "../../../services/post-service";
import {
  formatTimeDistanceToNow,
  formatTime,
} from "../../../utils/string-utils";
import { Post } from "../../../utils/types";
import { PostType } from "../../../utils/constant";

interface CommentProps {
  comment: Post;
  user_id: string;
  votePost: (postId: string, type: boolean) => void;
  followUser: (otherUserId: string, type: boolean) => void;
  handleReport: () => void;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  user_id,
  votePost,
  followUser,
  handleReport,
}) => {
  const { i18n } = useTranslation();

  const [children, setChildren] = useState<Post[]>();
  const [loading, setLoading] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [vote, setVote] = useState(false);
  const [follow, setFollow] = useState(false);

  const getReplies = async (show: boolean) => {
    setLoading(true);
    setShowReplies(show);

    if (show) {
      if (comment._id) {
        const { response } = await postService.getComments({
          post_id: comment._id,
          limit: 20,
          page: 1,
        });

        if (response) {
          setChildren(response.data.result.post_children);
        }
      }
    }
    setLoading(false);
  };

  const handleVote = (postId: string, type: boolean) => {
    votePost(postId, type);
    setVote(!type);
  };

  const handleFollow = (otherUserId: string, type: boolean) => {
    followUser(otherUserId, type);
    setFollow(!type);
  };

  return (
    <div className="flex gap-4">
      <Avatar
        src={comment.user_detail[0].avatar}
        size="sm"
        alt="avatar"
        withBorder={true}
        className="p-0.5"
      />
      <div className="space-y-2 border rounded-lg w-full p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Typography
              as="a"
              href="#"
              className="font-bold text-sm text-blue-500 hover:text-gray-900"
            >
              {comment.user_detail[0].name}
            </Typography>

            <LevelChip level={comment.user_detail[0].point} />

            <div className="text-orange-500 flex gap-1">
              <StarIcon className="w-4 h-4" />
              <Typography className="text-sm font-semibold">
                {comment.user_detail[0].point} points
              </Typography>
            </div>

            <Button
              onClick={() => handleFollow(comment.user_detail[0]._id, follow)}
              variant="text"
              className="p-2 flex items-center justify-center gap-2 normal-case text-xs"
            >
              <UserPlusIcon className="w-4 h-4" />
              Follow
            </Button>
          </div>

          <Tooltip content={formatTime(comment.created_at, i18n.language)}>
            <Typography className="text-sm text-gray-600 hover:text-blue-500 cursor-pointer flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              {formatTimeDistanceToNow(comment.created_at, i18n.language)}
            </Typography>
          </Tooltip>
        </div>

        {/* Comment content start */}
        <div dangerouslySetInnerHTML={{ __html: comment.content }} />
        {/* Comment content end */}

        <div className="flex items-center gap-4">
          <Button
            onClick={() => handleVote(comment._id, vote)}
            variant="text"
            className="p-2 flex items-center justify-center gap-2 normal-case text-xs"
          >
            <HandThumbUpIcon className="w-4 h-4" />
            {comment.votes_count > 0 && comment.votes_count} Like
          </Button>

          <Button
            onClick={() => setShowCommentForm(!showCommentForm)}
            variant="text"
            className="p-2 flex items-center justify-center gap-2 normal-case text-xs"
          >
            <ChatBubbleLeftIcon className="w-4 h-4" />
            Reply
          </Button>

          <Button
            variant="text"
            className="p-2 flex items-center justify-center gap-2 normal-case text-xs"
          >
            <ExclamationTriangleIcon className="w-4 h-4" />
            Report
          </Button>
        </div>

        {/* Comment form start */}
        {showCommentForm && (
          <CommentForm
            user_id={user_id}
            parent_id={comment._id}
            type={PostType.Comment}
            content=""
          />
        )}
        {/* Comment form end */}

        {/* Button show reply start */}
        {comment.comment_count > 0 && (
          <Button
            onClick={() => getReplies(!showReplies)}
            className="py-1 px-2 flex items-center gap-1 normal-case"
            variant="text"
          >
            {loading ? (
              <Spinner className="h-4 w-4 m-auto" />
            ) : (
              <ArrowUturnLeftIcon
                className={`w-3 h-3 ${!showReplies && "rotate-180"}`}
              />
            )}{" "}
            {comment.comment_count > 0 && comment.comment_count}{" "}
            {comment.comment_count === 1 ? "Reply" : "Replies"}
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
              user_id={user_id}
              votePost={votePost}
              followUser={followUser}
              handleReport={handleReport}
            />
          ))}
        {/* Comment children end */}
      </div>
    </div>
  );
};

export default Comment;
