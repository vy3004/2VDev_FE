import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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
  BookOpenIcon,
  HomeIcon,
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

  const { user } = useSelector(selectUser);
  const { appState } = useSelector(selectApp);

  const [open, setOpen] = useState(0);

  const handleOpen = (value: number) => {
    setOpen(open === value ? 0 : value);
  };

  const listDashboard: sidebarItem[] = [
    {
      label: "Overview",
      icon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
      href: "/overview",
    },
    {
      label: "Manage users",
      icon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
      href: "/manage-users",
    },
    {
      label: "Manage posts",
      icon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
      href: "/manage-posts",
    },
  ];

  const listQuestions: sidebarItem[] = [
    {
      label: "New questions",
      icon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
      href: "/new-questions",
    },
    {
      label: "Trending questions",
      icon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
      href: "/trending-questions",
    },
    {
      label: "Popular questions",
      icon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
      href: "/popular-questions",
    },
    {
      label: "Hot questions",
      icon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
      href: "/hot-questions",
    },
  ];

  const listGuest: sidebarItem[] = [
    {
      label: "Feed",
      icon: <NewspaperIcon className="h-5 w-5" />,
      href: "/feed",
    },
    {
      label: "Tags",
      icon: <TagIcon className="h-5 w-5" />,
      href: "/tags",
    },
    {
      label: "Communities",
      icon: <IdentificationIcon className="h-5 w-5" />,
      href: "/communities",
    },
    {
      label: "Users",
      icon: <UserGroupIcon className="h-5 w-5" />,
      href: "/users",
    },
  ];

  return (
    <Card className="shadow-none h-[calc(100%-5rem)] overflow-hidden hover:overflow-y-scroll">
      <List className="min-w-full my-4">
        <ListItem selected={appState === "/"} onClick={() => navigate("/")}>
          <ListItemPrefix>
            <HomeIcon className="h-5 w-5" />
          </ListItemPrefix>
          Home
        </ListItem>
        {/* Admin dashboard start */}
        {user?.role === 1 && (
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
                className="border-b-0 p-3"
              >
                <ListItemPrefix>
                  <PresentationChartBarIcon className="h-5 w-5" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  Dashboard
                </Typography>
              </AccordionHeader>
            </ListItem>
            <AccordionBody className="py-1">
              <List className="p-0">
                {listDashboard.map(({ label, icon, href }, key) => (
                  <ListItem
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

        {/* Questions start */}
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
              className="border-b-0 p-3"
            >
              <ListItemPrefix>
                <BookOpenIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                Questions
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              {listQuestions.map(({ label, icon, href }, key) => (
                <ListItem
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
        {/* Questions end */}

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
              Message
              <ListItemSuffix>
                <Chip
                  value="14"
                  size="sm"
                  variant="ghost"
                  color="blue-gray"
                  className="rounded-full"
                />
              </ListItemSuffix>
            </ListItem>
            <ListItem onClick={() => navigate("/notification")}>
              <ListItemPrefix>
                <BellIcon className="h-5 w-5" />
              </ListItemPrefix>
              Notification
              <ListItemSuffix>
                <Chip
                  value="7"
                  size="sm"
                  variant="ghost"
                  color="blue-gray"
                  className="rounded-full"
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
              Profile
            </ListItem>
            <ListItem onClick={() => navigate("/settings")}>
              <ListItemPrefix>
                <Cog6ToothIcon className="h-5 w-5" />
              </ListItemPrefix>
              Settings
            </ListItem>
          </>
        )}
        {/* User items start */}
      </List>
    </Card>
  );
};

export default Sidebar;
