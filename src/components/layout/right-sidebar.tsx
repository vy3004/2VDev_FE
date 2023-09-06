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

import { getLastTwoWords } from "../../utils/string-utils";

const RightSidebar = () => {
  const tags = [
    "java",
    "css",
    "html",
    "javascript",
    "typescript",
    "react",
    "nodejs",
    "java",
    "css",
    "html",
    "javascript",
    "typescript",
    "react",
    "nodejs",
    "typescript",
    "react",
    "nodejs",
  ];

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
      label: "Popular",
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
      label: "Answers",
      value: "answers",
      desc: `Because it's about motivating the doers. Because I'm here
      to follow my dreams and inspire other people to follow their dreams, too.`,
    },
  ];

  return (
    <div className="">
      <div className="hidden border-y lg:flex lg:justify-center py-4 dark:border-gray-900 dark:bg-gray-700">
        <QuestionButton />
      </div>
      <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 dark:bg-gray-800">
        <div className="relative block rounded-bl-3xl rounded-tr-3xl overflow-hidden p-2 bg-white shadow-md dark:bg-gray-900">
          <span className="absolute inset-x-0 top-0 h-2 bg-gradient-to-l from-black to-blue-300" />
          <div className="h-full flex flex-col items-center justify-center">
            <Typography className="text-sm text-blue-500">Questions</Typography>
            <Typography className="font-bold text-2xl dark:text-gray-50">
              73
            </Typography>
          </div>
        </div>
        <div className="relative block rounded-br-3xl rounded-tl-3xl overflow-hidden p-2 bg-white shadow-md dark:bg-gray-900">
          <span className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-black to-red-300" />
          <div className="h-full flex flex-col items-center justify-center">
            <Typography className="text-sm text-red-500">Answers</Typography>
            <Typography className="font-bold text-2xl dark:text-gray-50">
              22
            </Typography>
          </div>
        </div>
        <div className="relative block rounded-br-3xl rounded-tl-3xl overflow-hidden p-2 bg-white shadow-md dark:bg-gray-900">
          <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-l from-black to-green-300" />
          <div className="h-full flex flex-col items-center justify-center">
            <Typography className="text-sm text-green-500">
              Best Answers
            </Typography>
            <Typography className="font-bold text-2xl dark:text-gray-50">
              15
            </Typography>
          </div>
        </div>
        <div className="relative block rounded-bl-3xl rounded-tr-3xl overflow-hidden p-2 bg-white shadow-md dark:bg-gray-900">
          <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-black to-orange-300" />
          <div className="h-full flex flex-col items-center justify-center">
            <Typography className="text-sm text-orange-500">Users</Typography>
            <Typography className="font-bold text-2xl dark:text-gray-50">
              40
            </Typography>
          </div>
        </div>
      </div>

      <div className="border-y p-4 dark:border-gray-900 dark:text-gray-50">
        <Typography className="font-bold mb-2 flex items-center gap-2">
          <TagIcon className="w-4 h-4" />
          Trending Tags
        </Typography>
        <div className="">
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
      </div>

      <div className="">
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
          Top Members
        </Typography>

        <div>
          <div className="rounded-lg p-2 bg-white shadow-md dark:bg-gray-900">
            <div className="flex gap-2">
              <Avatar
                className="p-0.5 border border-black dark:border-gray-50"
                size="md"
                variant="circular"
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
                alt="avatar"
              />
              <div>
                <Typography className="font-bold">
                  {getLastTwoWords("Tran Nguyen Kha Vy")}
                </Typography>
                <Typography className="border border-black rounded-full w-fit px-2 text-xs font-bold">
                  Beginner
                </Typography>

                <div className="mt-2 flex gap-1">
                  <Typography as="a" href="#" className="text-xs">
                    5 Questions
                  </Typography>
                  <Typography as="a" href="#" className="text-xs">
                    800 Points
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
