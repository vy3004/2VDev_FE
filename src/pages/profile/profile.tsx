import {
  Avatar,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography,
} from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/user-slice";

const Profile = () => {
  const { user } = useSelector(selectUser);

  const data = [
    {
      label: "About",
      value: "about",
      desc: `It really matters and then like it really doesn't matter.
      What matters is the people who are sparked by it. And the people
      who are like offended by it, it doesn't matter.`,
    },
    {
      label: "Questions",
      value: "questions",
      desc: `Because it's about motivating the doers. Because I'm here
      to follow my dreams and inspire other people to follow their dreams, too.`,
    },

    {
      label: "Answers",
      value: "answers",
      desc: `We're not always in the position that we want to be at.
      We're constantly growing. We're constantly making mistakes. We're
      constantly trying to express ourselves and actualize our dreams.`,
    },

    {
      label: "Best Answers",
      value: "best-answers",
      desc: `Because it's about motivating the doers. Because I'm here
      to follow my dreams and inspire other people to follow their dreams, too.`,
    },

    {
      label: "Svelte",
      value: "svelte",
      desc: `We're not always in the position that we want to be at.
      We're constantly growing. We're constantly making mistakes. We're
      constantly trying to express ourselves and actualize our dreams.`,
    },
  ];

  return (
    <div>
      <div className="relative">
        <img
          className="h-60 w-full border rounded-lg object-cover object-center"
          src={user?.cover_photo || "/cover-photo.svg"}
          alt="cover"
        />

        <div className="absolute -bottom-20 left-10 flex items-center gap-2">
          <Avatar
            src={
              user?.avatar ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYmkp9a2rrD1Sskb9HLt5mDaTt4QaIs8CcBg&usqp=CAU"
            }
            size="xxl"
            alt="avatar"
            withBorder={true}
            className="p-0.5 hover:bg-blue-500 hover:border-blue-300 cursor-pointer"
          />
          <div>
            <Typography className="font-bold text-2xl mt-8">
              {user?.name}
            </Typography>
            <Typography className="text-sm">{user?.email}</Typography>
          </div>
        </div>
      </div>

      <Tabs className="mt-32" value="html">
        <TabsHeader>
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
            <TabPanel key={value} value={value}>
              {desc}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </div>
  );
};

export default Profile;
