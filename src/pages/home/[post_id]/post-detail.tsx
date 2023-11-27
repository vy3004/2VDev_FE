import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Loading from "../../../components/common/loading";
import NotFoundAlert from "../../../components/common/not-found-alert";
import PageDescription from "../../../components/common/page-description";
import PostCard from "../../../components/post/post-card";

import postService from "../../../services/post-service";
import { Post } from "../../../utils/types";
import { PostType } from "../../../utils/constant";

const PostDetail = () => {
  const { post_id } = useParams();
  const { t } = useTranslation();

  const [post, setPost] = useState<Post>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getPost = async () => {
      try {
        setLoading(true);

        if (post_id) {
          const postData = await postService.getPost({
            post_id: post_id,
          });

          if (postData.response) {
            setPost(postData.response.data.result);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getPost();
  }, [post_id]);

  return loading ? (
    <div className="relative h-96">
      <Loading />
    </div>
  ) : post ? (
    <div className="space-y-4">
      <PageDescription
        title={`${
          post.type === PostType.Post ? t("post.Question") : t("post.Repost")
        }
          ${t("post.from")} ${post.user_detail.name}`}
        desc={`${t("post.See detailed content of the")} 
        ${post.type === PostType.Post ? t("post.question") : t("post.repost")}`}
      />
      <PostCard post={post} isDetail={true} />
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
