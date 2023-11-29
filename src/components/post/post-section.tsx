import { Typography } from "@material-tailwind/react";

interface PostSectionProps {
  title: string;
  desc: string;
  children: any;
}

const PostSection: React.FC<PostSectionProps> = ({ title, desc, children }) => {
  return (
    <div className="border border-gray-900 dark:bg-gray-800 rounded-lg p-4">
      <Typography className="font-bold">{title}</Typography>
      <Typography className="mb-2 text-sm">{desc}</Typography>
      <div className="dark:text-gray-900">{children}</div>
    </div>
  );
};

export default PostSection;
