import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { Typography, IconButton, Button } from "@material-tailwind/react";
import {
  BellIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/solid";

import Container from "../common/container";
import ProfileMenu from "../common/profile-menu";
import NavList from "../common/nav-list";
import SearchInput from "../common/search-input";
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

  const handleOpenSignInModal = () => {
    dispatch(setAuthModalName("signIn"));
    dispatch(setAuthModalOpen(true));
  };

  const handleOpenSignUpModal = () => {
    dispatch(setAuthModalName("signUp"));
    dispatch(setAuthModalOpen(true));
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 dark:border-gray-800 h-max max-w-full border-b p-2 sm:p-4">
      <Container>
        <div className="flex flex-wrap items-center justify-between text-black dark:text-gray-50">
          <div className="flex items-center">
            <MobileSidebar />

            <Typography
              as="a"
              href="/"
              className="sm:mr-4 ml-3 cursor-pointer py-1.5 pr-4 font-bold border-r-2 border-r-black dark:border-r-gray-50"
            >
              2VDev
            </Typography>

            <NavList />
          </div>

          <div className="w-auto flex items-center space-x-2 xl:space-x-6">
            <div className="hidden lg:flex">
              <SearchInput />
            </div>

            {/* Auth start */}
            {user ? (
              <div className="flex items-center space-x-2">
                <IconButton
                  variant="text"
                  className="hidden lg:flex dark:text-gray-50"
                >
                  <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />
                </IconButton>
                <IconButton
                  variant="text"
                  className="hidden lg:flex dark:text-gray-50"
                >
                  <BellIcon className="h-5 w-5" />
                </IconButton>

                <ProfileMenu />
              </div>
            ) : (
              <div className="space-x-2 ">
                <Button
                  className="bg-white dark:bg-gray-50"
                  onClick={handleOpenSignInModal}
                  variant="outlined"
                >
                  {t("auth.sign-in")}
                </Button>
                <Button
                  onClick={handleOpenSignUpModal}
                  className="hidden xl:inline"
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
