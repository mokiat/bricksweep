import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      Back: 'Back',
    },
  },
  bg: {
    translation: {
      Back: 'Назад',
    },
  },
};

const detectLang = () => {
  const lang = window.navigator.language;
  if (resources[lang]) {
    return lang;
  }
  return 'en';
};

i18n.use(initReactI18next).init({
  resources,
  lng: detectLang(),
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
