import {
  StarIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/solid";
import { Typography, Tooltip, Avatar, Button } from "@material-tailwind/react";
import i18n from "../../configs/i18n";
import { formatTime, formatTimeDistanceToNow } from "../../utils/string-utils";
import { Post } from "../../utils/types";
import LevelChip from "../common/level-chip";
import { useNavigate } from "react-router-dom";

interface CommentCardProps {
  comment: Post;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  const navigate = useNavigate();

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
        className="space-y-2 border rounded-lg w-full min-w-0 p-2 cursor-pointer"
        onClick={() => navigate(`/${comment.parent_id}`)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Typography className="font-bold text-sm text-blue-500 hover:text-gray-900">
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
            <Typography className="text-sm text-gray-600 hover:text-blue-500 flex items-center gap-1">
              <ClockIcon className="w-4 h-4 mb-1" />
              {formatTimeDistanceToNow(comment.created_at, i18n.language)}
            </Typography>
          </Tooltip>
        </div>

        <div
          className="break-words line-clamp-4"
          dangerouslySetInnerHTML={{ __html: comment.content }}
        />

        <div className="flex items-center gap-4">
          <Button
            variant="text"
            className={`p-2 flex items-center justify-center gap-2 normal-case text-xs ${
              comment.is_voted
                ? "text-blue-500"
                : "text-gray-900 dark:text-gray-50"
            }`}
          >
            <HandThumbUpIcon className="w-4 h-4" />
            {comment.votes_count > 0 && comment.votes_count} Like
          </Button>

          <Button
            variant="text"
            className="p-2 flex items-center justify-center gap-2 normal-case text-xs"
          >
            <ChatBubbleLeftIcon className="w-4 h-4" />
            {comment.comments_count > 0 && comment.comments_count}{" "}
            {comment.comments_count > 1 ? "Replies" : "Reply"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
