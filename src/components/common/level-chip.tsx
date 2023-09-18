import { useTranslation } from "react-i18next";
import { Chip } from "@material-tailwind/react";

interface LevelChipPops {
  level: number;
}

const LevelChip: React.FC<LevelChipPops> = ({ level }) => {
  const { t } = useTranslation();

  return (
    <Chip
      className="normal-case"
      variant="ghost"
      size="sm"
      value={
        level === 0
          ? t("user.Bronze")
          : level === 1
          ? t("user.Silver")
          : level === 2
          ? t("user.Gold")
          : level === 3
          ? t("user.Platinum")
          : t("user.Diamond")
      }
      color={
        level === 0
          ? "brown"
          : level === 1
          ? "gray"
          : level === 2
          ? "yellow"
          : level === 3
          ? "cyan"
          : "blue"
      }
    />
  );
};

export default LevelChip;
