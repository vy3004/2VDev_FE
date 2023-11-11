import { useNavigate } from "react-router-dom";

import { StarIcon } from "@heroicons/react/24/solid";
import { Avatar, Typography } from "@material-tailwind/react";
import LevelChip from "../common/level-chip";

import { User } from "../../utils/types";

interface PostInfoUserProps {
  user_detail: User;
}

const PostInfoUser: React.FC<PostInfoUserProps> = ({ user_detail }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4">
      <Avatar
        src={user_detail.avatar}
        size="lg"
        alt="avatar"
        withBorder={true}
        className="p-0.5 cursor-pointer"
        onClick={() => navigate(`/profile/${user_detail.username}`)}
      />
      <div>
        <div className="flex items-center gap-4">
          <Typography
            onClick={() => navigate(`/profile/${user_detail.username}`)}
            className="font-bold text-blue-500 cursor-pointer hover:text-gray-900"
          >
            {user_detail.name}
          </Typography>
          <LevelChip level={user_detail.point} />
        </div>

        <div className="text-orange-500 flex gap-1">
          <StarIcon className="w-4 h-4" />
          <Typography className="text-sm font-semibold">
            {user_detail.point} points
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default PostInfoUser;
