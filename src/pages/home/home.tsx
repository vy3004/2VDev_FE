import { ChatBubbleLeftIcon, EyeIcon } from "@heroicons/react/24/solid";
import { Avatar, Button, Typography } from "@material-tailwind/react";

import LevelChip from "../../components/common/level-chip";
import TagList from "../../components/common/tag-list";

const Home = () => {
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

  return (
    <div className="h-screen w-full dark:bg-gray-700">
      <div className="border rounded-lg flex gap-2 p-4">
        <div className="space-y-8 flex flex-col items-center">
          <Avatar
            src="/logo.png"
            size="lg"
            alt="avatar"
            withBorder={true}
            className="p-0.5"
          />

          <div className="w-16 flex flex-col justify-center items-center gap-1">
            <Typography className="cursor-pointer text-2xl hover:text-blue-500">
              ▲
            </Typography>
            <Typography className="font-bold">100</Typography>
            <Typography className="cursor-pointer text-2xl hover:text-blue-500">
              ▼
            </Typography>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <Typography
              as="a"
              href="#"
              className="font-bold text-blue-500 hover:text-gray-900"
            >
              Kha Vy
            </Typography>
            <LevelChip level={4} />
            <Typography className="text-sm text-gray-600">
              Asked:{" "}
              <span className="text-blue-500 hover:text-gray-900">
                30/04/2001
              </span>
            </Typography>
            <Typography className="text-sm text-gray-600">
              In:{" "}
              <span className="text-blue-500 hover:text-gray-900">
                Language
              </span>
            </Typography>
          </div>
          <div className="space-y-4">
            <Typography
              as="a"
              href="#"
              className="font-bold text-lg text-gary-900 hover:text-blue-500"
            >
              Material Tailwind is an easy to use components library for
              Tailwind CSS and Material Design?
            </Typography>

            <Typography>
              Material Tailwind is an easy to use components library for
              Tailwind CSS and Material Design. It provides a simple way to
              customize your components, you can change the colors, fonts,
              breakpoints and everything you need.
            </Typography>

            <TagList tags={tags} />

            <div className="flex items-center justify-between p-4 bg-gray-300">
              <div className="flex gap-4">
                <Button
                  variant="outlined"
                  size="sm"
                  className="bg-white flex items-center gap-2 normal-case text-base"
                >
                  <ChatBubbleLeftIcon className="w-4 h-4" /> 8 Answers
                </Button>

                <Button
                  variant="outlined"
                  size="sm"
                  className="bg-white flex items-center gap-2 normal-case text-base"
                >
                  <EyeIcon className="w-4 h-4" /> 18 Views
                </Button>
              </div>
              <Button>Answer</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
