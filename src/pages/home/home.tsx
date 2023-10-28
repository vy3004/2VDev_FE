/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import Loading from "../../components/common/loading";
import NotFoundAlert from "../../components/common/not-found-alert";
import PostCard from "../../components/post/post-card";
import InfiniteScroll from "react-infinite-scroll-component";

import postService from "../../services/post-service";
import { Post } from "../../utils/types";
import { POSTS_TYPE } from "../../utils/constant";
import { getSortPostsLabel, getTypePostsLabel } from "../../utils/string-utils";

const Home = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const typeQueryParam = queryParams.get("type");
  const sortQueryParam = queryParams.get("sort_field");

  const [type, setType] = useState(typeQueryParam || "new");
  const [sortField, setSortField] = useState(sortQueryParam || "created_at");
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const getNewsFeed = async () => {
    const { response } = await postService.getNewsFeed({
      limit: 10,
      page: page,
      type: type,
      sort_field: sortField,
      sort_value: -1,
    });

    if (response) {
      const newData = response.data.result.posts;
      if (newData.length > 0) {
        setPosts((prevData) => [...prevData, ...newData]);
        setPage((prevPage) => prevPage + 1);
      }
      setHasMore(newData.length > 0);
    }
  };

  useEffect(() => {
    const newType = queryParams.get("type");
    const newSort = queryParams.get("sort_field");
    if (newType !== null && newSort !== null) {
      if (newType !== type || newSort !== sortField) {
        setPage(1);
        setPosts([]);
        setType(newType);
        setSortField(newSort);
      }
    }
  }, [window.location.search]);

  useEffect(() => {
    getNewsFeed();
  }, [type, sortField]);

  const handleChangeType = (typePost: string) => {
    if (typePost !== type) {
      queryParams.set("type", typePost.toString());
      window.history.replaceState(
        {},
        "",
        `${location.pathname}?${queryParams.toString()}`
      );
      window.dispatchEvent(new Event("popstate"));
    }
  };

  return (
    <div>
      {/* Header start */}
      <div className="flex items-end justify-between">
        <div>
          <Typography variant="h5">
            {t(`home.${getSortPostsLabel(sortField)} posts`)}
          </Typography>
          <Typography className="mt-1 font-normal">
            {t(
              `home.see information about ${getTypePostsLabel(
                type
              )} ${getSortPostsLabel(sortField)} posts`
            )}
          </Typography>
        </div>

        <Menu
          placement="bottom-end"
          allowHover
          animate={{
            mount: { y: 0 },
            unmount: { y: 25 },
          }}
        >
          <MenuHandler>
            <IconButton className="mr-5 mb-1" size="sm" variant="outlined">
              <AdjustmentsHorizontalIcon className="w-6 h-6 transition-transform hover:rotate-180" />
            </IconButton>
          </MenuHandler>
          <MenuList className="min-w-10">
            {POSTS_TYPE.map((type, key) => (
              <MenuItem
                key={key}
                className="capitalize"
                onClick={() => handleChangeType(type.value)}
              >
                {t(`home.${type.label}`)}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </div>
      {/* Header end */}

      {/* List posts start */}
      <InfiniteScroll
        dataLength={posts.length}
        next={getNewsFeed}
        hasMore={hasMore}
        loader={
          <div className="relative h-80">
            <Loading />
          </div>
        }
        endMessage={
          <NotFoundAlert message="No more posts to load!" isBack={false} />
        }
      >
        <div className="py-4 space-y-4">
          {posts.map((post, index) => (
            <PostCard key={post._id + index} post={post} is_detail={false} />
          ))}
        </div>
      </InfiniteScroll>
      {/* List posts end */}
    </div>
  );
};

export default Home;
