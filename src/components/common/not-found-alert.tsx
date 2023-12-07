import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { Button, Typography } from "@material-tailwind/react";

interface NotFoundAlertProps {
  message: string;
  type: "error" | "success";
  isBack?: boolean;
}

const NotFoundAlert: React.FC<NotFoundAlertProps> = ({
  message,
  type,
  isBack = false,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const alertStyles =
    type === "error"
      ? "bg-red-100 text-red-500"
      : "bg-green-100 text-green-500";

  return (
    <div
      className={`flex items-center justify-between rounded-lg p-4 gap-2 ${alertStyles}`}
    >
      <div className="flex space-x-4 w-fit">
        <div>
          <ExclamationCircleIcon className="h-6 w-6" />
        </div>
        <Typography className="font-bold">{t(message)}</Typography>
      </div>

      {isBack && (
        <Button onClick={() => navigate(-1)} color="red" size="sm">
          {t("home.Back")}
        </Button>
      )}
    </div>
  );
};

export default NotFoundAlert;
