import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import SearchInput from "./search-input";
import QuestionButton from "./question-button";

import { selectApp } from "../../redux/features/app-state-slice";

const AnswerQuestion = () => {
  const [show, setShow] = useState("translate-y-0");
  const [lastScrollY, setLastScrollY] = useState(0);

  const { isSearch } = useSelector(selectApp);

  const controlNavbar = () => {
    if (window.scrollY > 50) {
      if (window.scrollY > lastScrollY) {
        setShow("-translate-y-[77px]");
      } else {
        setShow("shadow-sm");
      }
    } else {
      setShow("translate-y-0");
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastScrollY]);

  return (
    <div
      className={`lg:hidden sticky top-[61px] sm:top-[77px] z-[10] w-full p-2 rounded-b-xl bg-white dark:bg-gray-700 flex items-center justify-between transition-transform duration-300 ${show}`}
    >
      <SearchInput />

      {!isSearch && <QuestionButton />}
    </div>
  );
};

export default AnswerQuestion;
