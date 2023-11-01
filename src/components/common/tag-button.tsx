import { useNavigate } from "react-router-dom";

import { Button } from "@material-tailwind/react";

interface TagButtonProps {
  id: string;
  name: string;
}

const TagButton: React.FC<TagButtonProps> = ({ id, name }) => {
  const navigate = useNavigate();

  return (
    <Button
      key={id}
      className="normal-case px-2 py-1 mr-1 mb-1 dark:bg-gray-50"
      variant="outlined"
      onClick={() => navigate(`/tags/${id}`)}
    >
      {name}
    </Button>
  );
};

export default TagButton;
