import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { Button, Typography } from "@material-tailwind/react";

interface NotFoundAlertProps {
  message: string;
  isBack?: boolean;
}

const NotFoundAlert: React.FC<NotFoundAlertProps> = ({ message, isBack }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between rounded-lg p-4 bg-red-100 text-red-500">
      <div className="flex space-x-4">
        <div>
          <ExclamationCircleIcon className="h-6 w-6" />
        </div>
        <Typography className="font-bold">{message}</Typography>
      </div>

      {isBack !== false && (
        <Button onClick={() => navigate(-1)} color="red" size="sm">
          {t("home.Back")}
        </Button>
      )}
    </div>
  );
};

export default NotFoundAlert;
