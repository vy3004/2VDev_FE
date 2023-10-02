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
import Pagination from "../../components/common/pagination";
import PostCard from "../../components/post/post-card";

import postService from "../../services/post-service";
import { Post } from "../../utils/types";
import { POSTS_TYPE } from "../../utils/constant";

const Home = () => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const typeQueryParam = queryParams.get("type");
  const limitQueryParam = queryParams.get("limit");
  const pageQueryParam = queryParams.get("page");
  const limit = limitQueryParam ? parseInt(limitQueryParam) : 10;
  const [page, setPage] = useState(
    pageQueryParam ? parseInt(pageQueryParam) : 1
  );
  const [type, setType] = useState(typeQueryParam ? typeQueryParam : "new");
  const [posts, setPosts] = useState<Post[]>();
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
    const getNewsFeed = async () => {
      setIsLoading(true);

      const { response } = await postService.getNewsFeed({
        limit: limit,
        page: page,
        type: type,
      });

      if (response) {
        console.log(response);
        setTotalPage(response?.data.result.total_page);
        setPosts(response?.data.result.posts);
      }

      setIsLoading(false);
    };

    getNewsFeed();

    // Update URL according to params
    queryParams.set("type", type);
    queryParams.set("limit", limit.toString());
    queryParams.set("page", page.toString());
    window.history.replaceState(
      {},
      "",
      `${location.pathname}?${queryParams.toString()}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, page, type]);

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
            {POSTS_TYPE.map((type) => (
              <MenuItem className="capitalize" onClick={() => setType(type)}>
                {type}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </div>
      {/* Header end */}

      <div className="mt-4 space-y-8">
        {isLoading ? (
          <div className="relative h-80">
            <Loading />
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} is_detail={false} />
            ))}
          </div>
        ) : (
          <NotFoundAlert message="Posts not found!" />
        )}
        <Pagination page={page} totalPage={totalPage} next={next} prev={prev} />
      </div>
    </div>
  );
};

export default Home;
