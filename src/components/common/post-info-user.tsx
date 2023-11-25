import { useNavigate } from "react-router-dom";

import { Avatar, Typography } from "@material-tailwind/react";
import LevelChip from "./level-chip";
import UserPoint from "./user-point";

interface PostInfoUserProps {
  user_detail: any;
}

const PostInfoUser: React.FC<PostInfoUserProps> = ({ user_detail }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4">
      <Avatar
        src={user_detail.avatar}
        alt="avatar"
        withBorder={true}
        className="p-0.5 cursor-pointer w-12 h-12 sm:w-16 sm:h-16"
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
          <div className="hidden sm:inline">
            <LevelChip level={user_detail.point} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline sm:hidden">
            <LevelChip level={user_detail.point} />
          </div>
          <UserPoint point={user_detail.point} />
        </div>
      </div>
    </div>
  );
};

export default PostInfoUser;
