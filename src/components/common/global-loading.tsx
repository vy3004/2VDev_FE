import { useSelector } from "react-redux";
import { selectGlobalLoading } from "../../redux/features/global-loading";
import { Typography } from "@material-tailwind/react";

interface GlobalLoadingProps {
  children: React.ReactNode;
}

const GlobalLoading: React.FC<GlobalLoadingProps> = ({ children }) => {
  const { isGlobalLoading } = useSelector(selectGlobalLoading);

  return isGlobalLoading ? (
    <div className="relative h-full w-full">
      <img className="h-full w-full" src="/loading.gif" alt="gif" />

      <Typography className="animate-bounce w-full absolute top-10 sm:top-32 text-center text-xl sm:text-3xl text-blue-gray-800 font-semibold ml-2">
        Loading ...
      </Typography>
    </div>
  ) : (
    <>{children}</>
  );
};

export default GlobalLoading;
