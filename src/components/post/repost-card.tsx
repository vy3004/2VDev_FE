import { Post } from "../../utils/types";

interface RepostCardProps {
  repost: Post;
}

const RepostCard: React.FC<RepostCardProps> = ({ repost }) => {
  return <div>RepostCard</div>;
};

export default RepostCard;
