import {
  ChatBubbleLeftIcon,
  QuestionMarkCircleIcon,
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
        <div key={key} className="border rounded-lg p-2 bg-white shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar
                size="sm"
                variant="circular"
                src={item.user.avatar}
                alt="avatar"
              />
              <Typography className="font-bold text-sm">
                {item.user.name}
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
      <div className="border-y flex justify-center py-4">
        <Button className="flex items-center gap-2 text-lg normal-case">
          <QuestionMarkCircleIcon className="w-6 h-6" />
          Ask Question
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2 p-4 bg-gray-100">
        <div className="relative block border rounded-bl-3xl rounded-tr-3xl overflow-hidden p-2 bg-white shadow-md">
          <span className="absolute inset-x-0 top-0 h-2 bg-gradient-to-l from-black to-blue-300" />
          <div className="h-full flex flex-col items-center justify-center">
            <Typography className="text-sm text-blue-500">Questions</Typography>
            <Typography className="font-bold text-2xl">73</Typography>
          </div>
        </div>
        <div className="relative block border rounded-br-3xl rounded-tl-3xl overflow-hidden p-2 bg-white shadow-md">
          <span className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-black to-red-300" />
          <div className="h-full flex flex-col items-center justify-center">
            <Typography className="text-sm text-red-500">Answers</Typography>
            <Typography className="font-bold text-2xl">22</Typography>
          </div>
        </div>
        <div className="relative block border rounded-br-3xl rounded-tl-3xl overflow-hidden p-2 bg-white shadow-md">
          <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-l from-black to-green-300" />
          <div className="h-full flex flex-col items-center justify-center">
            <Typography className="text-sm text-green-500">
              Best Answers
            </Typography>
            <Typography className="font-bold text-2xl">15</Typography>
          </div>
        </div>
        <div className="relative block border rounded-bl-3xl rounded-tr-3xl overflow-hidden p-2 bg-white shadow-md">
          <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-black to-orange-300" />
          <div className="h-full flex flex-col items-center justify-center">
            <Typography className="text-sm text-orange-500">Users</Typography>
            <Typography className="font-bold text-2xl">40</Typography>
          </div>
        </div>
      </div>

      <div className="border-y p-4">
        <Typography className="font-bold mb-2 flex items-center gap-2">
          <TagIcon className="w-4 h-4" />
          Trending Tags
        </Typography>
        <div className="">
          {tags.map((tag, key) => (
            <Button
              key={key}
              className="normal-case px-2 py-1 mr-1 mb-1"
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
            animate={{
              initial: { y: 250 },
              mount: { y: 0 },
              unmount: { y: 250 },
            }}
          >
            {data.map(({ value, desc }) => (
              <TabPanel
                className="bg-gray-100 space-y-2"
                key={value}
                value={value}
              >
                {desc}
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
      </div>

      <div className="border-y p-4">
        <Typography className="font-bold mb-2 flex items-center gap-2">
          <UsersIcon className="w-4 h-4" />
          Top Members
        </Typography>

        <div>
          <div className="border rounded-lg p-2 bg-white shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar
                  size="sm"
                  variant="circular"
                  src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
                  alt="avatar"
                />
                <Typography className="font-bold text-sm">test</Typography>
              </div>

              <Button variant="text" className="flex items-center gap-1 p-1">
                test
                <ChatBubbleLeftIcon className="w-4 h-4" />
              </Button>
            </div>
            <Typography className="font-bold">test</Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
