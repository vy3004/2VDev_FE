import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import jwtDecode from "jwt-decode";

import Header from "./header";
import Sidebar from "./sidebar";
import RightSidebar from "./right-sidebar";

import Container from "../common/container";
import GlobalLoading from "../common/global-loading";
import VerifyMailAlert from "../common/verify-mail-alert";
// import BreadcrumbsCustom from "../common/breadcrumbs";
import AnswerQuestion from "../common/answer-question";
import AuthModal from "../modals/auth-modal";
import EditMyProfileModal from "../modals/edit-my-profile-modal";
import PostInfoModal from "../modals/post-info-modal";
import ReportModal from "../modals/report-modal";
import RepostModal from "../modals/repost-modal";
import ConfirmModal from "../modals/confirm-modal";

import userService from "../../services/user-service";
import { selectUser, setUser } from "../../redux/features/user-slice";
import { setIsLoading } from "../../redux/features/global-loading";
import SpeedDialCustom from "../common/speed-dial";

const MainLayout = () => {
  const { user } = useSelector(selectUser);
  const [searchParams] = useSearchParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("access_token") || "";
  const email_verify_token = searchParams.get("token");

  // Auto refresh access token
  useEffect(() => {
    const authUser = async () => {
      if (accessToken) {
        try {
          const decodedToken: any = jwtDecode(accessToken);
          const currentTime = Math.floor(Date.now() / 1000);
          const tokenTimeout = 15; // 15 minutes in seconds

          if (decodedToken.exp - currentTime < tokenTimeout) {
            const { response } = await userService.refreshToken();

            if (response) {
              localStorage.setItem(
                "access_token",
                response.data.result.access_token
              );
            }
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
        const { response } = await userService.getInfo();
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
        const { response } = await userService.verifyEmail();

        if (response) {
          dispatch(
            setUser({
              ...user!,
              verify: 1,
              _id: user?._id || "",
              username: user?.username || "",
            })
          );
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

  // Navigate to current page after oauth google login
  useEffect(() => {
    if (window.location.pathname === "/login/oauth") {
      const access_token = searchParams.get("access_token");
      const refresh_token = searchParams.get("refresh_token");
      if (access_token && refresh_token) {
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
      }
      navigate(-2);
    }
  }, [navigate, searchParams]);

  return (
    <div className="relative h-full w-full dark:bg-gray-900">
      {/* Modal */}
      <AuthModal />
      <EditMyProfileModal />
      <PostInfoModal />
      <ReportModal />
      <RepostModal />
      <ConfirmModal />
      {/* Modal */}

      <Header />

      <SpeedDialCustom />

      {/* Page Content */}
      <Container>
        <div className="grid grid-cols-12">
          {/* Left sidebar */}
          <div className="h-[calc(100vh-78px)] sticky top-[78px] hidden xl:flex xl:col-span-2">
            <Sidebar />
          </div>
          {/* Left sidebar */}

          {/* Main content */}
          <div className="col-span-12 lg:col-span-8 xl:col-span-7 border-x dark:border-gray-900">
            <GlobalLoading
              children={
                <div className="px-4 pb-4 space-y-4">
                  <AnswerQuestion />
                  {/* <BreadcrumbsCustom /> */}
                  {user && !user?.verify ? <VerifyMailAlert /> : <></>}
                  <Outlet />
                </div>
              }
            />
          </div>
          {/* Main content */}

          {/* Right sidebar */}
          <div className="lg:h-[calc(100vh-78px)] lg:sticky lg:top-[78px] col-span-12 lg:col-span-4 xl:col-span-3 border-x dark:border-gray-900">
            <div className="lg:overflow-hidden lg:overflow-y-scroll w-full h-full">
              <RightSidebar />
            </div>
          </div>
          {/* Right sidebar */}
        </div>
      </Container>
      {/* Page Content */}
    </div>
  );
};

export default MainLayout;
