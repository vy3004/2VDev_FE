import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Button, Typography } from "@material-tailwind/react";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative">
      <img src="/images/404.gif" alt="gif" />

      <div className="absolute w-full top-0 text-center backdrop-blur-[1px]">
        <Typography className="text-xl md:text-3xl font-bold">
          {t("notification.Oh No! Error 404")}
        </Typography>
        <Typography className="md:text-xl font-bold">
          {t("notification.Sorry we couldn't find the page you're looking for")}
        </Typography>
      </div>
      <div className="absolute w-full bottom-0 flex justify-center">
        <Button onClick={() => navigate("/")}>
          {t("notification.Back to home page")}
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
