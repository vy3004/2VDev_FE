import React from "react";

import { Typography } from "@material-tailwind/react";

interface SettingSectionProps {
  children: React.ReactNode;
  title: string;
}

const SettingSection: React.FC<SettingSectionProps> = ({ children, title }) => {
  return (
    <div className="space-y-4 bg-gray-100 rounded-md p-4 dark:bg-gray-800">
      <Typography className="font-bold text-xl text-gray-900 dark:text-gray-300">
        {title}
      </Typography>
      {children}
    </div>
  );
};

export default SettingSection;
