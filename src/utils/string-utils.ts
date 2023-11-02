import { parseISO, formatDistanceToNow, format } from "date-fns";
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
