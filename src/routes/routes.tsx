import { ReactElement } from "react";

import ProtectedPage from "../components/common/protected-page";

import Home from "../pages/home/home";
import About from "../pages/about/about";
import Contact from "../pages/contact/contact";
import Feed from "../pages/feed/feed";
import Tags from "../pages/tags/tags";
import Communities from "../pages/communities/communities";
import Users from "../pages/users/users";
import Settings from "../pages/settings/settings";
import Message from "../pages/message/message";
import Notification from "../pages/notification/notification";
import Profile from "../pages/profile/profile";
import NotFoundPage from "../pages/not-found-page/not-found-page";

interface Route {
  path: string;
  element: ReactElement;
  state?: string;
}

const routes: Route[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/feed",
    element: <Feed />,
  },
  {
    path: "/tags",
    element: <Tags />,
  },
  {
    path: "/communities",
    element: <Communities />,
  },
  {
    path: "/users",
    element: <Users />,
  },
  {
    path: "/message",
    element: (
      <ProtectedPage>
        <Message />
      </ProtectedPage>
    ),
    state: "message",
  },
  {
    path: "/notification",
    element: (
      <ProtectedPage>
        <Notification />
      </ProtectedPage>
    ),
  },
  {
    path: "/profile/:username",
    element: (
      <ProtectedPage>
        <Profile />
      </ProtectedPage>
    ),
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export default routes;
