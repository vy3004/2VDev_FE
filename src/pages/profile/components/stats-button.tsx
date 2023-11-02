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
      className="normal-case w-full sm:space-y-2 sm:p-2 dark:text-gray-50 dark:border-gray-50"
    >
      <div className="flex items-center gap-2">
        {icon}
        <Typography className="text-xl font-semibold">{stats}</Typography>
      </div>
      <Typography className="text-center sm:text-lg font-semibold">
        {label}
      </Typography>
    </Button>
  );
};

export default StatsButton;
