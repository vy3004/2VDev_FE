import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Loading from "../../../components/common/loading";
import NotFoundAlert from "../../../components/common/not-found-alert";
import Pagination from "../../../components/common/pagination";
import PostDetail from "./post-detail";

import postService from "../../../services/post-service";
import { Post } from "../../../utils/types";

const PostDetailPage = () => {
  const { post_id } = useParams();

  const [post, setPost] = useState<Post>();
  const [comments, setComments] = useState<Post[]>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const next = () => {
    if (page === totalPage) return;

    setPage(page + 1);
  };

  const prev = () => {
    if (page === 1) return;

    setPage(page - 1);
  };

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
            limit: 5,
            page: page,
          });

          if (commentsData.response) {
            let data = [...commentsData.response.data.result.post_children];
            setTotalPage(commentsData.response.data.result.total_page);
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
  }, [post_id, page]);

  return loading ? (
    <div className="relative h-96">
      <Loading />
    </div>
  ) : post ? (
    <div className="space-y-4">
      <PostDetail post={post} comments={comments} />
      <Pagination page={page} totalPage={totalPage} next={next} prev={prev} />
    </div>
  ) : (
    <NotFoundAlert message="Post not found!" />
  );
};

export default PostDetailPage;
