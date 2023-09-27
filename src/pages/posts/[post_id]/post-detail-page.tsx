import { useState, useEffect } from "react";
import { Post } from "../../../utils/types";
import { useParams } from "react-router-dom";
import postService from "../../../services/post-service";
import Loading from "../../../components/common/loading";
import PostDetail from "./post-detail";
import NotFoundAlert from "../../../components/common/not-found-alert";

const PostDetailPage = () => {
  const { post_id } = useParams();

  const [post, setPost] = useState<Post>();
  const [comments, setComments] = useState<Post[]>();
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

          const commentsData = await postService.getComments({
            post_id: post_id,
            limit: 20,
            page: 1,
          });

          if (commentsData.response) {
            let data = [...commentsData.response.data.result.post_children];

            setComments(data);
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
    <PostDetail post={post} comments={comments} />
  ) : (
    <NotFoundAlert message="Post not found!" />
  );
};

export default PostDetailPage;
