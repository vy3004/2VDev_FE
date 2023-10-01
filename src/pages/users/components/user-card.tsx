import { Avatar, Button, Typography } from "@material-tailwind/react";
import LevelChip from "../../../components/common/level-chip";
import { useState } from "react";
import userService from "../../../services/user-service";
import toast from "react-hot-toast";
import { UserMinusIcon, UserPlusIcon } from "@heroicons/react/24/solid";

interface UserCardProps {
  current_username?: string;
  user_id: string;
  username: string;
  name: string;
  avatar: string;
  point: number;
  is_followed: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  current_username,
  user_id,
  username,
  name,
  avatar,
  point,
  is_followed,
}) => {
  const [follow, setFollow] = useState(is_followed);

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
        const { response } = await userService.unfollow({
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
      key={user_id}
    >
      <a
        href={`/profile/${username}`}
        className="flex flex-col items-center space-y-1 text-center hover:opacity-80"
      >
        <Avatar
          variant="circular"
          size="xl"
          alt="tania andrew"
          className="border border-gray-900 p-0.5"
          src={
            avatar ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYmkp9a2rrD1Sskb9HLt5mDaTt4QaIs8CcBg&usqp=CAU"
          }
        />
        <Typography className="font-bold">{name}</Typography>
        <LevelChip level={point} />
      </a>
      {current_username !== username && (
        <Button
          className="flex items-center gap-2 normal-case rounded-full px-3 py-2"
          variant="outlined"
          onClick={() => handleFollowUser(user_id, follow)}
        >
          {follow ? (
            <>
              <UserMinusIcon className="w-4 h-4" />
              <Typography className="text-sm">Unfollow</Typography>
            </>
          ) : (
            <>
              <UserPlusIcon className="w-4 h-4" />
              <Typography className="text-sm">Follow</Typography>
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default UserCard;
