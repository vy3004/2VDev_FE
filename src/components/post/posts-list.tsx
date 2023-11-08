import InfiniteScroll from "react-infinite-scroll-component";

import Loading from "../common/loading";
import NotFoundAlert from "../common/not-found-alert";
import PostCard from "./post-card";
import CommentCard from "./comment-card";
import RepostCard from "./repost-card";

import { Post } from "../../utils/types";
import { PostType } from "../../utils/constant";

interface PostsListProps {
  posts: Post[];
  postType: PostType;
  getPosts: () => void;
  hasMore: boolean;
}

const postCardMap = {
  [PostType.Post]: (post: Post, index: number) => (
    <PostCard key={post._id + index} post={post} is_detail={false} />
  ),
  [PostType.RePost]: (post: Post, index: number) => (
    <RepostCard key={post._id + index} repost={post} />
  ),
  [PostType.Comment]: (post: Post, index: number) => (
    <CommentCard key={post._id + index} comment={post} />
  ),
};

const typeMap = {
  [PostType.Post]: "posts",
  [PostType.RePost]: "reposts",
  [PostType.Comment]: "comments",
};

const PostsList: React.FC<PostsListProps> = ({
  posts,
  postType,
  getPosts,
  hasMore,
}) => {
  return (
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
        <NotFoundAlert
          message={`No more ${typeMap[postType]} to load!`}
          isBack={false}
        />
      }
    >
      <div className="py-4 space-y-4">
        {posts.map((post, index) => postCardMap[postType](post, index))}
      </div>
    </InfiniteScroll>
  );
};

export default PostsList;
