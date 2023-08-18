import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

import Footer from "../footer";
import Header from "../header";
import Sidebar from "../sidebar";

import Container from "../ui/container";

import AuthModal from "../modals/auth-modal";
import authService from "../../services/user-service";
import { selectUser, setUser } from "../../redux/features/user-slice";
import { Typography } from "@material-tailwind/react";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import jwtDecode from "jwt-decode";

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
          } else {
            const { response } = await authService.getInfo();
            if (response) dispatch(setUser(response.data.result));
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
  }, [dispatch, accessToken]);

  return (
    <>
      <Toaster />

      <AuthModal />

      <Header />

      {/* Page Content */}
      <Container>
        <div className="grid grid-cols-10">
          <div className="hidden h-full col-span-2 xl:flex xl:flex-col">
            <Sidebar />
          </div>
          <div className="col-span-10 md:col-span-7 xl:col-span-6 h-screen p-6 border">
            {user && !user?.verify ? (
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
            )}
          </div>
          <div className="md:col-span-3 xl:col-span-2 bg-blue-500"></div>
        </div>
      </Container>
      {/* Page Content */}

      <Footer />
    </>
  );
};

export default MainLayout;
