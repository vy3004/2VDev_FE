import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { ChatBubbleLeftIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";
import { Typography, Avatar, Button } from "@material-tailwind/react";
import LevelChip from "../common/level-chip";
import Time from "../common/time";
import UserPoint from "../common/user-point";

import { Post } from "../../utils/types";

interface CommentCardProps {
  comment: Post;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex gap-4">
      <Avatar
        src={comment.user_detail.avatar}
        size="sm"
        alt="avatar"
        className="p-[1px] hidden sm:inline dark:bg-gray-300"
      />
      <div
        className="space-y-2 border rounded-lg w-full min-w-0 p-2 cursor-pointer dark:bg-gray-800 dark:border-gray-800"
        onClick={() => navigate(`/${comment.parent_id}`)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Avatar
              src={comment.user_detail.avatar}
              size="sm"
              alt="avatar"
              withBorder={true}
              className="p-[1px] sm:hidden inline dark:bg-gray-300"
            />

            <Typography className="font-bold text-sm text-blue-500 hover:text-gray-900 cursor-pointer">
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

        <div
          className="break-words line-clamp-4 dark:text-gray-300"
          dangerouslySetInnerHTML={{ __html: comment.content }}
        />

        <div className="flex items-center gap-4">
          <Button
            variant="text"
            className={`p-2 flex items-center justify-center gap-2 normal-case text-xs ${
              comment.is_voted
                ? "text-blue-500"
                : "text-gray-900 dark:text-gray-300"
            }`}
          >
            <HandThumbUpIcon className="w-4 h-4" />
            {comment.votes_count > 0 && comment.votes_count} {t("post.Vote")}
          </Button>

          <Button
            variant="text"
            className="p-2 flex items-center justify-center gap-2 normal-case text-xs text-gray-900 dark:text-gray-300"
          >
            <ChatBubbleLeftIcon className="w-4 h-4" />
            {comment.comments_count > 0 && comment.comments_count}{" "}
            {comment.comments_count > 1 ? t("post.Reply") : t("post.Replies")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
