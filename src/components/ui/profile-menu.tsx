import React, { useState } from "react";

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
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "../../redux/features/user-slice";
import authService from "../../services/user-service";
import { getLastTwoWords } from "../../utils/string-utils";

interface profileMenuItem {
  label: string;
  icon: any;
  onClick: () => void;
}

interface MenuItems {
  items: Array<profileMenuItem>;
}

const ProfileMenu = () => {
  const { user } = useSelector(selectUser);

  const dispatch = useDispatch();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    const { response } = await authService.logout();
    if (response) {
      dispatch(setUser(null));
    }
  };

  const profileMenuItems: MenuItems = {
    items: [
      {
        label: "My Profile",
        icon: UserCircleIcon,
        onClick() {},
      },
      {
        label: "Setting",
        icon: Cog6ToothIcon,
        onClick() {},
      },
      {
        label: "Sign Out",
        icon: PowerIcon,
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="sm:w-32 flex items-center gap-2 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="tania andrew"
            className="border border-gray-900 p-0.5"
            src={
              user?.avatar ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYmkp9a2rrD1Sskb9HLt5mDaTt4QaIs8CcBg&usqp=CAU"
            }
          />
          <div className="hidden sm:flex sm:flex-col">
            <Typography className="normal-case text-gray-700 text-xs font-medium">
              Welcome!
            </Typography>
            <Typography className="normal-case text-gray-900 text-sm font-bold">
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
      <MenuList className="p-1" onClick={closeMenu}>
        {profileMenuItems.items.map(({ label, icon, onClick }, key) => {
          const isLastItem = key === profileMenuItems.items.length - 1;
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
