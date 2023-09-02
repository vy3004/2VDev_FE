import { useDispatch, useSelector } from "react-redux";
import { Button } from "@material-tailwind/react";
import {
  ArrowSmallLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

import { selectApp, setIsSearch } from "../../redux/features/app-state-slice";

const SearchInput = () => {
  const { isSearch } = useSelector(selectApp);

  const dispatch = useDispatch();

  return (
    <div
      className={`p-0.5 border-2 border-black rounded-full flex ${
        isSearch && "w-full"
      }`}
    >
      <Button
        size="sm"
        className="rounded-full normal-case flex items-center gap-2"
        onClick={() => dispatch(setIsSearch(!isSearch))}
      >
        {!isSearch ? (
          <>
            <MagnifyingGlassIcon className="h-4 w-4" /> Search
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
