/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import PageDescription from "../../components/common/page-description";
import MenuFilter from "../../components/common/menu-filter";
import PostsList from "../../components/post/posts-list";

import postService from "../../services/post-service";

import { selectUser } from "../../redux/features/user-slice";

import { Post } from "../../utils/types";
import { POSTS_SORT, POSTS_TYPE, PostType } from "../../utils/constant";
import { getLabelByValue } from "../../utils/string-utils";

const Home = () => {
  const { t } = useTranslation();
  const { user } = useSelector(selectUser);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const typeQueryParam = queryParams.get("type");
  const sortQueryParam = queryParams.get("sort_field");

  const [type, setType] = useState(typeQueryParam || "all");
  const [sortField, setSortField] = useState(sortQueryParam || "created_at");
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const getPosts = async () => {
    const serviceFunction = user
      ? postService.getNewsFeed
      : postService.getNewsFeedForGuest;

    const { response } = await serviceFunction({
      limit: 10,
      page: page,
      type: type,
      sort_field: sortField,
      sort_value: -1,
    });

    if (response) {
      const newData = response.data.result.posts;
      if (newData.length > 0) {
        setPosts((prevData) => [...prevData, ...newData]);
        setPage((prevPage) => prevPage + 1);
      }
      setHasMore(newData.length > 0);
    }
  };

  useEffect(() => {
    const newType = queryParams.get("type");
    const newSort = queryParams.get("sort_field");
    if (newType !== null && newSort !== null) {
      if (newType !== type || newSort !== sortField) {
        setPage(1);
        setPosts([]);
        setType(newType);
        setSortField(newSort);
      }
    }
  }, [window.location.search]);

  useEffect(() => {
    getPosts();
  }, [type, sortField]);

  const handleChangeType = (typePost: string) => {
    if (typePost !== type) {
      queryParams.set("type", typePost.toString());
      window.history.replaceState(
        {},
        "",
        `${location.pathname}?${queryParams.toString()}`
      );
      window.dispatchEvent(new Event("popstate"));
    }
  };

  return (
    <div>
      {/* Header start */}
      <div className="flex items-end justify-between">
        <PageDescription
          title={t(`home.${getLabelByValue(sortField, POSTS_SORT)} questions`)}
          desc={t(
            `home.see information about ${getLabelByValue(
              type,
              POSTS_TYPE
            )} ${getLabelByValue(sortField, POSTS_SORT)} questions`
          )}
        />

        {user && (
          <MenuFilter
            content={POSTS_TYPE}
            selected={type}
            handleChange={handleChangeType}
          />
        )}
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

export default Home;
