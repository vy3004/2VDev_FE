import { useTranslation } from "react-i18next";

import { TagIcon, UsersIcon } from "@heroicons/react/24/solid";
import { Typography } from "@material-tailwind/react";
import QuestionButton from "../common/question-button";
import Statistics from "../common/statistics";
import TagsTrending from "../common/tags-trending";
import TopUsers from "../common/top-users";

const RightSidebar = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="hidden border-y lg:flex lg:justify-center py-4 dark:border-gray-900 dark:bg-gray-700">
        <QuestionButton />
      </div>

      <div className="bg-gray-50 dark:bg-gray-800">
        <Statistics />
      </div>

      <div className="border-y p-4 dark:border-gray-900 dark:text-gray-50">
        <Typography className="font-bold mb-2 flex items-center gap-2">
          <TagIcon className="w-4 h-4" />
          {t("right-sidebar.Trending Tags")}
        </Typography>
        <TagsTrending />
      </div>

      <div className="border-y p-4 dark:border-gray-900 dark:text-gray-50 dark:bg-gray-700">
        <Typography className="font-bold mb-2 flex items-center gap-2">
          <UsersIcon className="w-4 h-4" />
          {t("right-sidebar.Top Users")}
        </Typography>

        <TopUsers />
      </div>
    </div>
  );
};

export default RightSidebar;
