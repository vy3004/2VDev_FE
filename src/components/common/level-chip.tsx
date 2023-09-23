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
        level < 50
          ? t("user.Bronze")
          : level < 200
          ? t("user.Silver")
          : level < 1000
          ? t("user.Gold")
          : level < 10000
          ? t("user.Platinum")
          : t("user.Diamond")
      }
      color={
        level < 50
          ? "brown"
          : level < 200
          ? "gray"
          : level < 1000
          ? "yellow"
          : level < 10000
          ? "cyan"
          : "blue"
      }
    />
  );
};

export default LevelChip;
