import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import {
  IconButton,
  SpeedDial,
  SpeedDialHandler,
  SpeedDialContent,
  Tooltip,
} from "@material-tailwind/react";
import { PlusIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";

import { selectApp, setThemeMode } from "../../redux/features/app-state-slice";

const SpeedDialCustom = () => {
  const { i18n } = useTranslation();
  const { themeMode } = useSelector(selectApp);
  const dispatch = useDispatch();

  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );

  useEffect(() => {
    if (themeMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("themeMode", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("themeMode", "light");
    }
  }, [themeMode]);

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
  }, [i18n, language]);

  const handleThemeSwitch = () => {
    dispatch(setThemeMode(!themeMode));
  };

  const handleLanguageChange = () => {
    setLanguage(language === "en" ? "vi" : "en");
  };

  return (
    <div className="fixed bottom-6 right-6 z-20 ">
      <SpeedDial>
        <SpeedDialHandler>
          <IconButton
            size="lg"
            className="rounded-full bg-black text-white dark:bg-white dark:text-black dark:border"
          >
            <PlusIcon className="h-5 w-5 transition-transform group-hover:rotate-45" />
          </IconButton>
        </SpeedDialHandler>
        <SpeedDialContent>
          <Tooltip
            content={themeMode ? "Light mode" : "Dark mode"}
            placement="left"
          >
            <IconButton
              size="lg"
              onClick={handleThemeSwitch}
              className="rounded-full bg-black text-white dark:bg-white dark:text-black"
            >
              {themeMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip
            content={language === "en" ? "Tiếng Việt" : "English"}
            placement="left"
          >
            <IconButton
              size="lg"
              onClick={handleLanguageChange}
              className={`rounded-full ${
                language === "en"
                  ? "text-yellow-500 bg-red-500"
                  : "text-white bg-blue-500"
              }`}
            >
              {language === "en" ? "VI" : "EN"}
            </IconButton>
          </Tooltip>
        </SpeedDialContent>
      </SpeedDial>
    </div>
  );
};

export default SpeedDialCustom;
