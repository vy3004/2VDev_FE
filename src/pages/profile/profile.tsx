import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import {
  Avatar,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography,
  Button,
} from "@material-tailwind/react";
import {
  PencilSquareIcon,
  UserMinusIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import AboutMe from "./components/about-me";
import PostsTab from "./components/posts-tab";
import Loading from "../../components/common/loading";
import NotFoundAlert from "../../components/common/not-found-alert";

import userService from "../../services/user-service";

import { selectUser } from "../../redux/features/user-slice";
import { setEditMyProfileModalOpen } from "../../redux/features/edit-my-profile-modal-slice";

import { POST_TYPE, USER_UPDATE_POINT } from "../../utils/constant";
import { User } from "../../utils/types";

const Profile = () => {
  const { username } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser).user;
  const queryParams = new URLSearchParams(window.location.search);
  const tabParam = queryParams.get("tab");

  const [userProfile, setUserProfile] = useState<User>();
  const [activeTab, setActiveTab] = useState<string>(tabParam || "about");
  const [isLoading, setIsLoading] = useState(false);
  const [follow, setFollow] = useState<boolean>(false);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    queryParams.set("tab", value);
    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${queryParams.toString()}`
    );
  };

  const handleFollow = async (userId: string) => {
    if (follow && userId !== currentUser?._id) {
      const { response } = await userService.unFollow({ user_id: userId });
      if (response) {
        toast.success(t("user.You have unfollow successfully"));
        setFollow(false);
        await userService.updatePoints({
          user_id: userId,
          point: USER_UPDATE_POINT.unFollow,
        });
      }
    } else {
      const { response } = await userService.follow({
        followed_user_id: userId,
      });
      if (response) {
        toast.success(t("user.You have follow successfully"));
        setFollow(true);
        await userService.updatePoints({
          user_id: userId,
          point: USER_UPDATE_POINT.follow,
        });
      }
    }
  };

  const getUserProfile = async () => {
    setIsLoading(true);
    if (username) {
      const { response } = await userService.getUser({
        username,
      });

      if (response) {
        setUserProfile(response.data.result);
        setFollow(response.data.result.is_followed);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    getUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, dispatch]);

  const tabs = [
    {
      label: "About",
      value: "about",
      content: userProfile && <AboutMe user={userProfile} />,
    },
    {
      label: "My Questions",
      value: "my-questions",
      content:
        userProfile?._id && activeTab === "my-questions" ? (
          <PostsTab user_id={userProfile._id} postType={POST_TYPE.Post} />
        ) : (
          <></>
        ),
    },
    {
      label: "My Answers",
      value: "my-answers",
      content:
        userProfile?._id && activeTab === "my-answers" ? (
          <PostsTab user_id={userProfile._id} postType={POST_TYPE.Comment} />
        ) : (
          <></>
        ),
    },
    {
      label: "My Reposts",
      value: "my-reposts",
      content:
        userProfile?._id && activeTab === "my-reposts" ? (
          <PostsTab user_id={userProfile._id} postType={POST_TYPE.RePost} />
        ) : (
          <></>
        ),
    },
  ];

  return isLoading ? (
    <div className="relative h-80">
      <Loading />
    </div>
  ) : userProfile ? (
    <div className="dark:text-gray-300">
      <div className="relative">
        <img
          className="h-60 w-full border rounded-lg object-cover object-center dark:border-gray-900"
          src={userProfile.cover_photo || "/images/cover-photo.svg"}
          alt="cover"
        />

        <div className="absolute -bottom-14 sm:-bottom-24 left-10 flex items-center gap-2">
          <Avatar
            src={
              userProfile.avatar ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYmkp9a2rrD1Sskb9HLt5mDaTt4QaIs8CcBg&usqp=CAU"
            }
            alt="avatar"
            withBorder={true}
            className="w-20 h-20 sm:w-32 sm:h-32 p-0.5 bg-white hover:bg-blue-500 hover:border-blue-300 cursor-pointer"
          />
          <div>
            <Typography className="font-bold text-xl sm:text-2xl mt-8">
              {userProfile.name}
            </Typography>
            <Typography className="text-xs sm:text-sm">
              {userProfile.email}
            </Typography>
          </div>
        </div>

        {/* Edit button my profile start */}
        {userProfile.username === currentUser?.username ? (
          <Button
            onClick={() => dispatch(setEditMyProfileModalOpen(true))}
            variant="outlined"
            className="!absolute right-0 -bottom-28 lg:-bottom-24 normal-case text-sm flex items-center gap-2 dark:text-gray-300 dark:border-gray-300 dark:bg-gray-800"
          >
            <PencilSquareIcon className="w-4 h-4" />
            {t("user.Edit Profile")}
          </Button>
        ) : (
          <Button
            onClick={() => handleFollow(userProfile._id)}
            variant="outlined"
            className="!absolute right-0 -bottom-28 lg:-bottom-24 normal-case text-sm flex items-center gap-2 dark:text-gray-300 dark:border-gray-300 dark:bg-gray-800"
          >
            {follow ? (
              <>
                <UserMinusIcon className="w-4 h-4" /> {t("user.Unfollow")}
              </>
            ) : (
              <>
                <UserPlusIcon className="w-4 h-4" /> {t("user.Follow")}
              </>
            )}
          </Button>
        )}

        {/* Edit button my profile end */}
      </div>

      <Tabs className="mt-32" value={activeTab}>
        <TabsHeader className="z-0">
          {tabs.map(({ label, value }) => (
            <Tab
              key={value}
              value={value}
              onClick={() => handleTabChange(value)}
            >
              {t(`user.${label}`)}
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
          {tabs.map(({ value, content }) => (
            <TabPanel className="px-0" key={value} value={value}>
              {content}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </div>
  ) : (
    <NotFoundAlert
      message={t("user.User not found")}
      type="error"
      isBack={true}
    />
  );
};

export default Profile;
