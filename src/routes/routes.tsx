import { ReactElement } from "react";

import ProtectedPage from "../components/common/protected-page";
import AdminPage from "../components/common/admin-page";

import Home from "../pages/home/home";
import About from "../pages/about/about";
import Contact from "../pages/contact/contact";
import Tags from "../pages/tags/tags";
import Communities from "../pages/communities/communities";
import Users from "../pages/users/users";
import Settings from "../pages/settings/settings";
import Message from "../pages/message/message";
import Notification from "../pages/notification/notification";
import Profile from "../pages/profile/profile";
import NotFoundPage from "../pages/not-found-page/not-found-page";
import ManageUsers from "../pages/dashboard/manage-users/manage-users";
import ManagePosts from "../pages/dashboard/manage-posts/manage-posts";
import UserDetailPage from "../pages/dashboard/manage-users/[username]/user-detail-page";
import PostForm from "../components/post/post-form";
import PostDetail from "../pages/home/[post_id]/post-detail";

interface Route {
  path: string;
  element: ReactElement;
}

const routes: Route[] = [
  {
    path: "/",
    element: (
      <ProtectedPage>
        <Home />
      </ProtectedPage>
    ),
  },
  {
    path: "/post",
    element: (
      <ProtectedPage>
        <PostForm />
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
    path: "/tags",
    element: <Tags />,
  },
  {
    path: "/communities",
    element: <Communities />,
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
