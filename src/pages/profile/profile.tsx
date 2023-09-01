import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import {
  Avatar,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography,
  Button,
} from "@material-tailwind/react";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import AboutMe from "./components/about-me";

import userService from "../../services/user-service";
import { selectUser, setUser } from "../../redux/features/user-slice";
import { setEditMyProfileModalOpen } from "../../redux/features/edit-my-profile-modal-slice";

const Profile = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser).user;

  const [userProfile, setUserProfile] = useState(currentUser);

  useEffect(() => {
    const getUser = async () => {
      if (username) {
        const { response } = await userService.getUser({
          username,
        });

        if (response) {
          setUserProfile(response.data.result);
          dispatch(setUser(response.data.result));
        }
      }
    };

    getUser();
  }, [username, dispatch]);

  const data = [
    {
      label: "About",
      value: "about",
      content: <AboutMe user={userProfile} />,
    },
    {
      label: "Questions",
      value: "questions",
      content: `Because it's about motivating the doers. Because I'm here
      to follow my dreams and inspire other people to follow their dreams, too.`,
    },

    {
      label: "Answers",
      value: "answers",
      content: `We're not always in the position that we want to be at.
      We're constantly growing. We're constantly making mistakes. We're
      constantly trying to express ourselves and actualize our dreams.`,
    },

    {
      label: "Best Answers",
      value: "best-answers",
      content: `Because it's about motivating the doers. Because I'm here
      to follow my dreams and inspire other people to follow their dreams, too.`,
    },

    {
      label: (
        <Menu
          allowHover
          animate={{
            mount: { y: 0 },
            unmount: { y: 25 },
          }}
        >
          <MenuHandler>
            <div>More</div>
          </MenuHandler>

          <MenuList>
            <MenuItem>Menu Item 1</MenuItem>
            <MenuItem>Menu Item 2</MenuItem>
            <MenuItem>Menu Item 3</MenuItem>
          </MenuList>
        </Menu>
      ),
      value: "more",
      content: `We're not always in the position that we want to be at.
      We're constantly growing. We're constantly making mistakes. We're
      constantly trying to express ourselves and actualize our dreams.`,
    },
  ];

  return (
    <div>
      <div className="relative">
        <img
          className="h-60 w-full border rounded-lg object-cover object-center"
          src={userProfile?.cover_photo || "/cover-photo.svg"}
          alt="cover"
        />

        <div className="absolute -bottom-14 sm:-bottom-24 left-10 flex items-center gap-2">
          <Avatar
            src={
              userProfile?.avatar ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYmkp9a2rrD1Sskb9HLt5mDaTt4QaIs8CcBg&usqp=CAU"
            }
            alt="avatar"
            withBorder={true}
            className="w-20 h-20 sm:w-32 sm:h-32 p-0.5 hover:bg-blue-500 hover:border-blue-300 cursor-pointer"
          />
          <div>
            <Typography className="font-bold text-xl sm:text-2xl mt-8">
              {userProfile?.name}
            </Typography>
            <Typography className="text-xs sm:text-sm">
              {userProfile?.email}
            </Typography>
          </div>
        </div>

        {/* Edit button my profile start */}
        {userProfile?.username === currentUser?.username && (
          <Button
            onClick={() => dispatch(setEditMyProfileModalOpen(true))}
            variant="outlined"
            className="!absolute right-0 -bottom-28 lg:-bottom-24 flex items-center gap-2"
          >
            <PencilSquareIcon className="w-4 h-4" />
            Edit Profile
          </Button>
        )}

        {/* Edit button my profile end */}
      </div>

      <Tabs className="mt-32" value="about">
        <TabsHeader className="z-0">
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
          {data.map(({ value, content }) => (
            <TabPanel key={value} value={value}>
              {content}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </div>
  );
};

export default Profile;
