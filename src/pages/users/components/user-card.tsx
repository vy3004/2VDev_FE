import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Avatar, Button, Typography } from "@material-tailwind/react";
import {
  StarIcon,
  UserMinusIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import LevelChip from "../../../components/common/level-chip";

import userService from "../../../services/user-service";
import { UserCardType } from "../../../utils/types";

interface UserCardProps {
  current_username?: string;
  user_detail: UserCardType;
}

const UserCard: React.FC<UserCardProps> = ({
  current_username,
  user_detail,
}) => {
  const navigate = useNavigate();
  const [follow, setFollow] = useState(user_detail.is_followed);

  const handleFollowUser = async (otherUserId: string, type: boolean) => {
    try {
      if (!type) {
        const { response } = await userService.follow({
          followed_user_id: otherUserId,
        });

        if (response) {
          toast.success(response.data.message);
          setFollow(!type);
        }
      } else {
        const { response } = await userService.unFollow({
          user_id: otherUserId,
        });

        if (response) {
          toast.success(response.data.message);
          setFollow(!type);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="flex flex-col items-center border hover:border-black rounded-lg py-6 space-y-4 col-span-6 sm:col-span-3 lg:col-span-2"
      key={user_detail._id}
    >
      <div className="flex flex-col items-center space-y-2 text-center">
        <Avatar
          onClick={() => navigate(`/profile/${user_detail.username}`)}
          variant="circular"
          size="xl"
          alt="avatar"
          className="border border-gray-900 p-0.5 cursor-pointer"
          src={
            user_detail.avatar ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYmkp9a2rrD1Sskb9HLt5mDaTt4QaIs8CcBg&usqp=CAU"
          }
        />
        <div className="flex items-center gap-2">
          <Typography
            onClick={() => navigate(`/profile/${user_detail.username}`)}
            className="font-bold cursor-pointer hover:text-blue-500"
          >
            {user_detail.name}
          </Typography>
          {current_username !== user_detail.username && (
            <Button
              className="flex items-center gap-2 normal-case rounded-lg px-1 py-1"
              variant="text"
              onClick={() => handleFollowUser(user_detail._id, follow)}
            >
              {follow ? (
                <UserMinusIcon className="w-5 h-5" />
              ) : (
                <UserPlusIcon className="w-5 h-5" />
              )}
            </Button>
          )}
        </div>

        <LevelChip level={user_detail.point} />

        <div className="text-orange-500 flex gap-1">
          <StarIcon className="w-4 h-4" />
          <Typography className="text-sm font-semibold">
            {user_detail.point}
          </Typography>
        </div>
      </div>

      {user_detail.followers || user_detail.following ? (
        <div className="border border-gray-700 rounded-lg px-2 py-1 flex flex-col text-gray-700 font-bold">
          <p className="text-sm">{user_detail.followers} followers</p>
          <p className="text-sm">{user_detail.following} following</p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default UserCard;
