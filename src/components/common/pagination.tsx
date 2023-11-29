import { useTranslation } from "react-i18next";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { IconButton, Typography } from "@material-tailwind/react";

interface PaginationProps {
  page: number;
  totalPage: number;
  next: () => void;
  prev: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPage,
  next,
  prev,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-end gap-4">
      <IconButton
        size="sm"
        variant="outlined"
        onClick={prev}
        disabled={page === 1}
        className="dark:text-gray-300 dark:bg-gray-800"
      >
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
      </IconButton>
      <Typography className="font-normal dark:text-gray-300">
        {t("user.Page")} <strong>{page}</strong> {t("user.of")}{" "}
        <strong>{totalPage}</strong>
      </Typography>
      <IconButton
        size="sm"
        variant="outlined"
        onClick={next}
        disabled={page === totalPage}
        className="dark:text-gray-300 dark:bg-gray-800"
      >
        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
      </IconButton>
    </div>
  );
};

export default Pagination;
