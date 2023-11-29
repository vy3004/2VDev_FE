import { useTranslation } from "react-i18next";
import { Chip } from "@material-tailwind/react";

import { getLevelByPoint } from "../../utils/string-utils";

interface LevelChipPops {
  level: number;
}

const LevelChip: React.FC<LevelChipPops> = ({ level }) => {
  const { t } = useTranslation();

  return (
    <Chip
      className="normal-case dark:text-gray-100"
      size="sm"
      value={t(`user.${getLevelByPoint(level)}`)}
      color={
        level < 50
          ? "brown"
          : level < 200
          ? "blue-gray"
          : level < 1000
          ? "yellow"
          : level < 10000
          ? "cyan"
          : "indigo"
      }
    />
  );
};

export default LevelChip;
