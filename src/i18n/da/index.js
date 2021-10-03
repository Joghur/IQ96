import home from './home';
import events from './events.js';
import settings from './settings';

export default {
  da: {
    translation: {
      ...home,
      ...events,
      ...settings,
    },
  },
};
