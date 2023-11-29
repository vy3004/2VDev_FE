import { useTranslation } from "react-i18next";

import { Typography } from "@material-tailwind/react";

import { generateMonthLabel } from "../../../../utils/string-utils";

interface StatisticCardProps {
  icon: React.ReactElement;
  title: string;
  value: number;
  percentageChange: number;
  selectedMonth: string;
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  icon,
  title,
  value,
  percentageChange,
  selectedMonth,
}) => {
  const { t } = useTranslation();

  const isPositiveChange = percentageChange >= 0;

  return (
    <div className="border rounded-lg shadow-md p-2 space-y-2 dark:bg-gray-800 dark:border-gray-800 dark:text-gray-300">
      <div className="flex items-center gap-2">
        {icon}
        <Typography className="font-bold">{title}</Typography>
      </div>
      <div className="flex items-center gap-2">
        <Typography className="font-bold text-3xl">{value}</Typography>
        <Typography
          className={`rounded-xl p-1 text-xs ${
            isPositiveChange
              ? "text-green-500 bg-green-50"
              : "text-red-500 bg-red-50"
          }`}
        >
          {`${isPositiveChange ? "+" : ""}${Number(percentageChange).toFixed(
            1
          )}%`}
        </Typography>
        <Typography className="font-bold text-xs text-gray-600 dark:text-gray-400">
          {selectedMonth
            ? `${t("overview.vs")} ${generateMonthLabel(selectedMonth)}`
            : t("overview.vs last month")}
        </Typography>
      </div>
    </div>
  );
};

export default StatisticCard;
