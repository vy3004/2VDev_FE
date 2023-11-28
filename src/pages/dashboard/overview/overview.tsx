import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  ChatBubbleLeftIcon,
  QuestionMarkCircleIcon,
  ShareIcon,
} from "@heroicons/react/24/solid";
import { Select, Option, Typography } from "@material-tailwind/react";

import Loading from "../../../components/common/loading";
import PageDescription from "../../../components/common/page-description";
import NotFoundAlert from "../../../components/common/not-found-alert";
import StatisticCard from "./components/statistic-card";
import BarChart from "./components/bar-chart";

import postService from "../../../services/post-service";

import {
  calculatePercentageChange,
  generateMonthOptions,
} from "../../../utils/string-utils";
import { DashboardData } from "../../../utils/types";

const currentYear = new Date().getFullYear();
const getLastValue = (array: DashboardData[]) => array[array.length - 1];

const Overview = () => {
  const { t } = useTranslation();

  const [rootData, setRootData] = useState<DashboardData[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const getLastDashboardValue = () => getLastValue(dashboardData);

  useEffect(() => {
    getDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDashboardData = async () => {
    setIsLoading(true);

    const { response } = await postService.getPostsForAdmin();

    if (response) {
      const sortedData = response.data.result.dashboard.sort(
        (a: DashboardData, b: DashboardData) =>
          new Date(`${a.year}-${a.month}`).getTime() -
          new Date(`${b.year}-${b.month}`).getTime()
      );

      const filteredData = filterData(sortedData, selectedMonth);
      const withPercentageChange = calculatePercentage(filteredData);

      setDashboardData(withPercentageChange);
      setRootData(withPercentageChange);
    }

    setIsLoading(false);
  };

  // Filter data based on the selectedMonth or default to the last 3 months
  const filterData = (data: DashboardData[], selectedMonth: string) => {
    return selectedMonth
      ? data.filter(
          (item: DashboardData) =>
            item.year === currentYear &&
            item.month >= parseInt(selectedMonth, 10)
        )
      : data.slice(0, 3);
  };

  // Calculate percentage change for each metric compared to the previous month
  const calculatePercentage = (data: DashboardData[]) =>
    data.map((item: DashboardData, index: number) => {
      const prevItem = data[index - 1] || {
        posts_count: 0,
        reposts_count: 0,
        comments_count: 0,
      };

      return {
        ...item,
        postsPercentageChange: calculatePercentageChange(
          item.posts_count,
          prevItem.posts_count
        ),
        repostsPercentageChange: calculatePercentageChange(
          item.reposts_count,
          prevItem.reposts_count
        ),
        commentsPercentageChange: calculatePercentageChange(
          item.comments_count,
          prevItem.comments_count
        ),
      };
    });

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);

    const filteredDashboardData = filterData(rootData, value);
    setDashboardData(filteredDashboardData);
  };

  return (
    <div className="space-y-4">
      <PageDescription title={t("overview.Overview")} desc="" />
      {isLoading ? (
        <div className="relative h-96">
          <Loading />
        </div>
      ) : dashboardData.length === 0 ? (
        <NotFoundAlert message={t("overview.No data found")} type="error" />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatisticCard
              icon={
                <QuestionMarkCircleIcon className="w-10 h-10 p-1 border rounded-md text-teal-500 bg-teal-50" />
              }
              title={t("overview.Total Questions")}
              value={getLastDashboardValue().posts_count}
              percentageChange={getLastDashboardValue().postsPercentageChange}
            />
            <StatisticCard
              icon={
                <ShareIcon className="w-10 h-10 p-1 border rounded-md text-pink-500 bg-pink-50" />
              }
              title={t("overview.Total Reposts")}
              value={getLastDashboardValue().reposts_count}
              percentageChange={getLastDashboardValue().repostsPercentageChange}
            />
            <StatisticCard
              icon={
                <ChatBubbleLeftIcon className="w-10 h-10 p-1 border rounded-md text-amber-500 bg-amber-50" />
              }
              title={t("overview.Total Answers")}
              value={getLastDashboardValue().comments_count}
              percentageChange={
                getLastDashboardValue().commentsPercentageChange
              }
            />
          </div>

          <div className="border rounded-lg shadow-md p-2 space-y-2">
            <div className="flex justify-end">
              <div className="w-fit">
                <Select
                  label={t("overview.Select month")}
                  value={selectedMonth}
                  onChange={(e) => handleMonthChange(e as string)}
                >
                  {generateMonthOptions()
                    .filter((option) =>
                      rootData.some(
                        (dataItem) =>
                          parseInt(option.value, 10) === dataItem.month
                      )
                    )
                    .map((option) => (
                      <Option
                        key={option.value}
                        value={option.value}
                        className="my-1"
                      >
                        {option.label}
                      </Option>
                    ))}
                </Select>
              </div>
            </div>
            <Typography className="text-base sm:text-lg text-center font-bold">
              {selectedMonth
                ? `${t("overview.Statistical chart from")} ${
                    dashboardData[0].month
                  }-${currentYear}`
                : t("overview.Statistical chart from last 3 months")}
            </Typography>

            <BarChart dashboardData={dashboardData} />
          </div>
        </>
      )}
    </div>
  );
};

export default Overview;
