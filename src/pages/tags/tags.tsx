import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Button, Typography } from "@material-tailwind/react";
import { TagIcon } from "@heroicons/react/24/solid";

import Loading from "../../components/common/loading";
import NotFoundAlert from "../../components/common/not-found-alert";

import tagService from "../../services/tag-service";

const Tags = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getTags = async () => {
      setIsLoading(true);

      const { response } = await tagService.getTags();

      if (response) {
        setTags(response.data.data);
      }

      setIsLoading(false);
    };

    getTags();
  }, []);

  return isLoading ? (
    <div className="relative h-80">
      <Loading />
    </div>
  ) : tags && tags.length > 0 ? (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {tags.map(({ _id, name, count }) => (
        <Button
          key={_id}
          variant="outlined"
          className="normal-case border-l-8"
          onClick={() => navigate(`/tags/${_id}`)}
        >
          <div className="flex gap-2">
            <TagIcon className="w-5 h-5 mt-1" />

            <div className="text-left">
              <Typography className="font-bold lowercase">{name}</Typography>
              <Typography className="text-sm">
                {count} {t(`post.${count === 1 ? "question" : "questions"}`)}
              </Typography>
            </div>
          </div>
        </Button>
      ))}
    </div>
  ) : (
    <NotFoundAlert message={t("post.No tags found")} />
  );
};

export default Tags;
