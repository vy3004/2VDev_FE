import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "@material-tailwind/react";

import {
  selectAuthModal,
  setAuthModalOpen,
  setAuthModalName,
} from "../../redux/features/auth-modal-slice";

import SignInForm from "../ui/sign-in-form";
import SignUpForm from "../ui/sign-up-form";

const AuthModal = () => {
  const { authModalOpen, authModalName } = useSelector(selectAuthModal);

  const dispatch = useDispatch();

  const handleClose = () => dispatch(setAuthModalOpen(false));

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
          />
        )}
        {authModalName === "signUp" && (
          <SignUpForm
            switchAuthState={() => dispatch(setAuthModalName("signIn"))}
          />
        )}
      </Dialog>
    </>
  );
};

export default AuthModal;
