import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  IconButton,
  SpeedDial,
  SpeedDialHandler,
  SpeedDialContent,
  SpeedDialAction,
  Tooltip,
} from "@material-tailwind/react";
import {
  PlusIcon,
  SunIcon,
  LanguageIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";

import { selectApp, setThemeMode } from "../../redux/features/app-state-slice";

const SpeedDialCustom = () => {
  const { themeMode } = useSelector(selectApp);
  const dispatch = useDispatch();

  useEffect(() => {
    if (themeMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("themeMode", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("themeMode", "light");
    }
  }, [themeMode]);

  const handleThemeSwitch = () => {
    dispatch(setThemeMode(!themeMode));
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
              {localStorage.getItem("theme") === "dark" ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip content="Translate" placement="left">
            <SpeedDialAction>
              <LanguageIcon className="h-5 w-5" />
            </SpeedDialAction>
          </Tooltip>
        </SpeedDialContent>
      </SpeedDial>
    </div>
  );
};

export default SpeedDialCustom;
