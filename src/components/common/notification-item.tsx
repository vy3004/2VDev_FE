import React from "react";
import { useTranslation } from "react-i18next";

import {
  BookmarkIcon,
  ChatBubbleLeftIcon,
  ClockIcon,
  EyeDropperIcon,
  HandThumbUpIcon,
  ShareIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import { MenuItem, Badge, Typography, Avatar } from "@material-tailwind/react";

import { formatTimeDistanceToNowAbout } from "../../utils/string-utils";
import { NOTIFICATION_CONTENT } from "../../utils/constant";
import { Notification } from "../../utils/types";

const NotificationIcons = [
  {
    icon: HandThumbUpIcon,
    color: "bg-red-500",
  },
  {
    icon: HandThumbUpIcon,
    color: "bg-orange-500",
  },
  {
    icon: HandThumbUpIcon,
    color: "bg-yellow-500",
  },
  {
    icon: ChatBubbleLeftIcon,
    color: "bg-green-500",
  },
  {
    icon: ShareIcon,
    color: "bg-blue-500",
  },
  {
    icon: EyeDropperIcon,
    color: "bg-indigo-500",
  },
  {
    icon: BookmarkIcon,
    color: "bg-purple-500",
  },
  {
    icon: UserPlusIcon,
    color: "bg-pink-500",
  },
];

interface NotificationItemProps {
  notification: Notification;
  handleReadNotification: (notification: Notification) => Promise<void>;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  handleReadNotification,
}) => {
  const { t } = useTranslation();

  return (
    <MenuItem
      className="flex items-center gap-1"
      onClick={() => handleReadNotification(notification)}
    >
      <div>
        <Badge
          content={React.createElement(
            NotificationIcons[notification.type].icon,
            {
              className: "h-3 w-3 text-white",
              strokeWidth: 2,
            }
          )}
          overlap="circular"
          placement="bottom-end"
          className={`${
            NotificationIcons[notification.type].color
          } border-2 border-white}`}
          containerProps={{ className: "w-max" }}
        >
          <Avatar
            variant="circular"
            alt={notification.sender_detail.username}
            src={notification.sender_detail.avatar}
            size="lg"
          />
        </Badge>
      </div>
      <Badge
        className={`w-4 h-4 ${notification.is_readed ? "hidden" : ""}`}
        containerProps={{ className: "w-full" }}
        color="blue"
        withBorder
      >
        <div className="space-y-2 w-full py-2 px-3">
          <Typography variant="small" color="gray" className="font-bold">
            <span className="text-blue-500">
              {notification.sender_detail.name}
            </span>{" "}
            {t(`notification.${NOTIFICATION_CONTENT[notification.type]}`)}
          </Typography>
          <Typography className="flex items-center gap-1 text-sm font-medium text-blue-gray-500">
            <ClockIcon className="h-4 w-4" />
            {formatTimeDistanceToNowAbout(notification.created_at)}
          </Typography>
        </div>
      </Badge>
    </MenuItem>
  );
};

export default NotificationItem;
