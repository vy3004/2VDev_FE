import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { debounce } from "lodash";
import { useTranslation } from "react-i18next";

import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import {
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
} from "@material-tailwind/react";
import Loading from "../../../components/common/loading";
import LevelChip from "../../../components/common/level-chip";
import Pagination from "../../../components/common/pagination";
import MenuFilter from "../../../components/common/menu-filter";

import userService from "../../../services/user-service";
import searchService from "../../../services/search-service";

const MENU = [
  {
    label: "new",
    value: "new",
  },
  {
    label: "most points",
    value: "point",
  },
  {
    label: "most followed",
    value: "followers",
  },
];

const ManageUsers = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filterQueryParam = queryParams.get("filter");
  const pageQueryParam = queryParams.get("page");
  const limitQueryParam = queryParams.get("limit");
  const [filter, setFilter] = useState(filterQueryParam || "new");
  const [page, setPage] = useState(
    pageQueryParam ? parseInt(pageQueryParam) : 1
  );
  const limit = limitQueryParam ? parseInt(limitQueryParam) : 5;
  const [users, setUsers] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const TABLE_HEAD = [
    t("user.User"),
    t("user.Level"),
    t("user.Verify"),
    t("user.Date added"),
    "",
  ];

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
      setUsers(response.data.result.list_users);
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
      setUsers(response.data.result.list_users);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (filter === "new" && searchValue === "") getUsers("created_at");
    if (filter === "point" && searchValue === "") getUsers("point");
    if (filter === "followers" && searchValue === "") getUsers("followers");

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
    <Card className="h-full w-full dark:bg-gray-700">
      <CardHeader
        floated={false}
        shadow={false}
        className="rounded-none dark:bg-gray-700 dark:text-gray-50"
      >
        {/* Title start */}
        <Typography variant="h5">{t("user.Manage Users")}</Typography>
        <Typography className="mt-1 mb-8 font-normal">
          {t("user.See information about all users")}
        </Typography>
        {/* Title end */}

        <div className="flex items-center justify-end gap-4">
          <Input
            className="dark:text-gray-50"
            label={t("search.Find users")}
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            crossOrigin={""}
            name="search"
            value={searchValue}
            onChange={handleChange}
          />
          <MenuFilter
            content={MENU}
            selected={filter}
            handleChange={setFilter}
          />
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
                    {head}
                    {index !== TABLE_HEAD.length - 1 && (
                      <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                    )}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map(
                (
                  {
                    username,
                    avatar,
                    name,
                    email,
                    role,
                    point,
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
                              className="font-normal opacity-70 dark:text-gray-50"
                            >
                              {email}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="w-max">
                          <LevelChip level={point} />
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
              )
            ) : (
              <tr>
                <td className="p-4 text-gray-600">
                  {t("search.No result found")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Table end */}
      </CardBody>
      <CardFooter className="border-t border-blue-gray-50 p-4">
        {page > 0 && totalPage > 0 && (
          <Pagination
            page={page}
            totalPage={totalPage}
            next={next}
            prev={prev}
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default ManageUsers;
