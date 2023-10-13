import { useTranslation } from "react-i18next";

import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import { Button } from "@material-tailwind/react";

const QuestionButton = () => {
  const { t } = useTranslation();

  return (
    <Button
      onClick={() => (window.location.href = "/post")}
      size="sm"
      className="flex items-center gap-2 text-sm md:text-lg normal-case"
    >
      <QuestionMarkCircleIcon className="w-6 h-6" />
      {t("right-sidebar.Ask Question")}
    </Button>
  );
};

export default QuestionButton;
