import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Loading from "./loading";
import NotFoundAlert from "./not-found-alert";
import PostInfoUser from "./post-info-user";

import userService from "../../services/user-service";
import { UserCardType } from "../../utils/types";

const TopUsers = () => {
  const { t } = useTranslation();

  const [users, setUsers] = useState<UserCardType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getUsers = async () => {
    setIsLoading(true);

    const { response } = await userService.getUsers({
      limit: 3,
      page: 1,
      sort_field: "point",
      sort_value: -1,
    });

    if (response) {
      const userData = response.data.result.list_users.map(
        (item: UserCardType) => ({
          _id: item._id,
          name: item.name,
          username: item.username,
          avatar: item.avatar,
          point: item.point,
          is_followed: item.is_followed,
          followers: item.followers,
          following: item.following,
        })
      );
      setUsers(userData);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return isLoading ? (
    <div className="relative h-32">
      <Loading />
    </div>
  ) : users && users.length > 0 ? (
    <div className="space-y-2">
      {users.map((user) => (
        <div
          className="border rounded-lg p-2 bg-white shadow-md dark:bg-gray-900"
          key={user._id}
        >
          <PostInfoUser user_detail={user} />

          <div className="flex items-center gap-4 pl-[4.8rem] font-bold text-gray-600">
            <p>
              {user.followers}{" "}
              {t(`user.${user.followers === 1 ? "follower" : "followers"}`)}
            </p>
            <p>
              {user.following}{" "}
              {t(`user.${user.following === 1 ? "following" : "followings"}`)}
            </p>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <NotFoundAlert message={t("user.Top users not found")} isBack={false} />
  );
};

export default TopUsers;
