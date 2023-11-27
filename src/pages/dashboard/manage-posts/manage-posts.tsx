import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";

import { EyeIcon } from "@heroicons/react/24/solid";
import { Button, Chip, Typography } from "@material-tailwind/react";
import PageDescription from "../../../components/common/page-description";
import Loading from "../../../components/common/loading";
import NotFoundAlert from "../../../components/common/not-found-alert";
import PostInfoUser from "../../../components/common/post-info-user";
import Time from "../../../components/common/time";

import reportPostService from "../../../services/report-service";

import { Post } from "../../../utils/types";

import { setPostInfoModal } from "../../../redux/features/post-info-slice";

const ManagePosts = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async (shouldIncreasePage = true) => {
    const { response } = await reportPostService.getReports({
      limit: 10,
      page: shouldIncreasePage ? page : 1,
    });

    if (response) {
      const newData = response.data.reports.result.map((item: any) => ({
        _id: item._id,
        reason: item.reason,
        created_at: item.created_at,
        is_readed: item.is_readed,
        user_report: item.user_report,
        post_info: {
          ...item.post_detail,
          user_detail: item.user_detail,
        },
      }));

      if (shouldIncreasePage) {
        setData((prevData) => [...prevData, ...newData]);
        setPage((prevPage) => prevPage + 1);
      } else {
        setData(newData);
        setPage(2);
      }

      setHasMore(newData.length > 0);
    }
  };

  const readReport = async (reportId: string) => {
    const { response } = await reportPostService.readReport({
      post_id: reportId,
    });
    if (response) {
      getData(false);
    }
  };

  const handleRead = (post: Post, reason: string, reportId: string) => {
    readReport(reportId);
    dispatch(
      setPostInfoModal({
        postInfoModalOpen: true,
        post: post,
        reason: reason,
      })
    );
  };

  return (
    <div>
      {/* Header start */}
      <PageDescription
        title={t("post.Manage Questions")}
        desc={t("post.See information about all reported questions")}
      />
      {/* Header end */}

      <InfiniteScroll
        dataLength={data.length}
        next={getData}
        hasMore={hasMore}
        loader={
          <div className="relative h-80">
            <Loading />
          </div>
        }
        endMessage={<NotFoundAlert message={t(`No more`)} type="success" />}
      >
        <div className="py-4 space-y-4">
          {data.map((data) => (
            <div
              className="border rounded-lg p-2 bg-white space-y-2 sm:space-y-0 shadow-md dark:bg-gray-900"
              key={data._id}
            >
              <div className="flex justify-between">
                <PostInfoUser user_detail={data.user_report} />
                <div className="sm:flex sm:items-center sm:gap-4">
                  <Chip
                    value={data.is_readed ? t("post.Read") : t("post.Unread")}
                    color={data.is_readed ? "green" : "red"}
                    className="normal-case"
                  />
                  <Time time={data.created_at} />
                  <Button
                    variant="text"
                    className="hidden md:flex md:items-center md:gap-2 normal-case text-base"
                    onClick={() =>
                      handleRead(data.post_info, data.reason, data._id)
                    }
                  >
                    <EyeIcon className="w-5 h-5" />
                    {t("post.View question")}
                  </Button>
                </div>
              </div>

              <div className="sm:pl-[4.5rem]">
                <Typography className="p-2 rounded-lg bg-gray-50">
                  {data.reason}
                </Typography>
              </div>

              <Button
                variant="text"
                fullWidth
                className="sm:hidden flex items-center gap-2 normal-case text-base"
                onClick={() =>
                  handleRead(data.post_info, data.reason, data._id)
                }
              >
                <EyeIcon className="w-5 h-5" />
                {t("post.View question")}
              </Button>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default ManagePosts;
