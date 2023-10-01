import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
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
  IdentificationIcon,
  ChatBubbleBottomCenterTextIcon,
  BellIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

import { selectUser } from "../../redux/features/user-slice";
import { selectApp } from "../../redux/features/app-state-slice";

interface sidebarItem {
  label: string;
  icon: any;
  href: string;
}

const Sidebar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { user } = useSelector(selectUser);
  const { appState } = useSelector(selectApp);

  const [open, setOpen] = useState(1);

  const handleOpen = (value: number) => {
    setOpen(open === value ? 0 : value);
  };

  const listDashboard: sidebarItem[] = [
    {
      label: t("sidebar.overview"),
      icon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
      href: "/dashboard/overview",
    },
    {
      label: t("sidebar.manage-users"),
      icon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
      href: "/dashboard/manage-users",
    },
    {
      label: t("sidebar.manage-posts"),
      icon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
      href: "/dashboard/manage-posts",
    },
  ];

  const listHome: sidebarItem[] = [
    {
      label: t("sidebar.new"),
      icon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
      href: "/?filter=new",
    },
    {
      label: t("sidebar.followed"),
      icon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
      href: "/?filter=follow",
    },
    {
      label: t("sidebar.trending"),
      icon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
      href: "/?filter=trend",
    },
    {
      label: t("sidebar.popular"),
      icon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
      href: "/?filter=popular",
    },
    {
      label: t("sidebar.hot"),
      icon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
      href: "/?filter=hot",
    },
  ];

  const listGuest: sidebarItem[] = [
    {
      label: t("sidebar.tags"),
      icon: <TagIcon className="h-5 w-5" />,
      href: "/tags",
    },
    {
      label: t("sidebar.communities"),
      icon: <IdentificationIcon className="h-5 w-5" />,
      href: "/communities",
    },
    {
      label: t("sidebar.users"),
      icon: <UserGroupIcon className="h-5 w-5" />,
      href: "/users",
    },
  ];

  return (
    <Card className="shadow-none h-[calc(100%-77px)] overflow-hidden hover:overflow-y-scroll bg-transparent">
      <List className="min-w-full my-4 dark:text-gray-50">
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
          <ListItem className="p-0" selected={open === 1}>
            <AccordionHeader
              onClick={() => handleOpen(1)}
              className="border-b-0 p-3 dark:text-gray-50"
            >
              <ListItemPrefix>
                <NewspaperIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Typography className="mr-auto font-normal">
                {" "}
                {t("sidebar.news-feed")}
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              {listHome.map(({ label, icon, href }, key) => (
                <ListItem
                  className={`${
                    appState === href && "dark:bg-gray-50 dark:text-gray-900"
                  }`}
                  selected={appState === href}
                  onClick={() => navigate(href)}
                  key={key}
                >
                  <ListItemPrefix>{icon}</ListItemPrefix>
                  {label}
                </ListItem>
              ))}
            </List>
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
            <ListItem className="p-0" selected={open === 2}>
              <AccordionHeader
                onClick={() => handleOpen(2)}
                className="border-b-0 p-3 dark:text-gray-50"
              >
                <ListItemPrefix>
                  <PresentationChartBarIcon className="h-5 w-5" />
                </ListItemPrefix>
                <Typography className="mr-auto font-normal">
                  {t("sidebar.dashboard")}
                </Typography>
              </AccordionHeader>
            </ListItem>
            <AccordionBody className="py-1">
              <List className="p-0 dark:text-gray-50">
                {listDashboard.map(({ label, icon, href }, key) => (
                  <ListItem
                    className={`${
                      appState === href && "dark:bg-gray-50 dark:text-gray-900"
                    }`}
                    selected={appState === href}
                    onClick={() => navigate(href)}
                    key={key}
                  >
                    <ListItemPrefix>{icon}</ListItemPrefix>
                    {label}
                  </ListItem>
                ))}
              </List>
            </AccordionBody>
          </Accordion>
        )}
        {/* Admin dashboard end */}

        {/* Guest items start */}
        {listGuest.map(({ label, icon, href }, key) => (
          <ListItem
            selected={appState === href}
            onClick={() => navigate(href)}
            key={key}
          >
            <ListItemPrefix>{icon}</ListItemPrefix>
            {label}
          </ListItem>
        ))}
        {/* Guest items end */}

        {/* User items start */}
        {user && (
          <>
            <hr className="my-2 border-blue-gray-50" />

            <ListItem onClick={() => navigate("/message")}>
              <ListItemPrefix>
                <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />
              </ListItemPrefix>
              {t("user.message")}
              <ListItemSuffix>
                <Chip
                  value="14"
                  size="sm"
                  variant="ghost"
                  className="rounded-full dark:bg-blue-gray-50"
                />
              </ListItemSuffix>
            </ListItem>
            <ListItem onClick={() => navigate("/notification")}>
              <ListItemPrefix>
                <BellIcon className="h-5 w-5" />
              </ListItemPrefix>
              {t("user.notification")}
              <ListItemSuffix>
                <Chip
                  value="7"
                  size="sm"
                  variant="ghost"
                  className="rounded-full dark:bg-blue-gray-50"
                />
              </ListItemSuffix>
            </ListItem>
            <ListItem
              onClick={() => navigate(`/profile/${user.username}`)}
              selected={appState === "/profile/:username"}
            >
              <ListItemPrefix>
                <UserCircleIcon className="h-5 w-5" />
              </ListItemPrefix>
              {t("user.profile")}
            </ListItem>
            <ListItem onClick={() => navigate("/settings")}>
              <ListItemPrefix>
                <Cog6ToothIcon className="h-5 w-5" />
              </ListItemPrefix>
              {t("user.setting")}
            </ListItem>
          </>
        )}
        {/* User items start */}
      </List>
    </Card>
  );
};

export default Sidebar;
