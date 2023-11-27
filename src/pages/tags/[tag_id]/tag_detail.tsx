import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import PageDescription from "../../../components/common/page-description";
import PostsList from "../../../components/post/posts-list";

import postService from "../../../services/post-service";

import { Post } from "../../../utils/types";
import { POST_TYPE } from "../../../utils/constant";

const TagDetail = () => {
  const { tag_id } = useParams();
  const { t } = useTranslation();

  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [tagName, setTagName] = useState("");
  const [postsCount, setPostsCount] = useState(0);

  const getPosts = async (currentPosts: Post[], currentPage: number) => {
    if (tag_id) {
      const { response } = await postService.getPostsByHashtag({
        hashtag_id: tag_id,
        limit: 10,
        page: currentPage,
        sort_field: "created_at",
        sort_value: -1,
      });

      if (response) {
        const newData = response.data.result.posts;
        if (newData.length > 0) {
          setPosts([...currentPosts, ...newData]);
          setPage(currentPage + 1);
          setTagName(response.data.result.hashtag_name);
          setPostsCount(response.data.result.posts_count);
        }
        setHasMore(newData.length > 0);
      }
    }
  };

  useEffect(() => {
    getPosts([], 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tag_id]);

  return (
    <div>
      {/* Header start */}
      <PageDescription
        title={
          <>
            {t("post.Tag")} <span className="text-blue-500">{tagName}</span>
          </>
        }
        desc={
          <>
            {t("post.There are a total of")} {postsCount}{" "}
            {t("post.questions tagged with")}{" "}
            <span className="text-blue-500">{tagName}</span>
          </>
        }
      />
      {/* Header end */}

      {/* List posts start */}
      <PostsList
        posts={posts}
        postType={POST_TYPE.Post}
        getPosts={() => getPosts(posts, page)}
        hasMore={hasMore}
      />
      {/* List posts end */}
    </div>
  );
};

export default TagDetail;
