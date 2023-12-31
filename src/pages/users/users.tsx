import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { debounce } from "lodash";
import { useTranslation } from "react-i18next";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Input } from "@material-tailwind/react";
import Loading from "../../components/common/loading";
import Pagination from "../../components/common/pagination";
import NotFoundAlert from "../../components/common/not-found-alert";
import MenuFilter from "../../components/common/menu-filter";
import PageDescription from "../../components/common/page-description";
import UserCard from "./components/user-card";

import userService from "../../services/user-service";
import searchService from "../../services/search-service";

import { selectUser } from "../../redux/features/user-slice";
import { selectApp } from "../../redux/features/app-state-slice";

import { USERS_HEADER_PAGE, USERS_TYPE } from "../../utils/constant";
import { UserCardType } from "../../utils/types";

const Users = () => {
  const { t } = useTranslation();
  const currentUser = useSelector(selectUser).user;
  const { themeMode } = useSelector(selectApp);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const idQueryParam = queryParams.get("id");
  const filterQueryParam = queryParams.get("filter");
  const pageQueryParam = queryParams.get("page");
  const limitQueryParam = queryParams.get("limit");
  const [filter, setFilter] = useState(filterQueryParam || "new");
  const [page, setPage] = useState(
    pageQueryParam ? parseInt(pageQueryParam) : 1
  );
  const limit = limitQueryParam ? parseInt(limitQueryParam) : 6;
  const [users, setUsers] = useState<UserCardType[]>([]);
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
      const userData = response.data.result.list_users.map(
        (item: UserCardType) => ({
          _id: item._id,
          name: item.name,
          username: item.username,
          avatar: item.avatar,
          point: item.point,
          is_followed: item.is_followed,
          followers: item.followers,
          following: item.following,
        })
      );
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

  const getUsers = async (sort_field: string) => {
    setIsLoading(true);

    const { response } = await userService.getUsers({
      limit: limit,
      page: page,
      sort_field: sort_field,
      sort_value: -1,
    });

    if (response) {
      setTotalPage(response.data.result.totalPage);
      const userData = response.data.result.list_users.map(
        (item: UserCardType) => ({
          _id: item._id,
          name: item.name,
          username: item.username,
          avatar: item.avatar,
          point: item.point,
          is_followed: item.is_followed,
          followers: item.followers,
          following: item.following,
        })
      );
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
        user_id: idQueryParam || currentUser._id,
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
        user_id: idQueryParam || currentUser._id,
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
    if (filter === "new" && searchValue === "") getUsers("created_at");
    if (filter === "point" && searchValue === "") getUsers("point");
    if (filter === "followers" && searchValue === "") getUsers("followers");
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
                <PageDescription
                  key={item.type}
                  title={t(`user.${item.title}`)}
                  desc={t(`user.${item.desc}`)}
                />
              )
          )}

          <div className="flex items-center gap-4">
            <Input
              label={t("search.Find users")}
              name="search"
              type="text"
              className="dark:text-gray-300"
              color={themeMode ? "white" : "black"}
              crossOrigin={""}
              value={searchValue}
              onChange={handleChange}
              icon={
                <MagnifyingGlassIcon className="h-5 w-5 dark:text-gray-300" />
              }
            />

            <MenuFilter
              content={USERS_TYPE}
              selected={filter}
              handleChange={setFilter}
            />
          </div>
        </div>
        {/* Header end */}

        {isLoading ? (
          <div className="relative h-80">
            <Loading />
          </div>
        ) : currentUser && users && users.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-6 gap-6 mt-4">
              {users.map((user) => (
                <UserCard
                  key={user._id}
                  currentUser={currentUser}
                  userDetail={user}
                />
              ))}
            </div>

            <Pagination
              page={page}
              totalPage={totalPage}
              next={next}
              prev={prev}
            />
          </div>
        ) : (
          <NotFoundAlert message={t("user.Users not found")} type="error" />
        )}
      </div>
    </div>
  );
};

export default Users;
