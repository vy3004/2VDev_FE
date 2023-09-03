import { toast } from "react-hot-toast";

import { Typography } from "@material-tailwind/react";
import { EnvelopeOpenIcon } from "@heroicons/react/24/solid";

import authService from "../../services/user-service";

const VerifyMailAlert = () => {
  const handleResendVerifyEmail = async () => {
    const { response } = await authService.resendVerifyEmail();
    if (response) toast.success(response.data.message);
  };

  return (
    <div className="flex border rounded-lg p-4 space-x-4 bg-yellow-50 text-yellow-800">
      <div>
        <EnvelopeOpenIcon className="h-6 w-6" />
      </div>

      <Typography className="font-bold">
        A confirmation mail has been sent to your registered email account, If
        you have not received the confirmation mail, kindly
        <span
          onClick={handleResendVerifyEmail}
          className="text-blue-500 cursor-pointer"
        >
          {" "}
          Click here
        </span>{" "}
        to re-send another confirmation mail.
      </Typography>
    </div>
  );
};

export default VerifyMailAlert;
