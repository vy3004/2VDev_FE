import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import jwtDecode from "jwt-decode";

import Footer from "./footer";
import Header from "./header";
import Sidebar from "./sidebar";
import RightSidebar from "./right-sidebar";

import Container from "../common/container";
import GlobalLoading from "../common/global-loading";
import VerifyMailAlert from "../common/verify-mail-alert";
import BreadcrumbsCustom from "../common/breadcrumbs";
import AnswerQuestion from "../common/answer-question";
import AuthModal from "../modals/auth-modal";
import EditMyProfileModal from "../modals/edit-my-profile-modal";

import authService from "../../services/user-service";
import { selectUser, setUser } from "../../redux/features/user-slice";
import { setIsLoading } from "../../redux/features/global-loading";

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
    <>
      {/* Modal */}
      <AuthModal />
      <EditMyProfileModal />
      {/* Modal */}

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
          <div className="col-span-10 lg:col-span-7 xl:col-span-6 border-x">
            <GlobalLoading
              children={
                <div className="px-4 space-y-4">
                  <AnswerQuestion />
                  <BreadcrumbsCustom />
                  {user && !user?.verify ? <VerifyMailAlert /> : <></>}
                  <Outlet />
                </div>
              }
            />
          </div>
          {/* Main content */}

          {/* Right sidebar */}
          <div className="lg:h-screen lg:sticky lg:top-[73px] col-span-10 lg:col-span-3 xl:col-span-2 border-x">
            <div className="lg:overflow-hidden lg:hover:overflow-y-scroll w-full h-[calc(100%-77px)]">
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
