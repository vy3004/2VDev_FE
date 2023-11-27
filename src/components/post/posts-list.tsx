import InfiniteScroll from "react-infinite-scroll-component";
import { useTranslation } from "react-i18next";

import Loading from "../common/loading";
import NotFoundAlert from "../common/not-found-alert";
import PostCard from "./post-card";
import CommentCard from "./comment-card";

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
    <PostCard key={post._id + index} post={post} isDetail={false} />
  ),
  [PostType.RePost]: (post: Post, index: number) => (
    <PostCard key={post._id + index} post={post} isDetail={false} />
  ),
  [PostType.Comment]: (post: Post, index: number) => (
    <CommentCard key={post._id + index} comment={post} />
  ),
};

const typeMap = {
  [PostType.Post]: "questions",
  [PostType.RePost]: "reposts",
  [PostType.Comment]: "answers",
};

const PostsList: React.FC<PostsListProps> = ({
  posts,
  postType,
  getPosts,
  hasMore,
}) => {
  const { t } = useTranslation();

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
          message={t(`user.No more ${typeMap[postType]} to load`)}
          type="success"
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
