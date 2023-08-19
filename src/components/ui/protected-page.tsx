import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../redux/store";
import {
  setAuthModalName,
  setAuthModalOpen,
} from "../../redux/features/auth-modal-slice";

const ProtectedPage: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(setAuthModalOpen(!user));
    dispatch(setAuthModalName("signIn"));
  }, [user, dispatch]);

  return user ? <>{children}</> : null;
};

export default ProtectedPage;
