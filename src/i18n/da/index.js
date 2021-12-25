import events from './events.js';
import home from './home';
import library from './library';
import members from './members';
import chat from './chat';
import settings from './settings';

export default {
  da: {
    translation: {
      ...chat,
      ...events,
      ...home,
      ...library,
      ...members,
      ...settings,
    },
  },
};
