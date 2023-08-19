import { useState } from "react";
import { useSelector } from "react-redux";

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

import { selectUser } from "../redux/features/user-slice";

const Sidebar = () => {
  const { user } = useSelector(selectUser);

  const [open, setOpen] = useState(0);

  const handleOpen = (value: number) => {
    setOpen(open === value ? 0 : value);
  };

  return (
    <Card className="shadow-none h-full overflow-hidden hover:overflow-y-scroll">
      <List className="min-w-full my-4">
        <ListItem onClick={() => {}}>
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
                <ListItem>
                  <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Overview
                </ListItem>
                <ListItem>
                  <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Manage users
                </ListItem>
                <ListItem>
                  <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Manage posts
                </ListItem>
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
              <ListItem>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                New questions
              </ListItem>
              <ListItem>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Trending questions
              </ListItem>
              <ListItem>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Popular questions
              </ListItem>
              <ListItem>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Hot questions
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>
        {/* Questions end */}

        <ListItem>
          <ListItemPrefix>
            <NewspaperIcon className="h-5 w-5" />
          </ListItemPrefix>
          Feed
        </ListItem>
        <ListItem>
          <ListItemPrefix>
            <TagIcon className="h-5 w-5" />
          </ListItemPrefix>
          Tags
        </ListItem>
        <ListItem>
          <ListItemPrefix>
            <IdentificationIcon className="h-5 w-5" />
          </ListItemPrefix>
          Communities
        </ListItem>
        <ListItem>
          <ListItemPrefix>
            <UserGroupIcon className="h-5 w-5" />
          </ListItemPrefix>
          Users
        </ListItem>

        {/* User items start */}
        {user && (
          <>
            <hr className="my-2 border-blue-gray-50" />

            <ListItem>
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
            <ListItem>
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
            <ListItem>
              <ListItemPrefix>
                <UserCircleIcon className="h-5 w-5" />
              </ListItemPrefix>
              Profile
            </ListItem>
            <ListItem>
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
