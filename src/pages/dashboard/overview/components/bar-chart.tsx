import React from "react";
import { useTranslation } from "react-i18next";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { DashboardData } from "../../../../utils/types";
import { useSelector } from "react-redux";
import { selectApp } from "../../../../redux/features/app-state-slice";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  dashboardData: DashboardData[];
}

const BarChart: React.FC<BarChartProps> = ({ dashboardData }) => {
  const { t } = useTranslation();
  const { themeMode } = useSelector(selectApp);

  const labels = dashboardData.map((item) => item.date);

  const datasets = [
    {
      label: t("overview.Question"),
      data: dashboardData.map((item) => item.posts_count),
      backgroundColor: "#b2dfdb",
      borderColor: "#009688",
      borderWidth: 1,
    },
    {
      label: t("overview.Repost"),
      data: dashboardData.map((item) => item.reposts_count),
      backgroundColor: "#f8bbd0",
      borderColor: "#e91e63",
      borderWidth: 1,
    },
    {
      label: t("overview.Answer"),
      data: dashboardData.map((item) => item.comments_count),
      backgroundColor: "#ffecb3",
      borderColor: "#ffc107",
      borderWidth: 1,
    },
  ];

  const data = { labels, datasets };

  const themeColor = themeMode ? "#fafafa" : "#212121";

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: themeColor,
        },
      },
    },
    scales: {
      x: {
        type: "category" as const,
        stacked: false,
        ticks: {
          color: themeColor,
        },
        grid: {
          color: themeColor,
        },
      },
      y: {
        stacked: false,
        ticks: {
          color: themeColor,
        },
        grid: {
          color: themeColor,
        },
      },
    },
  };

  return <Bar options={options} data={data} />;
};

export default BarChart;
