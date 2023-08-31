import {
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { Typography } from "@material-tailwind/react";

interface NotificationFormProps {
  type: string;
  message: string;
}

const NotificationForm: React.FC<NotificationFormProps> = ({
  type,
  message,
}) => {
  return (
    <>
      {type === "success" && (
        <Typography
          className="p-2 border border-green-500 rounded-full bg-green-100 flex items-center gap-1 font-normal text-green-500"
          variant="small"
        >
          <CheckCircleIcon className="h-4 w-4" />
          {message}
        </Typography>
      )}
      {type === "error" && (
        <Typography
          className="p-2 border border-red-500 rounded-full bg-red-100 flex items-center gap-1 font-normal text-red-500"
          variant="small"
        >
          <InformationCircleIcon className="h-4 w-4" />
          {message}
        </Typography>
      )}
    </>
  );
};

export default NotificationForm;
