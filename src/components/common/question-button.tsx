import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import { Button } from "@material-tailwind/react";

const QuestionButton = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate("/post")}
      size="sm"
      className="flex items-center gap-2 text-sm md:text-lg normal-case"
    >
      <QuestionMarkCircleIcon className="w-6 h-6" />
      {t("right-sidebar.Ask Question")}
    </Button>
  );
};

export default QuestionButton;
