import React, { ReactNode } from "react";
import { Typography } from "@material-tailwind/react";

interface PageDescriptionProps {
  title: ReactNode;
  desc: ReactNode;
}

const PageDescription: React.FC<PageDescriptionProps> = ({ title, desc }) => {
  return (
    <div>
      <Typography variant="h5">{title}</Typography>
      <Typography className="mt-1 font-normal">{desc}</Typography>
    </div>
  );
};

export default PageDescription;
