export const getLastTwoWords = (str: string): string => {
  const words = str.split(" ");
  const lastTwoWords = words.slice(-2).join(" ");
  return lastTwoWords;
};
