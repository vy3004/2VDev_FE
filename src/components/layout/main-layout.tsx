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

const MainLayout = () => {
  const { user } = useSelector(selectUser);

  const dispatch = useDispatch();

  useEffect(() => {
    const authUser = async () => {
      const { response } = await authService.getInfo();

      if (response) dispatch(setUser(response.data.result));
    };

    authUser();
  }, [dispatch]);

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
