import React from "react";
import { useTranslation } from "react-i18next";

import { EyeIcon } from "@heroicons/react/24/solid";
import { Typography } from "@material-tailwind/react";

interface ViewProps {
  view: number;
}

const View: React.FC<ViewProps> = ({ view }) => {
  const { t } = useTranslation();

  return (
    <Typography className="text-sm text-gray-600 hover:text-blue-500 dark:text-gray-400 select-none flex items-center gap-1">
      <EyeIcon className="w-4 h-4" />
      {view} {t("post.views")}
    </Typography>
  );
};

export default View;
