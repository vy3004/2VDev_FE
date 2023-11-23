import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "@material-tailwind/react";
import queryString from "query-string";

import {
  selectAuthModal,
  setAuthModalOpen,
  setAuthModalName,
} from "../../redux/features/auth-modal-slice";

import SignInForm from "../auth-form/sign-in-form";
import SignUpForm from "../auth-form/sign-up-form";
import ForgotPasswordForm from "../auth-form/forgot-password-form";
import ResetPasswordForm from "../auth-form/reset-password-form";

import authService from "../../services/user-service";
import { setUser } from "../../redux/features/user-slice";

const AuthModal = () => {
  const { authModalOpen, authModalName } = useSelector(selectAuthModal);
  const dispatch = useDispatch();

  const value = queryString.parse(window.location.search);
  const forgot_password_token = value.token;

  const handleClose = () => dispatch(setAuthModalOpen(false));

  const switchAuthState = (name: string) => dispatch(setAuthModalName(name));

  const authUser = async (): Promise<boolean> => {
    const { response } = await authService.getInfo();

    if (response) {
      if (response.data.result?.verify === 2) {
        return false;
      } else {
        dispatch(setUser(response.data.result));
        return true;
      }
    } else {
      return false;
    }
  };

  useEffect(() => {
    const verifyForgotPassword = async () => {
      const { response } = await authService.verifyForgotPassword();

      if (response) {
        dispatch(setAuthModalOpen(true));
        switchAuthState("resetPassword");
      }
    };

    if (forgot_password_token) verifyForgotPassword();
  });

  return (
    <>
      <Dialog
        size="lg"
        open={authModalOpen}
        handler={handleClose}
        className="bg-transparent shadow-none"
      >
        {authModalName === "signIn" && (
          <SignInForm switchAuthState={switchAuthState} authUser={authUser} />
        )}
        {authModalName === "signUp" && (
          <SignUpForm switchAuthState={switchAuthState} authUser={authUser} />
        )}
        {authModalName === "forgotPassword" && (
          <ForgotPasswordForm switchAuthState={switchAuthState} />
        )}
        {authModalName === "resetPassword" && (
          <ResetPasswordForm switchAuthState={switchAuthState} />
        )}
      </Dialog>
    </>
  );
};

export default AuthModal;
