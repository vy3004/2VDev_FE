import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Loading from "../../../components/common/loading";
import NotFoundAlert from "../../../components/common/not-found-alert";
import PageDescription from "../../../components/common/page-description";
import PostCard from "../../../components/post/post-card";

import postService from "../../../services/post-service";
import { Post } from "../../../utils/types";
import { POST_TYPE } from "../../../utils/constant";

const PostDetail = () => {
  const { post_id } = useParams();
  const { t } = useTranslation();

  const [post, setPost] = useState<Post>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post_id]);

  const getPost = async () => {
    setLoading(true);

    if (post_id) {
      const { response, error } = await postService.getPost({
        post_id: post_id,
      });

      if (response) setPost(response.data.result);

      if (error) setPost(undefined);
    }

    setLoading(false);
  };

  return loading ? (
    <div className="relative h-96">
      <Loading />
    </div>
  ) : post ? (
    <div className="space-y-4">
      <PageDescription
        title={`${
          post.type === POST_TYPE.Post ? t("post.Question") : t("post.Repost")
        }
          ${t("post.from")} ${post.user_detail.name}`}
        desc={`${t("post.See detailed content of the")} 
        ${
          post.type === POST_TYPE.Post ? t("post.question") : t("post.repost")
        }`}
      />
      <PostCard post={post} isDetail={true} reLoadPost={getPost} />
    </div>
  ) : (
    <NotFoundAlert
      message={t("post.Question not found")}
      type="error"
      isBack={true}
    />
  );
};

export default PostDetail;
