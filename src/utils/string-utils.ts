import { parseISO, formatDistanceToNow, format } from "date-fns";
import { enUS, vi } from "date-fns/locale";

import { POSTS_SORT, POSTS_TYPE } from "./constant";

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

export const getSortPostsLabel = (value: string) => {
  const sortItem = POSTS_SORT.find((item) => item.value === value);
  return sortItem ? sortItem.label : "";
};

export const getTypePostsLabel = (value: string) => {
  const sortItem = POSTS_TYPE.find((item) => item.value === value);
  return sortItem ? sortItem.label : "";
};
