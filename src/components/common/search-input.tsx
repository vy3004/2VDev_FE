import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { Button } from "@material-tailwind/react";
import {
  ArrowSmallLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

import { selectApp, setIsSearch } from "../../redux/features/app-state-slice";

const SearchInput = () => {
  const { isSearch } = useSelector(selectApp);
  const { t } = useTranslation();

  const dispatch = useDispatch();

  return (
    <div
      className={`p-0.5 border-2 border-gray-900 dark:bg-gray-50 dark:text-gray-900 rounded-full flex ${
        isSearch && "w-full"
      }`}
    >
      <Button
        size="sm"
        className="rounded-full normal-case flex items-center gap-2 dark:bg-gray-900"
        onClick={() => dispatch(setIsSearch(!isSearch))}
      >
        {!isSearch ? (
          <>
            <MagnifyingGlassIcon className="h-4 w-4" /> {t("header.search")}
          </>
        ) : (
          <ArrowSmallLeftIcon className="h-4 w-4" />
        )}
      </Button>
      {isSearch && (
        <input
          className="bg-transparent w-full font-bold rounded-full px-3 focus:outline-0"
          type="search"
        />
      )}
    </div>
  );
};

export default SearchInput;
