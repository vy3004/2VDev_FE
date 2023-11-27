import {
  parseISO,
  formatDistanceToNowStrict,
  format,
  formatDistanceToNow,
} from "date-fns";
import { enUS, vi } from "date-fns/locale";

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

export const formatTimeDistanceToNow = (
  time: string,
  language: string
): string => {
  const parsedTime = parseISO(time);
  const formattedTime = formatDistanceToNowStrict(parsedTime, {
    addSuffix: true,
    locale: language === "en" ? enUS : vi,
  });

  return formattedTime.replace("ago", "").replace("trước", "").trim();
};

export const formatTimeDistanceToNowAbout = (
  time: string,
  language: string
): string => {
  const parsedTime = parseISO(time);
  const formattedTime = formatDistanceToNow(parsedTime, {
    addSuffix: true,
    locale: language === "en" ? enUS : vi,
  });

  return formattedTime;
};

export const formatTime = (time: string, language: string): string => {
  const parsedTime = parseISO(time);
  const formattedTime = format(parsedTime, "HH:mm EEEE, MMMM dd, yyyy", {
    locale: language === "en" ? enUS : vi,
  });

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
