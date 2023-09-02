import { useNavigate } from "react-router-dom";

import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import { Button } from "@material-tailwind/react";

const QuestionButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate("ask-answer")}
      size="sm"
      className="flex items-center gap-2 text-lg normal-case"
    >
      <QuestionMarkCircleIcon className="w-6 h-6" />
      Ask Question
    </Button>
  );
};

export default QuestionButton;
