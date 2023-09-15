import { Button } from "@material-tailwind/react";

interface TagListProps {
  tags: string[];
}

const TagList: React.FC<TagListProps> = ({ tags }) => {
  return (
    <div>
      {tags.map((tag, key) => (
        <Button
          key={key}
          className="normal-case px-2 py-1 mr-1 mb-1 dark:bg-gray-50"
          variant="outlined"
        >
          {tag}
        </Button>
      ))}
    </div>
  );
};

export default TagList;
