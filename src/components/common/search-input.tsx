/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

import {
  Avatar,
  Button,
  Card,
  List,
  ListItem,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import {
  ArrowSmallLeftIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  EyeIcon,
  HandThumbUpIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Divider from "./divider";

import searchService from "../../services/search-service";

import { selectApp, setIsSearch } from "../../redux/features/app-state-slice";

import { Post } from "../../utils/types";

const SearchInput = () => {
  const { isSearch } = useSelector(selectApp);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const searchPost = debounce(async () => {
    const { response } = await searchService.searchPost({
      limit: 10,
      page: 1,
      content: searchValue,
    });

    if (response) {
      setTotalPage(response.data.result.total_page);
      setPage(1);
      setPosts(response.data.result.posts);
    }

    setIsLoading(false);
  }, 500);

  const searchPostLoadMore = async () => {
    setIsLoading(true);

    const { response } = await searchService.searchPost({
      limit: 10,
      page: page,
      content: searchValue,
    });

    if (response) {
      setTotalPage(response.data.result.total_page);

      if (posts) {
        const existingPosts = [...posts];
        const newPosts = response.data.result.posts;
        setPosts([...existingPosts, ...newPosts]);
      } else {
        setPosts(response.data.result.posts);
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (isSearch && searchValue === "") {
      setPosts([]);
      setIsLoading(false);
    }

    if (isSearch && searchValue !== "") searchPost();

    return () => {
      // Cancel any pending debounced function calls
      searchPost.cancel();
    };
  }, [searchValue]);

  useEffect(() => {
    if (isSearch && searchValue !== "" && page > 1) searchPostLoadMore();
  }, [page]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        dispatch(setIsSearch(!isSearch));
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isSearch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    setIsLoading(true);
  };

  const onClick = (post_id: string) => {
    navigate(`/${post_id}`);
    setSearchValue("");
    setPosts([]);
    dispatch(setIsSearch(!isSearch));
  };

  const handleLoadMore = () => {
    if (page < totalPage) {
      setPage(page + 1);
    }
  };

  return (
    <div className={`relative ${isSearch && "w-full"}`}>
      <div className="p-0.5 border-2 border-gray-900 dark:bg-gray-400 dark:text-gray-900 rounded-full flex items-center">
        <Button
          size="sm"
          className="rounded-full normal-case flex items-center gap-2 dark:bg-gray-900 dark:text-gray-400"
          onClick={() => dispatch(setIsSearch(!isSearch))}
        >
          {!isSearch ? (
            <>
              <MagnifyingGlassIcon className="w-4 h-4 sm:w-5 sm:h-5" />{" "}
              {t("search.Search")}{" "}
              <kbd className="border rounded-md px-1.5 py-0.5">
                <span className="">⌘ + </span>K
              </kbd>
            </>
          ) : (
            <ArrowSmallLeftIcon className="h-5 w-5" />
          )}
        </Button>
        {isSearch && (
          <input
            className="bg-transparent w-full font-bold rounded-full px-3 focus:outline-0"
            type="search"
            name="search"
            autoFocus
            value={searchValue}
            onChange={handleChange}
          />
        )}
      </div>

      {isSearch && (
        <Card className="w-full lg:w-[600px] absolute right-0 top-14 pb-2 border dark:bg-gray-900 dark:border-gray-800">
          <div className="px-4 py-2 flex items-center justify-between">
            <Typography className="font-bold text-gray-900 dark:text-gray-400">
              {t("search.Results")} ({posts?.length || 0})
            </Typography>
            {isLoading ? (
              <Spinner className="w-5 h-5" />
            ) : (
              <CheckCircleIcon className="w-5 h-5" />
            )}
          </div>

          <Divider />

          <List className="max-h-96 overflow-hidden overflow-y-auto">
            {posts && posts.length > 0 ? (
              <>
                {posts.map((post) => (
                  <ListItem
                    key={post._id}
                    onClick={() => onClick(post._id)}
                    className="!overflow-visible flex items-center gap-4 text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
                  >
                    <Avatar
                      variant="circular"
                      alt="avatar"
                      src={post.user_detail.avatar}
                    />

                    <div>
                      <Typography className="font-semibold">
                        {post.title}
                      </Typography>

                      <Typography
                        variant="small"
                        className="flex items-center gap-2"
                      >
                        <HandThumbUpIcon className="w-4 h-4" />
                        {post.votes_count}
                        <ChatBubbleLeftRightIcon className="w-4 h-4" />
                        {post.comments_count}
                        <EyeIcon className="w-4 h-4" />
                        {post.views_count}
                      </Typography>
                    </div>
                  </ListItem>
                ))}

                {page < totalPage && (
                  <>
                    <Divider />

                    <Button
                      className="!overflow-visible normal-case flex items-center justify-center gap-1 dark:text-gray-400"
                      size="sm"
                      variant="text"
                      onClick={handleLoadMore}
                    >
                      <PlusCircleIcon className="w-5 h-5" />
                      {t("search.Load more")}
                    </Button>
                  </>
                )}
              </>
            ) : (
              <ListItem disabled className="text-gray-900 dark:text-gray-400">
                {t("search.Not found")}
              </ListItem>
            )}
          </List>
        </Card>
      )}
    </div>
  );
};

export default SearchInput;
