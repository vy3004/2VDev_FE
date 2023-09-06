import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "../translations/en.json";
import translationVI from "../translations/vi.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: translationEN,
    },
    vi: {
      translation: translationVI,
    },
  },
  fallbackLng: localStorage.getItem("language") || "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
