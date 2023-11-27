import { useEffect, useState } from "react";

import PostsList from "../../../components/post/posts-list";

import postService from "../../../services/post-service";

import { Post } from "../../../utils/types";
import { POST_TYPE } from "../../../utils/constant";

interface PostsTabProps {
  user_id: string;
  postType: POST_TYPE;
}

const PostsTab: React.FC<PostsTabProps> = ({ user_id, postType }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const getPosts = async (currentPosts: Post[], currentPage: number) => {
    if (user_id) {
      const { response } = await postService.getPostsByUser({
        user_id: user_id,
        limit: 10,
        page: currentPage,
        type: postType,
      });

      if (response) {
        const newData = response.data.result.posts;
        if (newData.length > 0) {
          setPosts([...currentPosts, ...newData]);
          setPage(currentPage + 1);
        }
        setHasMore(newData.length > 0);
      }
    }
  };

  useEffect(() => {
    getPosts([], 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {/* List posts start */}
      <PostsList
        posts={posts}
        postType={postType}
        getPosts={() => getPosts(posts, page)}
        hasMore={hasMore}
      />
      {/* List posts end */}
    </div>
  );
};

export default PostsTab;
