import React from "react";
import { HomeIcon, PhoneIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { MenuItem, Typography } from "@material-tailwind/react";

const NavList = () => {
  const navListItems = [
    {
      label: "Home",
      icon: HomeIcon,
      href: "/",
    },
    {
      label: "About Us",
      icon: UserGroupIcon,
      href: "/about",
    },
    {
      label: "Contact Us",
      icon: PhoneIcon,
      href: "/contact",
    },
  ];

  return (
    <ul className="hidden lg:flex lg:items-end">
      {navListItems.map(({ label, icon, href }, key) => (
        <Typography
          key={key}
          as="a"
          href={href}
          variant="small"
          className="font-normal"
        >
          <MenuItem className="flex items-center gap-2 lg:rounded-full">
            {React.createElement(icon, { className: "h-5 w-5" })} {label}
          </MenuItem>
        </Typography>
      ))}
    </ul>
  );
};

export default NavList;
