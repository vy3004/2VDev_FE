import { Button, Typography } from "@material-tailwind/react";

interface StatsButtonProps {
  label: string;
  stats: string;
  icon: any;
}

const StatsButton: React.FC<StatsButtonProps> = ({ label, stats, icon }) => {
  return (
    <Button
      variant="outlined"
      className="normal-case w-full sm:space-y-2 sm:p-2"
    >
      <div className="flex items-center gap-1">
        {icon}
        <Typography className="text-xl font-semibold">{stats}</Typography>
      </div>
      <Typography className="text-left sm:text-lg font-semibold">
        {label}
      </Typography>
    </Button>
  );
};

export default StatsButton;
