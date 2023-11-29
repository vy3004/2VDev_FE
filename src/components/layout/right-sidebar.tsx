import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { TagIcon, UsersIcon } from "@heroicons/react/24/solid";
import { Typography } from "@material-tailwind/react";
import QuestionButton from "../common/question-button";
import Statistics from "../common/statistics";
import TagsTrending from "../common/tags-trending";
import TopUsers from "../common/top-users";

import { selectUser } from "../../redux/features/user-slice";

const RightSidebar = () => {
  const { t } = useTranslation();
  const { user } = useSelector(selectUser);

  return (
    <div>
      <div className="hidden lg:flex lg:justify-center py-4 dark:bg-gray-900">
        <QuestionButton />
      </div>

      <div className="border-t bg-gray-50 dark:bg-gray-800 dark:border-gray-800">
        <Statistics />
      </div>

      <div className="border-t p-4 dark:border-gray-900 dark:text-gray-300">
        <Typography className="font-bold mb-2 flex items-center gap-2">
          <TagIcon className="w-4 h-4" />
          {t("right-sidebar.Trending Tags")}
        </Typography>
        <TagsTrending />
      </div>

      {user && (
        <div className="border-t p-4 dark:border-gray-900 dark:text-gray-300 dark:bg-gray-800">
          <Typography className="font-bold mb-2 flex items-center gap-2">
            <UsersIcon className="w-4 h-4" />
            {t("right-sidebar.Top Users")}
          </Typography>

          <TopUsers />
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
