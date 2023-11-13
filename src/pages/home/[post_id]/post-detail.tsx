import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Typography } from "@material-tailwind/react";
import Loading from "../../../components/common/loading";
import NotFoundAlert from "../../../components/common/not-found-alert";
import PostCard from "../../../components/post/post-card";

import postService from "../../../services/post-service";
import { Post } from "../../../utils/types";
import { PostType } from "../../../utils/constant";

const PostDetail = () => {
  const { post_id } = useParams();

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
      <div>
        <Typography variant="h5">
          {post.user_detail.name}'s{" "}
          {post.type === PostType.Post ? "Post" : "Repost"}
        </Typography>
        <Typography className="mt-1 font-normal">
          See detail information of the{" "}
          {post.type === PostType.Post ? "post" : "repost"}
        </Typography>
      </div>
      <PostCard post={post} isDetail={true} />
    </div>
  ) : (
    <NotFoundAlert message="Post not found!" />
  );
};

export default PostDetail;
