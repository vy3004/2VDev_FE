import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import PageDescription from "../../components/common/page-description";
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
        reposts_count: item.reposts_count,
        comments_count: item.comments_count,
        views_count: item.views_count,
        votes_count: item.votes_count,
        reports_count: item.reports_count,
        bookmarks_count: item.bookmarks_count,
        is_voted: item.is_voted,
        is_bookmarked: item.is_bookmarked,
        is_reported: item.is_reported,
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
      <PageDescription
        title={t("post.My Bookmarks")}
        desc={t("post.See information about all marked questions")}
      />
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
