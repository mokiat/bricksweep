import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      Back: 'Back',
      'Play random level': 'Play random level',
      'Watch video lesson': 'Watch video lesson',
      'Play 3 by 3': 'Play 3 by 3',
      'Play 4 by 3': 'Play 4 by 3',
    },
  },
  bg: {
    translation: {
      Back: 'Назад',
      'Play random level': 'Играй произволно ниво',
      'Watch video lesson': 'Изгледай Урок',
      'Play 3 by 3': 'Играй 3 на 3',
      'Play 4 by 3': 'Играй 4 на 3',
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
