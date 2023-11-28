import React from "react";

import { ClockIcon } from "@heroicons/react/24/solid";
import { Tooltip, Typography } from "@material-tailwind/react";

import { formatTime, formatTimeDistanceToNow } from "../../utils/string-utils";

interface TimeProps {
  time: string;
}

const Time: React.FC<TimeProps> = ({ time }) => {
  return (
    <Tooltip content={formatTime(time)}>
      <Typography className="text-sx text-gray-600 hover:text-blue-500 cursor-pointer flex items-center gap-1">
        <ClockIcon className="w-4 h-4" />
        {formatTimeDistanceToNow(time)}
      </Typography>
    </Tooltip>
  );
};

export default Time;
