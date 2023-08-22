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
    state: "home",
  },
  {
    path: "/about",
    element: <About />,
    state: "about",
  },
  {
    path: "/contact",
    element: <Contact />,
    state: "contact",
  },
  {
    path: "/feed",
    element: <Feed />,
    state: "feed",
  },
  {
    path: "/tags",
    element: <Tags />,
    state: "tags",
  },
  {
    path: "/communities",
    element: <Communities />,
    state: "communities",
  },
  {
    path: "/users",
    element: <Users />,
    state: "communities",
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
    state: "notification",
  },
  {
    path: "/profile",
    element: (
      <ProtectedPage>
        <Profile />
      </ProtectedPage>
    ),
    state: "profile",
  },
  {
    path: "/settings",
    element: <Settings />,
    state: "settings",
  },
  {
    path: "*",
    element: <NotFoundPage />,
    state: "not-found-page",
  },
];

export default routes;
