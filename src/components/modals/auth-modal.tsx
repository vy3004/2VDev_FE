import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "@material-tailwind/react";

import {
  selectAuthModal,
  setAuthModalOpen,
  setAuthModalName,
} from "../../redux/features/auth-modal-slice";

import SignInForm from "../ui/sign-in-form";
import SignUpForm from "../ui/sign-up-form";
import authService from "../../services/user-service";
import { setUser } from "../../redux/features/user-slice";

const AuthModal = () => {
  const { authModalOpen, authModalName } = useSelector(selectAuthModal);

  const dispatch = useDispatch();

  const handleClose = () => dispatch(setAuthModalOpen(false));

  const authUser = async () => {
    const { response } = await authService.getInfo();

    if (response) {
      dispatch(setUser(response.data.result));
    }
  };

  return (
    <>
      <Dialog
        size="lg"
        open={authModalOpen}
        handler={handleClose}
        className="bg-transparent shadow-none"
      >
        {authModalName === "signIn" && (
          <SignInForm
            switchAuthState={() => dispatch(setAuthModalName("signUp"))}
            authUser={authUser}
          />
        )}
        {authModalName === "signUp" && (
          <SignUpForm
            switchAuthState={() => dispatch(setAuthModalName("signIn"))}
            authUser={authUser}
          />
        )}
      </Dialog>
    </>
  );
};

export default AuthModal;
