import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import PostForm from "../../../components/post/post-form";
import Loading from "../../../components/common/loading";

import postService from "../../../services/post-service";
import { Post } from "../../../utils/types";

const PostPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const postIdParam = queryParams.get("post_id");

  const [post, setPost] = useState<Post>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getPost = async () => {
      try {
        setLoading(true);

        if (postIdParam) {
          const postData = await postService.getPost({
            post_id: postIdParam,
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
  }, [postIdParam]);

  return loading ? (
    <div className="relative h-96">
      <Loading />
    </div>
  ) : (
    <PostForm initialData={post || null} />
  );
};

export default PostPage;
