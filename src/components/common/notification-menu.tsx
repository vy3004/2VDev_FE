/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { BellIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import {
  Badge,
  Button,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";

import Loading from "./loading";
import NotificationItem from "./notification-item";

import notificationService from "../../services/notification-service";

import { Notification } from "../../utils/types";
import { NOTIFICATION_TYPE } from "../../utils/constant";

const NotificationMenu = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getNotifications = async () => {
    setIsLoading(true);

    const { response } = await notificationService.getNotifications({
      page: page,
      limit: 10,
    });

    if (response) {
      setNotifications(response.data.result.notifications);
      setPage(1);
      setTotalPage(response.data.result.total_page);
    }

    setIsLoading(false);
  };

  const getNotificationsLoadMore = async () => {
    setIsLoading(true);

    const { response } = await notificationService.getNotifications({
      limit: 10,
      page: page,
    });

    if (response) {
      setTotalPage(response.data.result.total_page);

      if (notifications) {
        const existingNotifications = [...notifications];
        const newNotifications = response.data.result.notifications;
        setNotifications([...existingNotifications, ...newNotifications]);
      } else {
        setNotifications(response.data.result.notifications);
      }
    }

    setIsLoading(false);
  };

  const getCountNotifications = async () => {
    const { response } = await notificationService.getCountNotifications();

    if (response) {
      setNotificationCount(response.data.result.noti_count);
    }
  };

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
    setPage(1);
    setNotifications([]);
  };

  const handleReadNotification = async (notification: Notification) => {
    await notificationService.readNotification({
      notification_id: notification._id,
    });
    navigate(
      notification.type === NOTIFICATION_TYPE.Follow
        ? `/profile/${notification.sender_detail.username}`
        : `/${notification.direct_id}`
    );
    handleOpen();
  };

  useEffect(() => {
    getCountNotifications();
  }, []);

  useEffect(() => {
    if (isOpen) {
      getNotifications();
      getCountNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    if (page > 1) getNotificationsLoadMore();
  }, [page]);

  return (
    <Menu open={isOpen} handler={handleOpen}>
      <MenuHandler>
        <div className="flex">
          <Badge
            content={notificationCount > 9 ? "9+" : notificationCount}
            color="blue"
            className={`min-w-[20px] min-h-[20px] ${
              notificationCount > 0 ? "" : "hidden"
            }`}
          >
            <IconButton
              variant="outlined"
              className="h-9 w-9 dark:text-gray-50"
            >
              <BellIcon className="h-5 w-5" />
            </IconButton>
          </Badge>
        </div>
      </MenuHandler>
      <MenuList className="max-h-[400px] sm:max-h-[500px] w-[360px] sm:w-[400px] space-y-2">
        {isLoading ? (
          <div className="relative h-20">
            <Loading />
          </div>
        ) : notifications.length > 0 ? (
          <>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                handleReadNotification={handleReadNotification}
              />
            ))}

            {page < totalPage && (
              <>
                <hr />
                <Button
                  className="!overflow-visible normal-case flex items-center justify-center gap-1"
                  size="sm"
                  variant="text"
                  fullWidth
                  onClick={handleLoadMore}
                >
                  <PlusCircleIcon className="w-5 h-5" />
                  {t("search.Load more")}
                </Button>
              </>
            )}
          </>
        ) : (
          <MenuItem>{t("notification.No notifications")}</MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};

export default NotificationMenu;
