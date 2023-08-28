import { useState, useEffect } from "react";
import {
  Avatar,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

import userService from "../../services/user-service";

const Users = () => {
  const [users, setUsers] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

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
      const { response } = await userService.getUsers({
        limit: 6,
        page: page,
      });

      if (response) {
        setTotalPage(response?.data.result.totalPage);
        setUsers(response?.data.result.list_users);
      }
    };

    getUsers();
  }, [page]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-6 gap-6">
        {users &&
          users.map(({ name, avatar, username }, key) => (
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
                <Typography className="w-fit border border-black rounded-full px-2 py-1 font-semibold text-xs">
                  Beginner
                </Typography>
              </a>
              <Button>Follow</Button>
            </div>
          ))}
      </div>

      <div className="flex items-center justify-end gap-8">
        <IconButton
          size="sm"
          variant="outlined"
          onClick={prev}
          disabled={page === 1}
        >
          <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
        </IconButton>
        <Typography color="gray" className="font-normal">
          Page <strong className="text-gray-900">{page}</strong> of{" "}
          <strong className="text-gray-900">{totalPage}</strong>
        </Typography>
        <IconButton
          size="sm"
          variant="outlined"
          onClick={next}
          disabled={page === totalPage}
        >
          <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
        </IconButton>
      </div>
    </div>
  );
};

export default Users;
