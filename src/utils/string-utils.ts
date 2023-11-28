import {
  parseISO,
  formatDistanceToNowStrict,
  formatDistanceToNow,
  format,
} from "date-fns";
import { enUS, vi } from "date-fns/locale";

import i18n from "../configs/i18n";

const getLocale = () => (i18n.language === "en" ? enUS : vi);

const generateLocaleConfig = () => ({
  addSuffix: true,
  locale: getLocale(),
});

export const getLastTwoWords = (str: string): string => {
  const words = str.split(" ");
  const lastTwoWords = words.slice(-2).join(" ");
  return lastTwoWords;
};

export const splitPath = (path: string): { label: string; path: string }[] => {
  const parts = path.split("/").filter(Boolean);
  let currentPath = "";

  return parts.map((part) => {
    currentPath += `/${part}`;
    return {
      label: part,
      path: currentPath,
    };
  });
};

export const formatTimeDistanceToNow = (time: string): string =>
  formatDistanceToNowStrict(parseISO(time), generateLocaleConfig())
    .replace("ago", "")
    .replace("trước", "")
    .trim();

export const formatTimeDistanceToNowAbout = (time: string): string =>
  formatDistanceToNow(parseISO(time), generateLocaleConfig());

export const formatTime = (time: string): string => {
  const locale = getLocale();

  const formattedTime = format(
    parseISO(time),
    i18n.language === "en"
      ? "HH:mm EEEE, MMMM dd, yyyy"
      : "HH:mm EEEE, dd/MM/yyyy",
    {
      locale,
    }
  );

  return formattedTime;
};

export const getLabelByValue = (
  value: string,
  array: {
    label: string;
    value: string;
  }[]
) => {
  const sortItem = array.find((item) => item.value === value);
  return sortItem ? sortItem.label : "";
};

export const getLevelByPoint = (point: number): string => {
  if (point < 50) {
    return "Bronze";
  } else if (point < 200) {
    return "Silver";
  } else if (point < 1000) {
    return "Gold";
  } else if (point < 10000) {
    return "Platinum";
  } else {
    return "Diamond";
  }
};

const getCurrentMonth = () => new Date().getMonth() + 1;

export const generateMonthOptions = () =>
  Array.from({ length: 12 }, (_, index) => {
    const monthValue = index + 1;
    return {
      value: monthValue.toString(),
      label: new Date(2000, index, 1).toLocaleString(i18n.language, {
        month: "long",
      }),
    };
  }).filter((option) => parseInt(option.value, 10) < getCurrentMonth());

export const calculatePercentageChange = (count: number, prevCount: number) => {
  if (prevCount === 0) return count >= 0 ? 100 : -100;
  const percentageChange = ((count - prevCount) / Math.abs(prevCount)) * 100;
  return isFinite(percentageChange) ? percentageChange : 100;
};
