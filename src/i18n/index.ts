import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

// tips: export each translation to a separate file
const resources = {
  en: {
    translation: {
      english: 'English',
      danish: 'Dansk',
      welcome: 'Welcome!',
      settings: 'Settings',
      home: 'Home',
    },
  },
  da: {
    translation: {
      welcome: 'Velkommen !',
      settings: 'Indstillinger',
      home: 'Hjem',
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
