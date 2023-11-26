import { ReactElement } from "react";

import ProtectedPage from "../components/common/protected-page";
import AdminPage from "../components/common/admin-page";

import Home from "../pages/home/home";
import About from "../pages/about/about";
import Contact from "../pages/contact/contact";
import PostPage from "../pages/home/post/post";
import PostDetail from "../pages/home/[post_id]/post-detail";
import ManagePosts from "../pages/dashboard/manage-posts/manage-posts";
import Users from "../pages/users/users";
import ManageUsers from "../pages/dashboard/manage-users/manage-users";
import UserDetailPage from "../pages/dashboard/manage-users/[username]/user-detail-page";
import Overview from "../pages/dashboard/overview/overview";
import Profile from "../pages/profile/profile";
import Tags from "../pages/tags/tags";
import TagDetail from "../pages/tags/[tag_id]/tag_detail";
import Bookmarks from "../pages/bookmark/bookmarks";
import Message from "../pages/message/message";
import Notification from "../pages/notification/notification";
import Settings from "../pages/settings/settings";
import NotFoundPage from "../pages/not-found-page/not-found-page";

interface Route {
  path: string;
  element: ReactElement;
}

const routes: Route[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/post",
    element: (
      <ProtectedPage>
        <PostPage />
      </ProtectedPage>
    ),
  },
  {
    path: "/:post_id",
    element: (
      <ProtectedPage>
        <PostDetail />
      </ProtectedPage>
    ),
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
    path: "/dashboard/manage-users",
    element: (
      <AdminPage>
        <ManageUsers />
      </AdminPage>
    ),
  },
  {
    path: "/dashboard/manage-users/:username",
    element: (
      <AdminPage>
        <UserDetailPage />
      </AdminPage>
    ),
  },
  {
    path: "/dashboard/manage-posts",
    element: (
      <AdminPage>
        <ManagePosts />
      </AdminPage>
    ),
  },
  {
    path: "/dashboard/overview",
    element: (
      <AdminPage>
        <Overview />
      </AdminPage>
    ),
  },
  {
    path: "/tags",
    element: <Tags />,
  },
  {
    path: "/tags/:tag_id",
    element: (
      <ProtectedPage>
        <TagDetail />
      </ProtectedPage>
    ),
  },
  {
    path: "/bookmarks",
    element: (
      <ProtectedPage>
        <Bookmarks />
      </ProtectedPage>
    ),
  },
  {
    path: "/users",
    element: (
      <ProtectedPage>
        <Users />
      </ProtectedPage>
    ),
  },
  {
    path: "/message",
    element: (
      <ProtectedPage>
        <Message />
      </ProtectedPage>
    ),
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
