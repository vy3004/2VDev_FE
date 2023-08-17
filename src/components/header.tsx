import { useDispatch } from "react-redux";
import { Typography, IconButton, Button } from "@material-tailwind/react";
import {
  BellIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/solid";

import Container from "./ui/container";
import ProfileMenu from "./ui/profile-menu";
import NavList from "./ui/nav-list";
import SearchInput from "./ui/search-input";
import MobileSidebar from "./mobile-sidebar";

import {
  setAuthModalName,
  setAuthModalOpen,
} from "../redux/features/auth-modal-slice";

const Header = () => {
  const auth = false;

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
    <nav className="sticky top-0 z-10 bg-white h-max max-w-full border-b p-2 sm:p-4">
      <Container>
        <div className="flex flex-wrap items-center justify-between text-blue-gray-900">
          <div className="flex items-center">
            <MobileSidebar />

            <Typography
              as="a"
              href="#"
              className="sm:mr-4 ml-3 cursor-pointer py-1.5 pr-4 font-bold border-r-2 border-r-blue-gray-900"
            >
              2VDev
            </Typography>

            <NavList />
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex">
              <SearchInput />
            </div>

            {/* Auth start */}
            {auth ? (
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
