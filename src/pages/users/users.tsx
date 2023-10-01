import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { Avatar, Typography, Button } from "@material-tailwind/react";

import Loading from "../../components/common/loading";
import LevelChip from "../../components/common/level-chip";
import Pagination from "../../components/common/pagination";

import userService from "../../services/user-service";
import { selectUser } from "../../redux/features/user-slice";

const Users = () => {
  const currentUser = useSelector(selectUser).user;
  const [users, setUsers] = useState([]);

  const [page, setPage] = useState(1);
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
        limit: 6,
        page: page,
      });

      if (response) {
        setTotalPage(response?.data.result.totalPage);
        setUsers(response?.data.result.list_users);
      }

      setIsLoading(false);
    };

    getUsers();
  }, [page]);

  return (
    <div>
      <div className="mt-4 space-y-8">
        <div className="relative grid grid-cols-6 gap-6">
          {isLoading && <Loading />}

          {users &&
            users.map(({ name, avatar, username, level }, key) => (
              <div
                className="flex flex-col items-center border hover:border-black rounded-lg py-6 space-y-4 col-span-6 sm:col-span-3 lg:col-span-2"
                key={key}
              >
                <a
                  href={`/profile/${username}`}
                  className="flex flex-col items-center space-y-1 text-center hover:opacity-80"
                >
                  <Avatar
                    variant="circular"
                    size="xl"
                    alt="tania andrew"
                    className="border border-gray-900 p-0.5"
                    src={
                      avatar ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYmkp9a2rrD1Sskb9HLt5mDaTt4QaIs8CcBg&usqp=CAU"
                    }
                  />
                  <Typography className="font-bold">{name}</Typography>
                  <LevelChip level={level} />
                </a>
                {currentUser?.username !== username && <Button>Follow</Button>}
              </div>
            ))}
        </div>

        <Pagination page={page} totalPage={totalPage} next={next} prev={prev} />
      </div>
    </div>
  );
};

export default Users;
