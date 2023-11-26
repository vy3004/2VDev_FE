import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Typography } from "@material-tailwind/react";
import PostsList from "../../components/post/posts-list";

import bookmarkService from "../../services/bookmark-service";
import { Post } from "../../utils/types";
import { PostType } from "../../utils/constant";

const Bookmarks = () => {
  const { t } = useTranslation();

  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const getPosts = async () => {
    const { response } = await bookmarkService.getMyBookmarks({
      limit: 10,
      page: page,
    });

    if (response) {
      const newData = response.data.result.map((item: any) => ({
        ...item.post_detail,
        user_detail: item.user_detail,
        hashtags: item.hashtags,
      }));
      if (newData.length > 0) {
        setPosts([...posts, ...newData]);
        setPage(page + 1);
      }
      setHasMore(newData.length > 0);
    }
  };

  useEffect(() => {
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {/* Header start */}
      <div className="flex items-end justify-between">
        <div>
          <Typography variant="h5">{t("post.My Bookmarks")}</Typography>
          <Typography className="mt-1 font-normal">
            {t("post.See information about all marked questions")}
          </Typography>
        </div>
      </div>
      {/* Header end */}

      {/* List posts start */}
      <PostsList
        posts={posts}
        postType={PostType.Post}
        getPosts={getPosts}
        hasMore={hasMore}
      />
      {/* List posts end */}
    </div>
  );
};

export default Bookmarks;
