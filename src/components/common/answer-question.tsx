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
      className={`lg:hidden sticky top-[61px] ms:top-[77px] z-[10] w-full py-2 bg-white flex items-center justify-between gap-10 transition-transform duration-300 ${show}`}
    >
      <SearchInput />

      {!isSearch && <QuestionButton />}
    </div>
  );
};

export default AnswerQuestion;
