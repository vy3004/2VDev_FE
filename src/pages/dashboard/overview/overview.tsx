import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Select, Option, Typography } from "@material-tailwind/react";

import Loading from "../../../components/common/loading";
import PageDescription from "../../../components/common/page-description";
import NotFoundAlert from "../../../components/common/not-found-alert";
import StatisticOverview from "./components/statistics-overview";
import BarChart from "./components/bar-chart";

import postService from "../../../services/post-service";

import {
  generateMonthLabel,
  generateMonthOptions,
  getCurrentMonth,
} from "../../../utils/string-utils";
import { DashboardData } from "../../../utils/types";

const currentYear = new Date().getFullYear();

const Overview = () => {
  const { t } = useTranslation();

  const [rootData, setRootData] = useState<DashboardData[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const currentMonthName = generateMonthLabel(getCurrentMonth().toString());

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

      setRootData(sortedData);
      setDashboardData(filteredData);
    }

    setIsLoading(false);
  };

  const filterData = (data: DashboardData[], selectedMonth: string) => {
    return selectedMonth
      ? data.filter(
          (item: DashboardData) =>
            item.year === currentYear &&
            item.month >= parseInt(selectedMonth, 10)
        )
      : data.slice(-3);
  };

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
    const filteredDashboardData = filterData(rootData, value);
    setDashboardData(filteredDashboardData);
  };

  return (
    <div className="space-y-4">
      <PageDescription
        title={t("overview.Overview")}
        desc={`${t(
          "overview.Overview data in"
        )} ${currentMonthName} ${currentYear}`}
      />
      {isLoading ? (
        <div className="relative h-96">
          <Loading />
        </div>
      ) : dashboardData.length === 0 ? (
        <NotFoundAlert message={t("overview.No data found")} type="error" />
      ) : (
        <>
          <StatisticOverview
            dashboardData={dashboardData}
            selectedMonth={selectedMonth}
          />

          <div className="border rounded-lg shadow-md p-2 space-y-2 dark:bg-gray-800 dark:border-gray-800">
            <div className="flex justify-end">
              <div className="w-fit">
                <Select
                  label={t("overview.Select month")}
                  className="font-bold dark:text-gray-200"
                  labelProps={{
                    className: "font-bold dark:text-gray-200",
                  }}
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
            <Typography className="text-base sm:text-lg text-center font-bold dark:text-gray-200">
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
