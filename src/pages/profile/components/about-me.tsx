import { format } from "date-fns";

import { Avatar, Button, Typography } from "@material-tailwind/react";
import {
  AcademicCapIcon,
  CakeIcon,
  ChatBubbleLeftRightIcon,
  GlobeAltIcon,
  MapPinIcon,
  StarIcon,
  BookOpenIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";

import StatsButton from "./stats-button";
interface AboutMeProps {
  user: any;
}

const AboutMe: React.FC<AboutMeProps> = ({ user }) => {
  const statsItems = [
    {
      label: "Questions",
      stats: "10",
      icon: <BookOpenIcon className="w-8 h-8 text-blue-500" />,
    },
    {
      label: "Answers",
      stats: "10",
      icon: <ChatBubbleLeftRightIcon className="w-8 h-8 text-red-500" />,
    },
    {
      label: "Best Questions",
      stats: "10",
      icon: <AcademicCapIcon className="w-8 h-8 text-green-500" />,
    },
    {
      label: "Points",
      stats: "10",
      icon: <StarIcon className="w-8 h-8 text-orange-500" />,
    },
  ];

  const followItems = [
    {
      label: "Followers",
      users: "10",
    },
    {
      label: "Following",
      users: "10",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border rounded-lg space-y-6 p-10">
        <Typography className="text-center text-2xl italic font-bold">
          {user?.bio}
        </Typography>

        <div className="md:flex justify-center gap-4">
          <div className="flex items-center gap-2">
            {user?.date_of_birth && <CakeIcon className="w4 h-4" />}
            <Typography className="text-center font-bold">
              {user?.date_of_birth &&
                format(new Date(user?.date_of_birth), "dd/MM/yyyy")}
            </Typography>
          </div>

          <div className="flex items-center gap-2">
            {user?.website && <GlobeAltIcon className="w4 h-4" />}
            <Typography className="text-center font-bold">
              {user?.website}
            </Typography>
          </div>

          <div className="flex items-center gap-2">
            {user?.location && <MapPinIcon className="w4 h-4" />}
            <Typography className="text-center font-bold">
              {user?.location}
            </Typography>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 sm:gap-8">
        {statsItems.map((item, key) => (
          <div key={key} className="col-span-4 sm:col-span-2 lg:col-span-1">
            <StatsButton
              label={item.label}
              stats={item.stats}
              icon={item.icon}
            />
          </div>
        ))}
      </div>

      <hr />

      <div className="grid grid-cols-2 gap-4 sm:gap-8">
        {followItems.map((item, key) => (
          <Button
            key={key}
            variant="outlined"
            className="normal-case w-full space-y-2 col-span-2 sm:col-span-1"
          >
            <div className="flex items-center gap-1">
              <UserGroupIcon className="w-8 h-8" />

              <Typography className="text-xl font-semibold">
                {item.label}
              </Typography>
            </div>
            <div className="flex items-center -space-x-4">
              <Avatar
                variant="circular"
                alt="user 1"
                className="border-2 border-white hover:z-10 focus:z-10"
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
              />
              <Avatar
                variant="circular"
                alt="user 2"
                className="border-2 border-white hover:z-10 focus:z-10"
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1061&q=80"
              />
              <Avatar
                variant="circular"
                alt="user 3"
                className="border-2 border-white hover:z-10 focus:z-10"
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1288&q=80"
              />
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AboutMe;
