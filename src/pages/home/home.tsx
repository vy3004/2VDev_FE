import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Loading from "../../components/common/loading";
import NotFoundAlert from "../../components/common/not-found-alert";
import Pagination from "../../components/common/pagination";
import PostCard from "../../components/post/post-card";

import postService from "../../services/post-service";
import { Post } from "../../utils/types";

const Home = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageQueryParam = queryParams.get("page");
  const limitQueryParam = queryParams.get("limit");
  const limit = limitQueryParam ? parseInt(limitQueryParam) : 10;
  const [page, setPage] = useState(
    pageQueryParam ? parseInt(pageQueryParam) : 1
  );
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

      const { response } = await postService.getNewsFeedNew({
        limit: limit,
        page: page,
        post_type: 0,
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
        {isLoading ? (
          <div className="relative h-80">
            <Loading />
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="">
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
