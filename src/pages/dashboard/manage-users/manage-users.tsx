import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { debounce } from "lodash";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  NoSymbolIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
import {
  Input,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";

import Loading from "../../../components/common/loading";
import LevelChip from "../../../components/common/level-chip";
import Pagination from "../../../components/common/pagination";
import MenuFilter from "../../../components/common/menu-filter";
import PageDescription from "../../../components/common/page-description";

import userService from "../../../services/user-service";
import searchService from "../../../services/search-service";

import { selectApp } from "../../../redux/features/app-state-slice";

import { USER_VERIFY } from "../../../utils/constant";

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
  const { themeMode } = useSelector(selectApp);
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
    <>
      <div className="rounded-none space-y-4 dark:bg-gray-900">
        {/* Title start */}
        <PageDescription
          title={t("user.Manage Users")}
          desc={t("user.See information about all users")}
        />
        {/* Title end */}

        <div className="flex items-center justify-end gap-4">
          <Input
            label={t("search.Find users")}
            crossOrigin={""}
            name="search"
            value={searchValue}
            onChange={handleChange}
            icon={
              <MagnifyingGlassIcon className="h-5 w-5 dark:text-gray-300" />
            }
            className="dark:text-gray-300"
            color={themeMode ? "white" : "black"}
          />
          <MenuFilter
            content={MENU}
            selected={filter}
            handleChange={setFilter}
          />
        </div>
      </div>
      {isLoading ? (
        <div className="relative h-[460px]">
          <Loading />
        </div>
      ) : (
        <div className="overflow-hidden overflow-x-auto border p-2 rounded-md shadow-md dark:bg-gray-800 dark:border-gray-800">
          {/* Table start */}
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={head}
                    className="cursor-pointer bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 dark:hover:bg-gray-900 dark:bg-gray-900/50 dark:text-gray-300"
                  >
                    <Typography className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                      {head}
                      {index !== TABLE_HEAD.length - 1 && (
                        <ChevronUpDownIcon
                          strokeWidth={2}
                          className="h-4 w-4"
                        />
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
                      : "p-4 border-b border-blue-gray-50 dark:border-gray-900";

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
                              size="sm"
                              value={
                                verify === USER_VERIFY.Banned ? (
                                  <NoSymbolIcon className="w-6 h-6" />
                                ) : verify === USER_VERIFY.Verified ? (
                                  <CheckCircleIcon className="w-6 h-6" />
                                ) : (
                                  <XCircleIcon className="w-6 h-6 " />
                                )
                              }
                              color={
                                verify === USER_VERIFY.Banned
                                  ? "red"
                                  : verify === USER_VERIFY.Verified
                                  ? "green"
                                  : "yellow"
                              }
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
        </div>
      )}

      {page > 0 && totalPage > 0 && (
        <Pagination page={page} totalPage={totalPage} next={next} prev={prev} />
      )}
    </>
  );
};

export default ManageUsers;
