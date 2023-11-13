import { ArrowTrendingDownIcon, StarIcon } from "@heroicons/react/24/solid";
import { Typography } from "@material-tailwind/react";

interface UserPointProps {
  point: number;
}

const UserPoint: React.FC<UserPointProps> = ({ point }) => {
  const isNegative = point < 0;
  const displayPoint = isNegative ? 0 : point;
  const pointText = point === 1 ? "point" : "points";
  const icon = isNegative ? (
    <ArrowTrendingDownIcon className="w-4 h-4" />
  ) : (
    <StarIcon className="w-4 h-4" />
  );

  return (
    <div className="text-orange-500 flex gap-1 select-none">
      {icon}
      <Typography className="text-sm font-semibold">
        {displayPoint} {pointText}
      </Typography>
    </div>
  );
};

export default UserPoint;
