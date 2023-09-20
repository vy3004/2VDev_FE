import { useEffect, useState } from "react";

import { Button, Typography } from "@material-tailwind/react";
import { TagIcon } from "@heroicons/react/24/solid";

import Loading from "../../components/common/loading";

import tagService from "../../services/tag-service";

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getTags = async () => {
      setIsLoading(true);

      const { response } = await tagService.getTags();

      if (response) {
        console.log(response.data.data);
        setTags(response.data.data);
      }

      setIsLoading(false);
    };

    getTags();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {isLoading && <Loading />}

      {tags.map(({ name, count }, key) => (
        <Button key={key} variant="outlined" className="normal-case border-l-8">
          <div className="flex gap-2">
            <TagIcon className="w-5 h-5 mt-1" />

            <div className="text-left">
              <Typography className="font-bold lowercase">{name}</Typography>
              <Typography className="text-sm">{count} questions</Typography>
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default Tags;
