import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { setAppState } from "../../redux/features/app-state-slice";

interface PageWrapperProps {
  state: string;
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ state, children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    window.scroll(0, 0);
    dispatch(setAppState(state));
  }, [state, dispatch]);

  return <>{children}</>;
};

export default PageWrapper;
