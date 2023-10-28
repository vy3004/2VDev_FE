import { useNavigate } from "react-router-dom";

import { Breadcrumbs, Typography } from "@material-tailwind/react";
import { HomeIcon } from "@heroicons/react/24/solid";

import { splitPath } from "../../utils/string-utils";

const BreadcrumbsCustom = () => {
  const items = splitPath(window.location.pathname);
  const navigate = useNavigate();

  return (
    <Breadcrumbs
      separator={<div className="dark:text-gray-50">/</div>}
      fullWidth
      className="dark:bg-gray-700"
    >
      <Typography className="dark:text-gray-50" onClick={() => navigate("/")}>
        <HomeIcon className="w-4 h-4" />
      </Typography>
      {items.map((item, key) => (
        <Typography
          key={key}
          onClick={() => navigate(item.path)}
          className="last:opacity-50 dark:text-gray-50"
        >
          {item.label}
        </Typography>
      ))}
    </Breadcrumbs>
  );
};

export default BreadcrumbsCustom;
