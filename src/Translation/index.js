import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      Back: 'Back',
      'Watch Tutorial': 'Watch Tutorial',
      'Play 3 x 3': 'Play 3 x 3',
      'Play 4 x 3': 'Play 4 x 3',
    },
  },
  bg: {
    translation: {
      Back: 'Назад',
      'Watch Tutorial': 'Изгледай Урок',
      'Play 3 x 3': 'Играй 3 x 3',
      'Play 4 x 3': 'Играй 4 x 3',
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
