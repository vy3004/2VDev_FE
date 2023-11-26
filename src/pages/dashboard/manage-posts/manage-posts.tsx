import { useEffect } from "react";
import reportPostService from "../../../services/report-service";

const ManagePosts = () => {
  const getReports = async () => {
    const { response, error } = await reportPostService.getReports();

    if (response) {
      console.log(response);
    }
    if (error) console.log(error);
  };

  useEffect(() => {
    getReports();
  }, []);

  return <div>ManagePosts</div>;
};

export default ManagePosts;
