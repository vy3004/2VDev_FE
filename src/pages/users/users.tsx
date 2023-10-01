import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import Loading from "../../components/common/loading";
import Pagination from "../../components/common/pagination";
import UserCard from "./components/user-card";

import userService from "../../services/user-service";
import { selectUser } from "../../redux/features/user-slice";
import NotFoundAlert from "../../components/common/not-found-alert";

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

  const next = () => {
    if (page === totalPage) return;

    setPage(page + 1);
  };

  const prev = () => {
    if (page === 1) return;

    setPage(page - 1);
  };

  useEffect(() => {
    const getUsers = async () => {
      setIsLoading(true);

      const { response } = await userService.getUsers({
        limit: limit,
        page: page,
      });

      if (response) {
        setTotalPage(response?.data.result.totalPage);
        setUsers(response?.data.result.list_users);
      }

      setIsLoading(false);
    };

    getUsers();

    // Update URL according to params
    queryParams.set("limit", limit.toString());
    queryParams.set("page", page.toString());
    window.history.replaceState(
      {},
      "",
      `${location.pathname}?${queryParams.toString()}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  return (
    <div>
      <div className="mt-4 space-y-8">
        <div className="">
          {isLoading ? (
            <div className="relative h-80">
              <Loading />
            </div>
          ) : users.length > 0 ? (
            <div className="grid grid-cols-6 gap-6">
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
          ) : (
            <NotFoundAlert message="Users not found!" />
          )}
        </div>

        <Pagination page={page} totalPage={totalPage} next={next} prev={prev} />
      </div>
    </div>
  );
};

export default Users;
