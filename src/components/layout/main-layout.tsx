import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import jwtDecode from "jwt-decode";

import Footer from "../footer";
import Header from "../header";
import Sidebar from "../sidebar";
import RightSidebar from "../right-sidebar";

import Container from "../ui/container";
import AuthModal from "../modals/auth-modal";

import { Typography } from "@material-tailwind/react";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";

import authService from "../../services/user-service";
import { selectUser, setUser } from "../../redux/features/user-slice";

const MainLayout = () => {
  const { user } = useSelector(selectUser);

  const dispatch = useDispatch();

  const accessToken = localStorage.getItem("access_token") || "";

  useEffect(() => {
    const authUser = async () => {
      if (accessToken) {
        try {
          const decodedToken: any = jwtDecode(accessToken);
          const currentTime = Math.floor(Date.now() / 1000);
          const tokenTimeout = 15; // 15 minutes in seconds

          if (decodedToken.exp - currentTime < tokenTimeout) {
            const { response } = await authService.refreshToken();

            localStorage.setItem(
              "access_token",
              response?.data.result.access_token
            );
          }
        } catch (error) {
          // Error occurred while decoding or refreshing token
          console.error("Token check failed:", error);
        }
      } else {
        // Handle case when token is missing or invalid
        console.log("Token is missing or invalid");
      }
    };
    const tokenCheckInterval = setInterval(() => {
      authUser();
    }, 89000); // Check token every 14 minutes and 50 seconds

    return () => {
      clearInterval(tokenCheckInterval); // Clear the interval when the component unmounts
    };
  }, [accessToken]);

  useEffect(() => {
    const authUser = async () => {
      const { response } = await authService.getInfo();
      if (response) dispatch(setUser(response.data.result));
    };

    if (accessToken) authUser();
  }, [dispatch, accessToken]);

  return (
    <>
      <AuthModal />

      <Header />

      {/* Page Content */}
      <Container>
        <div className="grid grid-cols-10">
          {/* Left sidebar */}
          <div className="h-screen sticky top-[73px] hidden xl:flex xl:col-span-2">
            <Sidebar />
          </div>
          {/* Left sidebar */}

          {/* Main content */}
          <div className="col-span-10 md:col-span-7 xl:col-span-6 p-6 border-x h-[3000px]">
            {/* {user && !user?.verify ? (
              <div className="flex border rounded-lg p-4 space-x-4">
                <CheckBadgeIcon className="h-10 w-10" />
                <Typography className="font-bold">
                  A confirmation mail has been sent to your registered email
                  account, If you have not received the confirmation mail,
                  kindly
                  <span className="text-blue-500 cursor-pointer">
                    {" "}
                    Click here
                  </span>{" "}
                  to re-send another confirmation mail.
                </Typography>
              </div>
            ) : (
              <></>
            )} */}

            <Outlet />
          </div>
          {/* Main content */}

          {/* Right sidebar */}
          <div className="h-screen sticky top-[73px] hidden md:flex md:col-span-3 xl:col-span-2">
            <div className="overflow-hidden hover:overflow-y-scroll w-full">
              <RightSidebar />
            </div>
          </div>
          {/* Right sidebar */}
        </div>
      </Container>
      {/* Page Content */}

      <Footer />
    </>
  );
};

export default MainLayout;
