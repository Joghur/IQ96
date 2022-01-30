import {atom, selector} from 'recoil';

export const userState = atom({
  key: 'userState',

  default: {
    isAdmin: false,
    isBoard: false,
    isSuperAdmin: false,
    name: '',
    nick: '',
    title: '',
    avatar: '',
    firebaseId: '',
    locationId: '',
  },
});

export const userSelector = selector({
  key: 'userSelector',
  get: ({get}) => {
    const user = get(userState);

    return user;
  },
});

export const eventState = atom({
  key: 'eventState',

  default: {},
});

export const eventSelector = selector({
  key: 'eventSelector',
  get: ({get}) => {
    const event = get(eventState);

    return event;
  },
});

export const lokationState = atom({
  key: 'lokationState',

  default: false,
});

export const lokationSelector = selector({
  key: 'lokationSelector',
  get: ({get}) => {
    const lokation = get(lokationSelector);

    return lokation;
  },
});
