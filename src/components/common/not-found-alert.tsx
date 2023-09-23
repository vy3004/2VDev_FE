import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { Button, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

interface NotFoundAlertProps {
  message: string;
}

const NotFoundAlert: React.FC<NotFoundAlertProps> = ({ message }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between rounded-lg p-4 bg-red-100 text-red-500">
      <div className="flex space-x-4">
        <div>
          <ExclamationCircleIcon className="h-6 w-6" />
        </div>
        <Typography className="font-bold">{message}</Typography>
      </div>
      <Button onClick={() => navigate(-1)} color="red" size="sm">
        Back
      </Button>
    </div>
  );
};

export default NotFoundAlert;
