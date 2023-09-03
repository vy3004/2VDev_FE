import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { UserIcon } from "@heroicons/react/24/solid";
import { Typography } from "@material-tailwind/react";

import {
  setAuthModalName,
  setAuthModalOpen,
} from "../../redux/features/auth-modal-slice";
import { selectUser } from "../../redux/features/user-slice";

const ProtectedPage: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);

  useEffect(() => {
    dispatch(setAuthModalOpen(!user));
    dispatch(setAuthModalName("signIn"));
  }, [user, dispatch]);

  return user ? (
    <>{children}</>
  ) : (
    <div className="flex rounded-lg p-4 space-x-4 bg-red-100 text-red-500">
      <div>
        <UserIcon className="h-6 w-6" />
      </div>
      <Typography className="font-bold">
        You need to sign in to access this page.
      </Typography>
    </div>
  );
};

export default ProtectedPage;
