import { Typography } from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

interface ErrorMessageFormProps {
  message: string; // message to display in the error box.
}

const ErrorMessageForm: React.FC<ErrorMessageFormProps> = ({ message }) => {
  return (
    <div className="!mt-1 ml-3 flex items-start gap-1 font-normal text-red-500">
      <div>
        <InformationCircleIcon className="h-5 w-5" />
      </div>
      <Typography className="text-sm">{message}</Typography>
    </div>
  );
};

export default ErrorMessageForm;
