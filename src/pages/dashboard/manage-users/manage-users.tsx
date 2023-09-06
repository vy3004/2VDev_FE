import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  PencilIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
  Select,
  Option,
} from "@material-tailwind/react";

import Loading from "../../../components/common/loading";

import userService from "../../../services/user-service";

const SELECT = [
  {
    label: "All",
    value: "all",
  },
];

const TABLE_HEAD = ["User", "Level", "Verify", "Date added", ""];

const ManageUsers = () => {
  const navigate = useNavigate();

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
        limit: 5,
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
    <Card className="h-full w-full dark:bg-gray-700">
      <CardHeader
        floated={false}
        shadow={false}
        className="rounded-none dark:bg-gray-700 dark:text-gray-50"
      >
        {/* Title start */}
        <Typography variant="h5">Manage Users</Typography>
        <Typography className="mt-1 mb-8 font-normal">
          See information about all users
        </Typography>
        {/* Title end */}

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="w-full md:w-72">
            <Select
              label="Select option"
              animate={{
                mount: { y: 0 },
                unmount: { y: 25 },
              }}
            >
              {SELECT.map((item) => (
                <Option key={item.value}>{item.label}</Option>
              ))}
            </Select>
          </div>
          <div className="w-full md:w-72">
            <Input
              className="dark:text-gray-50"
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              crossOrigin={""}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className="relative px-0 overflow-hidden overflow-x-scroll">
        {isLoading && <Loading />}

        {/* Table start */}
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={head}
                  className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                  >
                    {head}{" "}
                    {index !== TABLE_HEAD.length - 1 && (
                      <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                    )}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(
              (
                {
                  username,
                  avatar,
                  name,
                  email,
                  role,
                  level,
                  verify,
                  created_at,
                },
                index
              ) => {
                const isLast = index === users.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50 dark:border-gray-800";

                return (
                  <tr key={username}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Avatar src={avatar} alt={name} size="sm" />
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <Typography
                              variant="small"
                              className="font-normal dark:text-gray-50"
                            >
                              {name}
                            </Typography>
                            {role ? (
                              <Chip
                                className="rounded-full normal-case"
                                variant="gradient"
                                size="sm"
                                value="Admin"
                                color="red"
                              />
                            ) : (
                              <></>
                            )}
                          </div>

                          <Typography
                            variant="small"
                            className="font-normal opacity-70 text-gray-50"
                          >
                            {email}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={
                            level === 0
                              ? "Bronze"
                              : level === 1
                              ? "Silver"
                              : level === 2
                              ? "Gold"
                              : level === 3
                              ? "Platinum"
                              : "Diamond"
                          }
                          color={
                            level === 0
                              ? "brown"
                              : level === 1
                              ? "gray"
                              : level === 2
                              ? "yellow"
                              : level === 3
                              ? "cyan"
                              : "blue"
                          }
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          className="rounded-full p-0"
                          variant="ghost"
                          size="sm"
                          value={
                            verify ? (
                              <CheckCircleIcon className="w-6 h-6" />
                            ) : (
                              <XCircleIcon className="w-6 h-6 " />
                            )
                          }
                          color={verify ? "green" : "yellow"}
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal dark:text-gray-50"
                      >
                        {format(new Date(created_at), "dd/MM/yyyy")}
                      </Typography>
                    </td>
                    <td className={classes}>
                      {!role && (
                        <Tooltip content="Edit User">
                          <IconButton
                            className="dark:text-gray-50"
                            onClick={() =>
                              navigate(
                                `${window.location.pathname}/${username}`
                              )
                            }
                            variant="text"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
        {/* Table end */}
      </CardBody>
      <CardFooter className="flex items-center justify-end gap-4 border-t border-blue-gray-50 p-4">
        <IconButton
          className="dark:text-gray-50 dark:border-gray-50 dark:bg-gray-900"
          size="sm"
          variant="outlined"
          onClick={prev}
          disabled={page === 1}
        >
          <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
        </IconButton>
        <Typography className="font-normal dark:text-gray-50">
          Page <strong>{page}</strong> of <strong>{totalPage}</strong>
        </Typography>
        <IconButton
          className="dark:text-gray-50 dark:border-gray-50 dark:bg-gray-900"
          size="sm"
          variant="outlined"
          onClick={next}
          disabled={page === totalPage}
        >
          <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
        </IconButton>
      </CardFooter>
    </Card>
  );
};

export default ManageUsers;
