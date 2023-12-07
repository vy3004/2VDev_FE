import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import { Button } from "@material-tailwind/react";
import Loading from "../../../components/common/loading";
import NotFoundAlert from "../../../components/common/not-found-alert";
import PageDescription from "../../../components/common/page-description";
import PostCard from "../../../components/post/post-card";

import postService from "../../../services/post-service";

import { Post } from "../../../utils/types";
import {
  POST_DELETE_TYPE,
  POST_TYPE_LABEL,
  USER_ROLE,
} from "../../../utils/constant";

import { selectUser } from "../../../redux/features/user-slice";

const PostDetail = () => {
  const { post_id } = useParams();
  const { t } = useTranslation();
  const { user } = useSelector(selectUser);

  const [post, setPost] = useState<Post>();
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === USER_ROLE.Admin;

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

  const handleRestorePost = async () => {
    if (isAdmin && post) {
      const { response, error } = await postService.restorePostForAdmin({
        post_id: post._id,
      });

      if (response) {
        getPost();
        toast.success(t("post.You have successfully restored"));
      }

      if (error) toast.error(t("post.Something went wrong"));
    }
  };

  if (loading)
    return (
      <div className="relative h-96">
        <Loading />
      </div>
    );

  if (!post)
    return (
      <NotFoundAlert
        message={t("post.Question not found")}
        type="error"
        isBack={true}
      />
    );

  const typeLabel = t(`overview.${POST_TYPE_LABEL[post.type]}`);

  if (post.is_deleted !== POST_DELETE_TYPE.No)
    return (
      <div className="space-y-4">
        <NotFoundAlert
          message={`${typeLabel} ${
            post.is_deleted === POST_DELETE_TYPE.Admin
              ? t("post.is deleted")
              : t("post.has been deleted")
          }`}
          type="error"
          isBack={true}
        />
        {isAdmin && (
          <Button
            className="normal-case text-base dark:bg-gray-800"
            variant="filled"
            fullWidth
            onClick={handleRestorePost}
          >
            {t("post.Restore")} {typeLabel.toLowerCase()}
          </Button>
        )}
      </div>
    );

  return (
    <div className="space-y-4">
      <PageDescription
        title={`${typeLabel} ${t("post.from")} ${post.user_detail.name}`}
        desc={`${t(
          "post.See detailed content of the"
        )} ${typeLabel.toLowerCase()}`}
      />
      <PostCard post={post} isDetail={true} reLoadPost={getPost} />
    </div>
  );
};

export default PostDetail;
