import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Typography, Button } from "@material-tailwind/react";

import Container from "../common/container";
import NavList from "../common/nav-list";
import SearchInput from "../common/search-input";
// import MessageMenu from "../common/message-menu";
import NotificationMenu from "../common/notification-menu";
import ProfileMenu from "../common/profile-menu";
import MobileSidebar from "./mobile-sidebar";

import {
  setAuthModalName,
  setAuthModalOpen,
} from "../../redux/features/auth-modal-slice";
import { selectUser } from "../../redux/features/user-slice";

const Header = () => {
  const { user } = useSelector(selectUser);
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpenAuthModal = (modalName: string) => {
    dispatch(setAuthModalName(modalName));
    dispatch(setAuthModalOpen(true));
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 dark:border-gray-800 h-max max-w-full border-b p-2 sm:p-4">
      <Container>
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center">
            <MobileSidebar />

            <Typography
              onClick={() => navigate("/?type=all&sort_field=created_at")}
              className="sm:mr-4 ml-3 cursor-pointer py-1.5 pr-4 font-semibold dark:text-gray-50 border-r-2 border-r-black dark:border-r-gray-50"
            >
              2VDev
            </Typography>

            <NavList />
          </div>

          <div className="w-auto flex items-center space-x-4 xl:space-x-6">
            <div className="hidden lg:flex">
              <SearchInput />
            </div>

            {/* Auth start */}
            {user ? (
              <div className="flex items-center space-x-4">
                {/* <MessageMenu /> */}
                <NotificationMenu />
                <ProfileMenu />
              </div>
            ) : (
              <div className="space-x-2 ">
                <Button
                  className="bg-white dark:border-gray-800 dark:bg-gray-800 dark:text-gray-50"
                  onClick={() => handleOpenAuthModal("signIn")}
                  variant="outlined"
                >
                  {t("auth.sign-in")}
                </Button>
                <Button
                  onClick={() => handleOpenAuthModal("signUp")}
                  className="hidden xl:inline dark:text-gray-400 border border-gray-900 dark:border-gray-400"
                >
                  {t("auth.sign-up")}
                </Button>
              </div>
            )}
          </div>
          {/* Auth end */}
        </div>
      </Container>
    </nav>
  );
};

export default Header;
