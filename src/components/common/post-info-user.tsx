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

        <UserPoint point={user_detail.point} />
      </div>
    </div>
  );
};

export default PostInfoUser;
