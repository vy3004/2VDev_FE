import { format } from "date-fns";

import { Button, Typography } from "@material-tailwind/react";
import {
  CakeIcon,
  ChatBubbleLeftRightIcon,
  GlobeAltIcon,
  MapPinIcon,
  StarIcon,
  BookOpenIcon,
  UserGroupIcon,
  TrophyIcon,
} from "@heroicons/react/24/solid";
import StatsButton from "./stats-button";

import { getLevelByPoint } from "../../../utils/string-utils";
interface AboutMeProps {
  user: any;
}

const AboutMe: React.FC<AboutMeProps> = ({ user }) => {
  const statsItems = [
    {
      label: "Questions",
      stats: user.questions,
      icon: <BookOpenIcon className="w-8 h-8 text-blue-500" />,
    },
    {
      label: "Answers",
      stats: user.answers,
      icon: <ChatBubbleLeftRightIcon className="w-8 h-8 text-red-500" />,
    },
    {
      label: "Level",
      stats: getLevelByPoint(user.point),
      icon: <TrophyIcon className="w-8 h-8 text-green-500" />,
    },
    {
      label: "Points",
      stats: user.point,
      icon: <StarIcon className="w-8 h-8 text-orange-500" />,
    },
  ];

  const followItems = [
    {
      label: "Followers",
      users: user.followers,
    },
    {
      label: "Following",
      users: user.following,
    },
  ];

  return (
    <div className="space-y-6 dark:text-gray-50">
      <div className="border rounded-lg space-y-6 p-10">
        <div className="flex justify-center">
          {user?.bio && (
            <Typography className="border-l-8 px-4 py-2 w-fit text-center sm:text-2xl italic font-bold">
              "{user?.bio}"
            </Typography>
          )}
        </div>

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
            className="normal-case w-full space-y-2 col-span-2 sm:col-span-1 dark:text-gray-50 dark:border-gray-50"
          >
            <div className="flex items-center justify-center gap-2">
              <UserGroupIcon className="w-8 h-8" />

              <Typography className="text-xl font-semibold">
                {item.users} User{item.users > 1 && "s"} {item.label}
              </Typography>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AboutMe;
