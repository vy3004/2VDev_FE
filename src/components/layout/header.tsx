import { useDispatch, useSelector } from "react-redux";
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
    <nav className="sticky top-0 z-50 bg-white h-max max-w-full border-b p-2 sm:p-4">
      <Container>
        <div className="flex flex-wrap items-center justify-between text-blue-gray-900">
          <div className="flex items-center">
            <MobileSidebar />

            <Typography
              as="a"
              href="/"
              className="sm:mr-4 ml-3 cursor-pointer py-1.5 pr-4 font-bold border-r-2 border-r-blue-gray-900"
            >
              2VDev
            </Typography>

            <NavList />
          </div>

          <div className="flex items-center space-x-2 xl:space-x-6">
            <div className="hidden lg:flex">
              <SearchInput />
            </div>

            {/* Auth start */}
            {user ? (
              <div className="flex items-center space-x-2">
                <IconButton variant="text" className="hidden xl:flex">
                  <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />
                </IconButton>
                <IconButton variant="text" className="hidden xl:flex">
                  <BellIcon className="h-5 w-5" />
                </IconButton>

                <ProfileMenu />
              </div>
            ) : (
              <div className="space-x-2 ">
                <Button onClick={handleOpenSignInModal} variant="outlined">
                  Sign In
                </Button>
                <Button
                  onClick={handleOpenSignUpModal}
                  className="hidden xl:inline"
                >
                  Sign Up
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
