import { BellIcon, ClockIcon } from "@heroicons/react/24/solid";
import {
  Avatar,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";

const NotificationMenu = () => {
  return (
    <Menu>
      <MenuHandler>
        <IconButton variant="text" className="hidden lg:flex dark:text-gray-50">
          <BellIcon className="h-5 w-5" />
        </IconButton>
      </MenuHandler>
      <MenuList className="flex flex-col gap-2">
        <MenuItem className="flex items-center gap-4 py-2 pl-2 pr-8">
          <Avatar
            variant="circular"
            alt="tania andrew"
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
          />
          <div className="flex flex-col gap-1">
            <Typography variant="small" color="gray" className="font-semibold">
              Tania send you a message
            </Typography>
            <Typography className="flex items-center gap-1 text-sm font-medium text-blue-gray-500">
              <ClockIcon className="h-4 w-4" />
              13 minutes ago
            </Typography>
          </div>
        </MenuItem>
        <MenuItem className="flex items-center gap-4 py-2 pl-2 pr-8">
          <Avatar
            variant="circular"
            alt="natali craig"
            src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1061&q=80"
          />
          <div className="flex flex-col gap-1">
            <Typography variant="small" color="gray" className="font-semibold">
              Natali replied to your email.
            </Typography>
            <Typography className="flex items-center gap-1 text-sm font-medium text-blue-gray-500">
              <ClockIcon className="h-4 w-4" />1 hour ago
            </Typography>
          </div>
        </MenuItem>
        <MenuItem className="flex items-center gap-4 py-2 pl-2 pr-8">
          <Avatar
            variant="circular"
            alt="paypal"
            src="https://dwglogo.com/wp-content/uploads/2016/08/PayPal_Logo_Icon.png"
          />
          <div className="flex flex-col gap-1">
            <Typography variant="small" color="gray" className="font-semibold">
              You&apos;ve received a payment.
            </Typography>
            <Typography className="flex items-center gap-1 text-sm font-medium text-blue-gray-500">
              <ClockIcon className="h-4 w-4" />5 hours ago
            </Typography>
          </div>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default NotificationMenu;
