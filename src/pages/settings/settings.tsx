import { Typography } from "@material-tailwind/react";
import ChangePasswordForm from "../../components/auth-form/change-password-form";

const Settings = () => {
  return (
    <div className="space-y-4">
      <ChangePasswordForm />

      <div className="space-y-4 bg-gray-100 rounded-md p-4">
        <Typography className="font-bold text-xl text-gray-900">
          Language
        </Typography>
      </div>

      <div className="space-y-4 bg-gray-100 rounded-md p-4">
        <Typography className="font-bold text-xl text-gray-900">
          Theme
        </Typography>
      </div>
    </div>
  );
};

export default Settings;
