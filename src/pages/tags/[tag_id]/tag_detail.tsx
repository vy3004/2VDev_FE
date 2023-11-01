import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import { Typography } from "@material-tailwind/react";
import Loading from "../../../components/common/loading";
import PostCard from "../../../components/post/post-card";
import NotFoundAlert from "../../../components/common/not-found-alert";

import postService from "../../../services/post-service";
import { Post } from "../../../utils/types";

const TagDetail = () => {
  const { tag_id } = useParams();

  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [tagName, setTagName] = useState("");
  const [postsCount, setPostsCount] = useState(0);

  const getPosts = async () => {
    console.log("getPosts");
    if (tag_id) {
      const { response } = await postService.getPostsByHashtag({
        hashtag_id: tag_id,
        limit: 10,
        page: page,
        sort_field: "created_at",
        sort_value: -1,
      });

      if (response) {
        const newData = response.data.result.posts;
        if (newData.length > 0) {
          setPosts((prevData) => [...prevData, ...newData]);
          setPage((prevPage) => prevPage + 1);
        }
        setHasMore(newData.length > 0);
        setTagName(response.data.result.hashtag_name);
        setPostsCount(response.data.result.posts_count);
      }
    }
  };

  useEffect(() => {
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tag_id]);

  return (
    <div>
      {/* Header start */}
      <div className="flex items-end justify-between">
        <div>
          <Typography variant="h5">Tag {tagName}</Typography>
          <Typography className="mt-1 font-normal">
            There are a total of {postsCount} posts tagged with {tagName}
          </Typography>
        </div>
      </div>
      {/* Header end */}

      {/* List posts start */}
      <InfiniteScroll
        dataLength={posts.length}
        next={getPosts}
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

export default TagDetail;
