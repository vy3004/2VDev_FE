import { useState, useEffect } from "react";

import Loading from "./loading";
import TagButton from "./tag-button";

import tagService from "../../services/tag-service";
import NotFoundAlert from "./not-found-alert";

const TagsTrending = () => {
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getTags = async () => {
      setIsLoading(true);

      const { response } = await tagService.getTags();

      if (response) {
        setTags(response.data.data.slice(0, 15));
      }

      setIsLoading(false);
    };

    getTags();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="relative h-20">
          <Loading />
        </div>
      ) : tags && tags.length > 0 ? (
        tags.map(({ _id, name }) => (
          <TagButton key={_id} id={_id} name={name} />
        ))
      ) : (
        <NotFoundAlert message="No tags found" isBack={false} />
      )}
    </div>
  );
};

export default TagsTrending;
