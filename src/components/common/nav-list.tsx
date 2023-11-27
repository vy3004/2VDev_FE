import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { HomeIcon, PhoneIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { Button } from "@material-tailwind/react";

import { selectApp } from "../../redux/features/app-state-slice";

const NavList = () => {
  const navigate = useNavigate();
  const { appState } = useSelector(selectApp);
  const { t } = useTranslation();

  const navListItems = [
    {
      label: t("header.home"),
      icon: HomeIcon,
      href: "/?type=all&sort_field=created_at",
    },
    {
      label: t("header.about-us"),
      icon: UserGroupIcon,
      href: "/about",
    },
    {
      label: t("header.contact-us"),
      icon: PhoneIcon,
      href: "/contact",
    },
  ];

  return (
    <div className="hidden lg:flex lg:items-end gap-1">
      {navListItems.map(({ label, icon, href }, key) => (
        <Button
          onClick={() => navigate(href)}
          key={key}
          size="sm"
          className={`flex items-center gap-2 rounded-full border border-gray-900 shadow-none normal-case text-sm ${
            appState === href.split("?")[0]
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
