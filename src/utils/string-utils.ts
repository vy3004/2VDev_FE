export const getLastTwoWords = (str: string): string => {
  const words = str.split(" ");
  const lastTwoWords = words.slice(-2).join(" ");
  return lastTwoWords;
};

export const splitPath = (path: string): { label: string; path: string }[] => {
  const parts = path.split("/").filter(Boolean);
  let currentPath = "";

  return parts.map((part, index) => {
    currentPath += `/${part}`;
    return {
      label: part,
      path: currentPath,
    };
  });
};
