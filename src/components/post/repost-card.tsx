import PostCard from "./post-card";

import { Post } from "../../utils/types";

interface RepostCardProps {
  repost: Post;
}

const RepostCard: React.FC<RepostCardProps> = ({ repost }) => {
  return <PostCard post={repost} is_detail={false} />;
};

export default RepostCard;
