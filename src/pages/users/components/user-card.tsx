import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { Avatar, Button, Typography } from "@material-tailwind/react";
import { UserMinusIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import LevelChip from "../../../components/common/level-chip";

import userService from "../../../services/user-service";
import { User, UserCardType } from "../../../utils/types";
import { USER_UPDATE_POINT } from "../../../utils/constant";
import UserPoint from "../../../components/common/user-point";

interface UserCardProps {
  currentUser: User;
  userDetail: UserCardType;
}

const UserCard: React.FC<UserCardProps> = ({ currentUser, userDetail }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [follow, setFollow] = useState(userDetail.is_followed);

  const handleFollowUser = async (otherUserId: string, type: boolean) => {
    if (!type) {
      const { response } = await userService.follow({
        followed_user_id: otherUserId,
      });

      if (response) {
        toast.success(t("user.You have follow successfully"));
        setFollow(!type);
        updatePoints(otherUserId, USER_UPDATE_POINT.follow);
      }
    } else {
      const { response } = await userService.unFollow({
        user_id: otherUserId,
      });

      if (response) {
        toast.success(t("user.You have unfollow successfully"));
        setFollow(!type);
        updatePoints(otherUserId, USER_UPDATE_POINT.unFollow);
      }
    }
  };

  const updatePoints = async (otherUserId: string, point: number) => {
    if (otherUserId !== currentUser._id) {
      await userService.updatePoints({
        user_id: otherUserId,
        point: point,
      });
    }
  };

  return (
    <div
      className="flex flex-col items-center border hover:border-black rounded-lg py-6 space-y-4 col-span-6 sm:col-span-3 lg:col-span-2"
      key={userDetail._id}
    >
      <div className="flex flex-col items-center space-y-2 text-center">
        <Avatar
          onClick={() => navigate(`/profile/${userDetail.username}`)}
          variant="circular"
          size="xl"
          alt="avatar"
          className="border border-gray-900 p-0.5 cursor-pointer"
          src={
            userDetail.avatar ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYmkp9a2rrD1Sskb9HLt5mDaTt4QaIs8CcBg&usqp=CAU"
          }
        />
        <div className="flex items-center gap-2">
          <Typography
            onClick={() => navigate(`/profile/${userDetail.username}`)}
            className="font-bold cursor-pointer hover:text-blue-500"
          >
            {userDetail.name}
          </Typography>
          {currentUser.username !== userDetail.username && (
            <Button
              className="flex items-center gap-2 normal-case rounded-lg px-1 py-1"
              variant="text"
              onClick={() => handleFollowUser(userDetail._id, follow)}
            >
              {follow ? (
                <UserMinusIcon className="w-5 h-5" />
              ) : (
                <UserPlusIcon className="w-5 h-5" />
              )}
            </Button>
          )}
        </div>

        <LevelChip level={userDetail.point} />

        <UserPoint point={userDetail.point} />
      </div>

      {userDetail.followers || userDetail.following ? (
        <div className="border border-gray-700 rounded-lg px-2 py-1 flex flex-col text-gray-700 font-bold select-none">
          <p className="text-sm">
            {userDetail.followers} {t("user.followers")}
          </p>
          <p className="text-sm">
            {userDetail.following} {t("user.following")}
          </p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default UserCard;
