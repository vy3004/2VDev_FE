import { useTranslation } from "react-i18next";

import {
  ChatBubbleLeftIcon,
  TagIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  Typography,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Avatar,
} from "@material-tailwind/react";
import QuestionButton from "../common/question-button";
import Statistics from "../common/statistics";
import TagsTrending from "../common/tags-trending";
import TopUsers from "../common/top-users";

import { getLastTwoWords } from "../../utils/string-utils";

const RightSidebar = () => {
  const { t } = useTranslation();

  const popular = [
    {
      title:
        "How do native speakers tell I’m foreign based on my English alone?",
      user: {
        name: "kha vy",
        avatar:
          "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
      },
      answers: "10",
    },
    {
      title:
        "How do native speakers tell I’m foreign based on my English alone?",
      user: {
        name: "test",
        avatar:
          "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
      },
      answers: "10",
    },
    {
      title:
        "How do native speakers tell I’m foreign based on my English alone?",
      user: {
        name: "test 2",
        avatar:
          "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
      },
      answers: "10",
    },
  ];

  const data = [
    {
      label: t("right-sidebar.Popular"),
      value: "popular",
      desc: popular.map((item, key) => (
        <div
          key={key}
          className="rounded-lg p-2 bg-white shadow-md dark:bg-gray-700 dark:text-gray-50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar
                className="p-0.5 border border-black dark:border-gray-50"
                size="sm"
                variant="circular"
                src={item.user.avatar}
                alt="avatar"
              />
              <Typography className="font-bold text-sm text-black">
                {getLastTwoWords(item.user.name)}
              </Typography>
            </div>

            <Button variant="text" className="flex items-center gap-1 p-1">
              {item.answers}
              <ChatBubbleLeftIcon className="w-4 h-4" />
            </Button>
          </div>
          <Typography className="font-bold">{item.title}</Typography>
        </div>
      )),
    },
    {
      label: t("right-sidebar.Answers"),
      value: "answers",
      desc: `Because it's about motivating the doers. Because I'm here
      to follow my dreams and inspire other people to follow their dreams, too.`,
    },
  ];

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

      <div>
        <Tabs value="popular" className="">
          <TabsHeader className="bg-gray-100 p-4 rounded-none">
            {data.map(({ label, value }) => (
              <Tab key={value} value={value}>
                {label}
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody
            className="bg-gray-100 dark:bg-gray-500"
            animate={{
              initial: { y: 250 },
              mount: { y: 0 },
              unmount: { y: 250 },
            }}
          >
            {data.map(({ value, desc }) => (
              <TabPanel className="space-y-2" key={value} value={value}>
                {desc}
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
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
