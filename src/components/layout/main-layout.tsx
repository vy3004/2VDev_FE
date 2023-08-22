import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

import Footer from "./footer";
import Header from "./header";
import Sidebar from "./sidebar";
import RightSidebar from "./right-sidebar";

import Container from "../common/container";
import GlobalLoading from "../common/global-loading";
import AuthModal from "../modals/auth-modal";

import authService from "../../services/user-service";
import { selectUser, setUser } from "../../redux/features/user-slice";
import { setIsLoading } from "../../redux/features/global-loading";
import VerifyMailAlert from "../common/verify-mail-alert";
import queryString from "query-string";
import { selectApp } from "../../redux/features/app-state-slice";

const MainLayout = () => {
  const { user } = useSelector(selectUser);
  const { appState } = useSelector(selectApp);
  console.log("STATE", appState);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("access_token") || "";

  const value = queryString.parse(window.location.search);
  const email_verify_token = value.token;

  // Auto refresh access token
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

  // Get user information if access token exists
  useEffect(() => {
    const authUser = async () => {
      try {
        dispatch(setIsLoading(true));
        const { response } = await authService.getInfo();
        if (response) {
          dispatch(setUser(response.data.result));
        }
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(setIsLoading(false));
      }
    };

    if (accessToken) authUser();
  }, [dispatch, accessToken]);

  // Auto verify email
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        dispatch(setIsLoading(true));
        const { response } = await authService.verifyEmail();

        if (response) {
          dispatch(setUser({ ...user, verify: 1 }));
          navigate("/");
        }
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(setIsLoading(false));
      }
    };

    if (email_verify_token && user && !user?.verify) verifyEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, user]);

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
          <div className="col-span-10 md:col-span-7 xl:col-span-6 border-x">
            <GlobalLoading
              children={
                <div className="p-4">
                  {user && !user?.verify ? <VerifyMailAlert /> : <></>}
                  <Outlet />
                </div>
              }
            />
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
