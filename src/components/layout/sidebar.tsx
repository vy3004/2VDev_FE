import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  NewspaperIcon,
  TagIcon,
  UserGroupIcon,
  BookmarkSquareIcon,
} from "@heroicons/react/24/solid";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import Divider from "../common/divider";

import { selectUser } from "../../redux/features/user-slice";

import { POSTS_SORT } from "../../utils/constant";

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useSelector(selectUser);

  const [open, setOpen] = useState(1);

  const hrefCurrent = location.pathname + location.search;

  const handleOpen = (value: number) => {
    setOpen(open === value ? 0 : value);
  };

  const renderListItem = (item: SidebarItem, key: number) => (
    <ListItem
      className={`select-none dark:text-gray-400 dark:hover:bg-gray-800 ${
        hrefCurrent === item.href && "dark:bg-gray-800 dark:text-gray-50"
      }`}
      selected={hrefCurrent === item.href}
      onClick={() => navigate(item.href)}
      key={key}
    >
      <ListItemPrefix>{item.icon}</ListItemPrefix>
      {item.label}
    </ListItem>
  );

  const listDashboard: SidebarItem[] = [
    {
      label: t("sidebar.Overview"),
      icon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
      href: "/dashboard/overview",
    },
    {
      label: t("sidebar.Manage Users"),
      icon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
      href: "/dashboard/manage-users",
    },
    {
      label: t("sidebar.Manage Posts"),
      icon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
      href: "/dashboard/manage-posts",
    },
  ];

  const listHome: SidebarItem[] = POSTS_SORT.map((item) => ({
    label: t(`sidebar.${item.label}`),
    icon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
    href: `/?type=all&sort_field=${item.value}`,
  }));

  const listGuest: SidebarItem[] = [
    {
      label: t("sidebar.Tags"),
      icon: <TagIcon className="h-5 w-5" />,
      href: "/tags",
    },
  ];

  const listUser: SidebarItem[] = [
    {
      label: t("sidebar.Profile"),
      icon: <UserCircleIcon className="h-5 w-5" />,
      href: `/profile/${user && user.username}`,
    },
    {
      label: t("sidebar.Users"),
      icon: <UserGroupIcon className="h-5 w-5" />,
      href: "/users",
    },
    {
      label: t("sidebar.My Bookmarks"),
      icon: <BookmarkSquareIcon className="h-5 w-5" />,
      href: "/bookmarks",
    },
    {
      label: t("sidebar.Settings"),
      icon: <Cog6ToothIcon className="h-5 w-5" />,
      href: "/settings",
    },
  ];

  return (
    <Card className="shadow-none w-full h-full overflow-hidden overflow-y-auto bg-transparent">
      <List className="my-4 px-1.5 dark:text-gray-400">
        {/* Feed start */}
        <Accordion
          open={open === 1}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${
                open === 1 ? "rotate-180" : ""
              }`}
            />
          }
        >
          <ListItem
            className={`p-0 dark:hover:bg-gray-800 ${
              open === 1 && "dark:bg-gray-800"
            }`}
            selected={open === 1}
          >
            <AccordionHeader
              onClick={() => handleOpen(1)}
              className="border-b-0 p-3 dark:text-gray-400"
            >
              <ListItemPrefix>
                <NewspaperIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Typography className="mr-auto font-normal">
                {t("sidebar.Questions")}
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">{listHome.map(renderListItem)}</List>
          </AccordionBody>
        </Accordion>
        {/* Feed end */}

        {/* Admin dashboard start */}
        {user?.role === 1 && (
          <Accordion
            open={open === 2}
            icon={
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`mx-auto h-4 w-4 transition-transform ${
                  open === 2 ? "rotate-180" : ""
                }`}
              />
            }
          >
            <ListItem
              className={`p-0 dark:hover:bg-gray-800 ${
                open === 2 && "dark:bg-gray-800"
              }`}
              selected={open === 2}
            >
              <AccordionHeader
                onClick={() => handleOpen(2)}
                className="border-b-0 p-3 dark:text-gray-400"
              >
                <ListItemPrefix>
                  <PresentationChartBarIcon className="h-5 w-5" />
                </ListItemPrefix>
                <Typography className="mr-auto font-normal">
                  {t("sidebar.Dashboard")}
                </Typography>
              </AccordionHeader>
            </ListItem>
            <AccordionBody className="py-1">
              <List className="p-0">{listDashboard.map(renderListItem)}</List>
            </AccordionBody>
          </Accordion>
        )}
        {/* Admin dashboard end */}

        {/* Guest items start */}
        {listGuest.map(renderListItem)}
        {/* Guest items end */}

        {/* User items start */}
        {user && (
          <>
            <div className="my-2">
              <Divider />
            </div>
            {listUser.map(renderListItem)}
          </>
        )}
        {/* User items end */}
      </List>
      <Divider />
      <footer className="p-6">
        <Typography className="dark:text-gray-400">
          &copy; 2023 2VDev
        </Typography>
      </footer>
    </Card>
  );
};

export default Sidebar;
