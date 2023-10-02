import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import {
  Typography,
  Menu,
  MenuHandler,
  IconButton,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import Loading from "../../components/common/loading";
import Pagination from "../../components/common/pagination";
import NotFoundAlert from "../../components/common/not-found-alert";
import UserCard from "./components/user-card";

import userService from "../../services/user-service";
import { selectUser } from "../../redux/features/user-slice";
import { USERS_TYPE } from "../../utils/constant";

const Users = () => {
  const currentUser = useSelector(selectUser).user;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageQueryParam = queryParams.get("page");
  const limitQueryParam = queryParams.get("limit");
  const limit = limitQueryParam ? parseInt(limitQueryParam) : 6;
  const [page, setPage] = useState(
    pageQueryParam ? parseInt(pageQueryParam) : 1
  );
  const [users, setUsers] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  const next = () => {
    if (page === totalPage) return;

    setPage(page + 1);
  };

  const prev = () => {
    if (page === 1) return;

    setPage(page - 1);
  };

  const getUsers = async () => {
    setIsLoading(true);

    const { response } = await userService.getUsers({
      limit: limit,
      page: page,
    });

    if (response) {
      setTotalPage(response.data.result.totalPage);
      setUsers(response.data.result.list_users);
    }

    setIsLoading(false);
  };

  const getFollowing = async () => {
    setIsLoading(true);

    const { response } = await userService.getFollowing({
      limit: limit,
      page: page,
      user_id: "64ee2bd93ae02e4ab84fb7d6",
    });

    if (response) {
      setTotalPage(response.data.result.totalPage);
      setUsers(response.data.result);
      console.log("Following", response);
    }

    setIsLoading(false);
  };

  const getFollower = async () => {
    setIsLoading(true);

    const { response } = await userService.getFollowing({
      limit: limit,
      page: page,
      user_id: "64ee2bd93ae02e4ab84fb7d6",
    });

    if (response) {
      setTotalPage(response.data.result.totalPage);
      setUsers(response.data.result);
      console.log("Follower", response);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (filter === "all") {
      getUsers();
    } else if (filter === "following") {
      getFollowing();
    } else {
      getFollower();
    }

    // Update URL according to params
    queryParams.set("limit", limit.toString());
    queryParams.set("page", page.toString());
    window.history.replaceState(
      {},
      "",
      `${location.pathname}?${queryParams.toString()}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, filter]);

  return (
    <div>
      <div className="mt-4 space-y-8">
        {isLoading ? (
          <div className="relative h-80">
            <Loading />
          </div>
        ) : users.length > 0 ? (
          <div>
            {/* Header start */}
            <div className="flex items-end justify-between">
              <div>
                <Typography variant="h5">All Users</Typography>
                <Typography className="mt-1 font-normal">
                  See information about all all users
                </Typography>
              </div>

              <Menu placement="bottom-end">
                <MenuHandler>
                  <IconButton
                    className="mr-5 mb-1"
                    size="sm"
                    variant="outlined"
                  >
                    <AdjustmentsHorizontalIcon className="w-6 h-6 transition-transform hover:rotate-180" />
                  </IconButton>
                </MenuHandler>
                <MenuList className="min-w-10">
                  {USERS_TYPE.map((type) => (
                    <MenuItem
                      className="capitalize"
                      onClick={() => setFilter(type)}
                    >
                      {type}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </div>
            {/* Header end */}
            <div className="grid grid-cols-6 gap-6 mt-4">
              {users.map(
                ({ _id, name, avatar, username, point, is_followed }) => (
                  <UserCard
                    key={_id}
                    current_username={currentUser?.username}
                    user_id={_id}
                    username={username}
                    name={name}
                    avatar={avatar}
                    point={point}
                    is_followed={is_followed}
                  />
                )
              )}
            </div>
          </div>
        ) : (
          <NotFoundAlert message="Users not found!" />
        )}

        <Pagination page={page} totalPage={totalPage} next={next} prev={prev} />
      </div>
    </div>
  );
};

export default Users;
