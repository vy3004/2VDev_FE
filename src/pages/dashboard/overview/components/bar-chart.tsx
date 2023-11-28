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

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  dashboardData: DashboardData[];
}

const BarChart: React.FC<BarChartProps> = ({ dashboardData }) => {
  const { t } = useTranslation();

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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      x: {
        type: "category" as const,
        stacked: false,
      },
      y: {
        stacked: false,
      },
    },
  };

  return <Bar options={options} data={data} />;
};

export default BarChart;
