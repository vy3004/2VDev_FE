import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

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

const Home = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const typeQueryParam = queryParams.get("type");

  const [type, setType] = useState(typeQueryParam ? typeQueryParam : "new");
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const getNewsFeed = async () => {
    const { response } = await postService.getNewsFeed({
      limit: 10,
      page: page,
      type: type,
    });

    if (response) {
      const newData = response.data.result.posts;
      setPosts((prevData) => [...prevData, ...newData]);
      setHasMore(newData.length > 0);
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    getNewsFeed();
    queryParams.set("type", type.toString());
    window.history.replaceState(
      {},
      "",
      `${location.pathname}?${queryParams.toString()}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const handleChangeType = (type: string) => {
    setType(type);
    setPage(1);
    setPosts([]);
  };

  return (
    <div>
      {/* Header start */}
      <div className="flex items-end justify-between">
        <div>
          <Typography variant="h5">New Posts</Typography>
          <Typography className="mt-1 font-normal">
            See information about all new posts
          </Typography>
        </div>

        <Menu placement="bottom-end">
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
                onClick={() => handleChangeType(type)}
              >
                {type}
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
          {posts.map((post) => (
            <PostCard key={post._id} post={post} is_detail={false} />
          ))}
        </div>
      </InfiniteScroll>
      {/* List posts end */}
    </div>
  );
};

export default Home;
