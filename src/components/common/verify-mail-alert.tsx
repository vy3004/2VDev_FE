import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { Typography } from "@material-tailwind/react";
import { EnvelopeOpenIcon } from "@heroicons/react/24/solid";

import authService from "../../services/user-service";

const VerifyMailAlert = () => {
  const { t } = useTranslation();

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
        {t("notification.verify-mail-1")}
        <span
          onClick={handleResendVerifyEmail}
          className="text-blue-500 cursor-pointer"
        >
          {" "}
          {t("notification.verify-mail-2")}
        </span>{" "}
        {t("notification.verify-mail-3")}
      </Typography>
    </div>
  );
};

export default VerifyMailAlert;
