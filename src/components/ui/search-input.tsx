import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Button, Input } from "@material-tailwind/react";

const SearchInput = () => {
  return (
    <div className="relative flex w-full gap-2">
      <Input type="search" label="Search" className="pr-20" crossOrigin={""} />
      <Button size="sm" className="!absolute right-1 top-1 rounded">
        <MagnifyingGlassIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SearchInput;
