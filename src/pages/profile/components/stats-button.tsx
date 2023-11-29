import { Button } from "@material-tailwind/react";

interface StatsButtonProps {
  label: string;
  stats: string | number;
  icon: any;
}

const StatsButton: React.FC<StatsButtonProps> = ({ label, stats, icon }) => {
  return (
    <Button
      variant="outlined"
      className="normal-case w-full sm:space-y-2 sm:p-2 dark:text-gray-300 dark:border-gray-800 dark:bg-gray-800"
    >
      <div className="flex items-center gap-4">
        <div>{icon}</div>
        <div className="text-left font-semibold">
          <p className="text-base">{label}</p>
          <p className="text-lg">{stats}</p>
        </div>
      </div>
    </Button>
  );
};

export default StatsButton;
