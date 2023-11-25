import { Typography } from "@material-tailwind/react";

interface PostSectionProps {
  title: string;
  desc: string;
  children: any;
}

const PostSection: React.FC<PostSectionProps> = ({ title, desc, children }) => {
  return (
    <div className="border border-black rounded-lg p-4">
      <Typography className="font-bold">{title}</Typography>
      <Typography className="mb-2 text-sm">{desc}</Typography>
      {children}
    </div>
  );
};

export default PostSection;
