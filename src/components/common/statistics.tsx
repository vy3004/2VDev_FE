import { useEffect, useState } from "react";
import { t } from "i18next";

import { Typography } from "@material-tailwind/react";
import AnimatedNumber from "./animate-number";

import userService from "../../services/user-service";

import { STATISTICS_DURATION } from "../../utils/constant";

const Statistics = () => {
  const [data, setData] = useState({
    questions: 0,
    bestAnswers: 0,
    answers: 0,
    users: 0,
  });

  const getData = async () => {
    try {
      const { response } = await userService.getData();
      if (response) {
        setData(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-2 p-4">
      <div className="relative block rounded-bl-3xl rounded-tr-3xl overflow-hidden p-2 bg-white shadow-md dark:bg-gray-900">
        <span className="absolute inset-x-0 top-0 h-2 bg-gradient-to-l from-black to-blue-300" />
        <div className="h-full flex flex-col items-center justify-center">
          <Typography className="text-sm text-blue-500">
            {t("right-sidebar.Questions")}
          </Typography>
          <AnimatedNumber
            finalNumber={data.questions}
            duration={STATISTICS_DURATION}
          />
        </div>
      </div>
      <div className="relative block rounded-br-3xl rounded-tl-3xl overflow-hidden p-2 bg-white shadow-md dark:bg-gray-900">
        <span className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-black to-red-300" />
        <div className="h-full flex flex-col items-center justify-center">
          <Typography className="text-sm text-red-500">
            {t("right-sidebar.Answers")}
          </Typography>
          <AnimatedNumber
            finalNumber={data.answers}
            duration={STATISTICS_DURATION}
          />
        </div>
      </div>
      <div className="relative block rounded-br-3xl rounded-tl-3xl overflow-hidden p-2 bg-white shadow-md dark:bg-gray-900">
        <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-l from-black to-green-300" />
        <div className="h-full flex flex-col items-center justify-center">
          <Typography className="text-sm text-green-500">
            {t("right-sidebar.Best Answers")}
          </Typography>
          <AnimatedNumber
            finalNumber={data.bestAnswers}
            duration={STATISTICS_DURATION}
          />
        </div>
      </div>
      <div className="relative block rounded-bl-3xl rounded-tr-3xl overflow-hidden p-2 bg-white shadow-md dark:bg-gray-900">
        <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-black to-orange-300" />
        <div className="h-full flex flex-col items-center justify-center">
          <Typography className="text-sm text-orange-500">
            {t("right-sidebar.Users")}
          </Typography>
          <AnimatedNumber
            finalNumber={data.users}
            duration={STATISTICS_DURATION}
          />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
