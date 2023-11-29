import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";

import {
  ChatBubbleLeftIcon,
  QuestionMarkCircleIcon,
  ShareIcon,
} from "@heroicons/react/24/solid";
import StatisticCard from "./statistic-card";

import { DashboardData } from "../../../../utils/types";
import { calculatePercentageChange } from "../../../../utils/string-utils";

interface StatisticOverviewProps {
  dashboardData: DashboardData[];
  selectedMonth: string;
}

const StatisticOverview: React.FC<StatisticOverviewProps> = ({
  dashboardData,
  selectedMonth,
}) => {
  const { t } = useTranslation();

  const lastDashboardValue = dashboardData[dashboardData.length - 1];

  const calculatePercentage = (
    current: DashboardData,
    previous: DashboardData
  ) => {
    return {
      postsPercentageChange: calculatePercentageChange(
        current.posts_count,
        previous.posts_count
      ),
      repostsPercentageChange: calculatePercentageChange(
        current.reposts_count,
        previous.reposts_count
      ),
      commentsPercentageChange: calculatePercentageChange(
        current.comments_count,
        previous.comments_count
      ),
    };
  };

  const [percentageChange, setPercentageChange] = useState({
    postsPercentageChange: 0,
    repostsPercentageChange: 0,
    commentsPercentageChange: 0,
  });

  useEffect(() => {
    if (selectedMonth === "") {
      setPercentageChange(
        calculatePercentage(
          lastDashboardValue,
          dashboardData[dashboardData.length - 2]
        )
      );
    } else {
      setPercentageChange(
        calculatePercentage(lastDashboardValue, dashboardData[0])
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardData, selectedMonth]);

  const statisticsData = [
    {
      title: t("overview.Total Questions"),
      icon: (
        <QuestionMarkCircleIcon className="w-10 h-10 p-1 border rounded-md text-teal-500 bg-teal-50" />
      ),
      value: lastDashboardValue.posts_count,
      percentageChange: percentageChange.postsPercentageChange,
      selectedMonth: selectedMonth,
    },
    {
      title: t("overview.Total Reposts"),
      icon: (
        <ShareIcon className="w-10 h-10 p-1 border rounded-md text-pink-500 bg-pink-50" />
      ),
      value: lastDashboardValue.reposts_count,
      percentageChange: percentageChange.repostsPercentageChange,
      selectedMonth: selectedMonth,
    },
    {
      title: t("overview.Total Answers"),
      icon: (
        <ChatBubbleLeftIcon className="w-10 h-10 p-1 border rounded-md text-amber-500 bg-amber-50" />
      ),
      value: lastDashboardValue.comments_count,
      percentageChange: percentageChange.commentsPercentageChange,
      selectedMonth: selectedMonth,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statisticsData.map((item) => (
        <StatisticCard
          key={item.title}
          icon={item.icon}
          title={item.title}
          value={item.value}
          percentageChange={item.percentageChange}
          selectedMonth={item.selectedMonth}
        />
      ))}
    </div>
  );
};

export default StatisticOverview;
