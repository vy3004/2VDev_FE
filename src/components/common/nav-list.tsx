import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { HomeIcon, PhoneIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { Button } from "@material-tailwind/react";

import { selectApp } from "../../redux/features/app-state-slice";

const NavList = () => {
  const navigate = useNavigate();
  const { appState } = useSelector(selectApp);

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
    <div className="hidden md:flex md:items-end gap-1">
      {navListItems.map(({ label, icon, href }, key) => (
        <Button
          onClick={() => navigate(href)}
          key={key}
          size="sm"
          className={`flex items-center gap-2 rounded-full border border-gray-900 shadow-none normal-case text-sm ${
            appState === href
              ? "bg-gray-900 text-gray-50 dark:bg-gray-50 dark:text-gray-900"
              : "bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-50"
          }`}
        >
          {React.createElement(icon, { className: "h-5 w-5" })} {label}
        </Button>
      ))}
    </div>
  );
};

export default NavList;
