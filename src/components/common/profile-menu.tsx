import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  ChevronDownIcon,
  Cog6ToothIcon,
  PowerIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import {
  Avatar,
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";

import authService from "../../services/user-service";
import { selectUser, setUser } from "../../redux/features/user-slice";

import { getLastTwoWords } from "../../utils/string-utils";

interface profileMenuItem {
  label: string;
  icon: any;
  onClick: () => void;
}

const ProfileMenu = () => {
  const { user } = useSelector(selectUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    const { response } = await authService.logout();
    if (response) {
      dispatch(setUser(null));
      toast.success("Sign Out Success");
    }
  };

  const profileMenuItems: profileMenuItem[] = [
    {
      label: "My Profile",
      icon: UserCircleIcon,
      onClick() {
        navigate(`/profile/${user?.username}`);
      },
    },
    {
      label: "Setting",
      icon: Cog6ToothIcon,
      onClick() {
        navigate("/settings");
      },
    },
    {
      label: "Sign Out",
      icon: PowerIcon,
      onClick: handleLogout,
    },
  ];

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="sm:w-32 flex items-center gap-2 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto dark:bg-gray-900"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="tania andrew"
            className="border border-gray-900 dark:border-gray-50 p-0.5"
            src={
              user?.avatar ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYmkp9a2rrD1Sskb9HLt5mDaTt4QaIs8CcBg&usqp=CAU"
            }
          />
          <div>
            <Typography className="normal-case text-gray-700 dark:text-gray-4   00 text-xs font-medium">
              Welcome!
            </Typography>
            <Typography className="normal-case text-gray-900 dark:text-gray-50 text-sm font-bold">
              {getLastTwoWords(user?.name || "")}
            </Typography>
          </div>

          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList
        className="p-1 dark:bg-gray-700 dark:text-gray-50 dark:border-gray-700"
        onClick={closeMenu}
      >
        {profileMenuItems.map(({ label, icon, onClick }, key) => {
          const isLastItem = key === profileMenuItems.length - 1;
          return (
            <MenuItem
              key={label}
              onClick={onClick}
              className={`flex items-center gap-2 rounded ${
                isLastItem
                  ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                  : ""
              }`}
            >
              {React.createElement(icon, {
                className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                strokeWidth: 2,
              })}
              <Typography
                as="span"
                variant="small"
                className="font-normal"
                color={isLastItem ? "red" : "inherit"}
              >
                {label}
              </Typography>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};

export default ProfileMenu;
