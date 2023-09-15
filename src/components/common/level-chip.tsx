import { Chip } from "@material-tailwind/react";

interface LevelChipPops {
  level: number;
}

const LevelChip: React.FC<LevelChipPops> = ({ level }) => {
  return (
    <Chip
      variant="ghost"
      size="sm"
      value={
        level === 0
          ? "Bronze"
          : level === 1
          ? "Silver"
          : level === 2
          ? "Gold"
          : level === 3
          ? "Platinum"
          : "Diamond"
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
