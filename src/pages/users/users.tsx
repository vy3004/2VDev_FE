import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import {
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import {
  Typography,
  Menu,
  MenuHandler,
  IconButton,
  MenuList,
  MenuItem,
  Input,
} from "@material-tailwind/react";
import Loading from "../../components/common/loading";
import Pagination from "../../components/common/pagination";
import NotFoundAlert from "../../components/common/not-found-alert";
import UserCard from "./components/user-card";

import userService from "../../services/user-service";
import { selectUser } from "../../redux/features/user-slice";
import { USERS_HEADER_PAGE, USERS_TYPE } from "../../utils/constant";
import { debounce } from "lodash";
import searchService from "../../services/search-service";

const Users = () => {
  const currentUser = useSelector(selectUser).user;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filterQueryParam = queryParams.get("filter");
  const pageQueryParam = queryParams.get("page");
  const limitQueryParam = queryParams.get("limit");
  const [filter, setFilter] = useState(filterQueryParam || "all");
  const [page, setPage] = useState(
    pageQueryParam ? parseInt(pageQueryParam) : 1
  );
  const limit = limitQueryParam ? parseInt(limitQueryParam) : 6;
  const [users, setUsers] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    setIsLoading(true);
  };

  const searchUsers = debounce(async () => {
    const { response } = await searchService.searchUser({
      limit: 10,
      page: 1,
      content: searchValue,
    });

    if (response) {
      setTotalPage(response.data.result.totalPage);
      setPage(1);
      const userData = response.data.result.list_users.map((item: any) => ({
        _id: item._id,
        name: item.name,
        username: item.username,
        avatar: item.avatar,
        point: item.point,
        is_followed: item.is_followed,
      }));
      setUsers(userData);
    }

    setIsLoading(false);
  }, 500);

  useEffect(() => {
    if (searchValue !== "") searchUsers();

    return () => {
      // Cancel any pending debounced function calls
      searchUsers.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

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
      const userData = response.data.result.list_users.map((item: any) => ({
        _id: item._id,
        name: item.name,
        username: item.username,
        avatar: item.avatar,
        point: item.point,
        is_followed: item.is_followed,
      }));
      setUsers(userData);
    }

    setIsLoading(false);
  };

  const getFollowing = async () => {
    setIsLoading(true);

    if (currentUser) {
      const { response } = await userService.getFollowing({
        limit: limit,
        page: page,
        user_id: currentUser._id,
      });

      if (response) {
        setTotalPage(response.data.totalPage);
        const userData = response.data.result.map((item: any) => ({
          _id: item.user_following_detail._id,
          name: item.user_following_detail.name,
          username: item.user_following_detail.username,
          avatar: item.user_following_detail.avatar,
          point: item.user_following_detail.point,
          is_followed: item.is_followed,
        }));
        setUsers(userData);
      }
    }

    setIsLoading(false);
  };

  const getFollower = async () => {
    setIsLoading(true);

    if (currentUser) {
      const { response } = await userService.getFollower({
        limit: limit,
        page: page,
        user_id: currentUser._id,
      });

      if (response) {
        setTotalPage(response.data.totalPage);
        const userData = response.data.result.map((item: any) => ({
          _id: item.user_follower_detail._id,
          name: item.user_follower_detail.name,
          username: item.user_follower_detail.username,
          avatar: item.user_follower_detail.avatar,
          point: item.user_follower_detail.point,
          is_followed: item.is_followed,
        }));
        setUsers(userData);
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (filter === "all" && searchValue === "") getUsers();

    if (filter === "following" && searchValue === "") getFollowing();

    if (filter === "follower" && searchValue === "") getFollower();

    // Update URL according to params
    queryParams.set("filter", filter.toString());
    queryParams.set("limit", limit.toString());
    queryParams.set("page", page.toString());
    window.history.replaceState(
      {},
      "",
      `${location.pathname}?${queryParams.toString()}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, filter, searchValue]);

  return (
    <div>
      <div className="space-y-4">
        {/* Header start */}
        <div className="sm:flex sm:items-end sm:justify-between space-y-2">
          {USERS_HEADER_PAGE.map(
            (item) =>
              item.type === filter && (
                <div key={item.type}>
                  <Typography variant="h5">{item.title}</Typography>
                  <Typography className="mt-1 font-normal">
                    {item.desc}
                  </Typography>
                </div>
              )
          )}

          <div className="flex items-center gap-4">
            <Input
              label="Find users"
              type="text"
              icon={<MagnifyingGlassIcon />}
              crossOrigin={""}
              name="search"
              value={searchValue}
              onChange={handleChange}
            />

            <Menu
              placement="bottom-end"
              allowHover
              animate={{
                mount: { y: 0 },
                unmount: { y: 25 },
              }}
            >
              <MenuHandler>
                <IconButton className="w-20 h-20" variant="outlined">
                  <AdjustmentsHorizontalIcon className="w-6 h-6 transition-transform hover:rotate-180" />
                </IconButton>
              </MenuHandler>
              <MenuList className="min-w-10">
                {USERS_TYPE.map((type) => (
                  <MenuItem
                    key={type}
                    className="capitalize"
                    onClick={() => setFilter(type)}
                  >
                    {type}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </div>
        </div>
        {/* Header end */}

        {isLoading ? (
          <div className="relative h-80">
            <Loading />
          </div>
        ) : users && users.length > 0 ? (
          <div className="space-y-4">
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

            <Pagination
              page={page}
              totalPage={totalPage}
              next={next}
              prev={prev}
            />
          </div>
        ) : (
          <NotFoundAlert message="Users not found!" isBack={false} />
        )}
      </div>
    </div>
  );
};

export default Users;
