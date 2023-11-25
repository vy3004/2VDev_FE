import { useEffect } from "react";
import postService from "../../../services/post-service";

const Overview = () => {
  useEffect(() => {
    const getPosts = async () => {
      const { response } = await postService.getPostsForAdmin();

      if (response) {
        console.log(response);
      }
    };

    getPosts();
  }, []);

  return <div></div>;
};

export default Overview;
