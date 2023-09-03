import { useSelector } from "react-redux";

import { Typography } from "@material-tailwind/react";
import { ShieldExclamationIcon } from "@heroicons/react/24/solid";

import { selectUser } from "../../redux/features/user-slice";

const AdminPage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useSelector(selectUser);

  return user && user.role === 1 ? (
    <>{children}</>
  ) : (
    <div className="flex rounded-lg p-4 space-x-4 !mb-4 bg-red-100 text-red-500">
      <div>
        <ShieldExclamationIcon className="h-6 w-6" />
      </div>
      <Typography className="font-bold">
        Sorry, you don't have permission to access this page.
      </Typography>
    </div>
  );
};

export default AdminPage;
