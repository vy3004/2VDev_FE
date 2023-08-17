// import { useEffect, useState } from "react";
import MainLayout from "./components/layout/main-layout";

function App() {
  // const [theme, setTheme] = useState<string | null>(null);

  // useEffect(() => {
  //   if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  //     setTheme("dark");
  //   } else {
  //     setTheme("light");
  //   }
  // }, []);

  // useEffect(() => {
  //   if (theme === "dark") {
  //     document.documentElement.classList.add("dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //   }
  // }, [theme]);

  // const handleThemeSwitch = () => {
  //   setTheme(theme === "dark" ? "light" : "dark");
  //   console.log(theme);
  // };

  return <MainLayout />;
}

export default App;
