import { Button } from "@material-tailwind/react";

interface TagButtonProps {
  id: string;
  name: string;
}

const TagButton: React.FC<TagButtonProps> = ({ id, name }) => {
  return (
    <Button
      key={id}
      className="normal-case px-2 py-1 mr-1 mb-1 dark:bg-gray-50"
      variant="outlined"
    >
      {name}
    </Button>
  );
};

export default TagButton;
