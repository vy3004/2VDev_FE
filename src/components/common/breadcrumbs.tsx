import { Breadcrumbs } from "@material-tailwind/react";
import { HomeIcon } from "@heroicons/react/24/solid";

import { splitPath } from "../../utils/string-utils";

const BreadcrumbsCustom = () => {
  const items = splitPath(window.location.pathname);

  return (
    <Breadcrumbs
      separator={<div className="dark:text-gray-50">/</div>}
      fullWidth
      className="dark:bg-gray-700"
    >
      <a className="dark:text-gray-50" href="/">
        <HomeIcon className="w-4 h-4" />
      </a>
      {items.map((item, key) => (
        <a
          key={key}
          href={item.path}
          className="last:opacity-50 dark:text-gray-50"
        >
          {item.label}
        </a>
      ))}
    </Breadcrumbs>
  );
};

export default BreadcrumbsCustom;
