import { useTranslation } from "react-i18next";
import { Spinner } from "@material-tailwind/react";

const Loading = () => {
  const { t } = useTranslation();

  return (
    <div className="absolute h-full w-full z-[1] bg-white opacity-90 flex items-center justify-center text-xl gap-2">
      <Spinner className="h-10 w-10" />
      {t("home.Loading...")}
    </div>
  );
};

export default Loading;
