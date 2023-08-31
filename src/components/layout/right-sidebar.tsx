import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import { Button, Typography } from "@material-tailwind/react";

const RightSidebar = () => {
  return (
    <div className="h-[2000px]">
      <div className="border flex justify-center py-4">
        <Button className="flex items-center gap-2 text-lg normal-case">
          <QuestionMarkCircleIcon className="w-6 h-6" />
          Ask Question
        </Button>
      </div>
      <div className="grid grid-cols-2 p-4">
        <div className="border flex flex-col items-center">
          <Typography>Questions</Typography>
          <Typography>01</Typography>
        </div>
        <div className="">
          <Typography>Question</Typography>
          <Typography>01</Typography>
        </div>
        <div className="">
          <Typography>Question</Typography>
          <Typography>01</Typography>
        </div>
        <div className="">
          <Typography>Question</Typography>
          <Typography>01</Typography>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
