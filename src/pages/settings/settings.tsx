import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { Select, Typography, Option, Switch } from "@material-tailwind/react";
import ChangePasswordForm from "../../components/auth-form/change-password-form";

import { selectApp, setThemeMode } from "../../redux/features/app-state-slice";
import { LANGUAGES } from "../../utils/constant";

const Settings = () => {
  const { i18n, t } = useTranslation();
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

  const handleLanguageChange = (selectedValue: string | undefined) => {
    if (selectedValue !== undefined) {
      setLanguage(selectedValue);
    }
  };

  return (
    <div className="space-y-4">
      <ChangePasswordForm />

      <div className="space-y-4 bg-gray-100 rounded-md p-4">
        <Typography className="font-bold text-xl text-gray-900">
          {t("home.Language")}
        </Typography>

        <Select
          size="lg"
          label={t("home.Select Language")}
          selected={(element) =>
            element &&
            React.cloneElement(element, {
              disabled: true,
              className:
                "flex items-center opacity-100 px-0 gap-2 pointer-events-none font-bold",
            })
          }
          value={language}
          onChange={(selectedValue: string | undefined) =>
            handleLanguageChange(selectedValue)
          }
        >
          {LANGUAGES.map(({ name, value, flag }) => (
            <Option
              key={name}
              value={value}
              className="flex items-center gap-2 font-bold last:mt-2"
            >
              <img
                src={flag}
                alt={name}
                className="h-6 w-8.5 rounded-md object-cover"
              />
              {name}
            </Option>
          ))}
        </Select>
      </div>

      <div className="space-y-4 bg-gray-100 rounded-md p-4">
        <Typography className="font-bold text-xl text-gray-900">
          {t("home.Theme")}
        </Typography>

        <div className="flex items-center gap-2 px-1 font-bold">
          <p>{t("home.Light")}</p>
          <Switch
            crossOrigin={""}
            ripple={false}
            className={`h-full w-full ${
              themeMode ? "bg-black" : "bg-blue-500"
            }`}
            containerProps={{
              className: "w-14 h-8",
            }}
            circleProps={{
              className: `w-6 h-6 before:hidden left-[0.2rem] border-none ${
                themeMode ? "bg-white" : "bg-yellow-500"
              }`,
            }}
            checked={themeMode}
            onChange={handleThemeSwitch}
          />
          <p>{t("home.Dark")}</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
