import {atom, selector} from 'recoil';

export const userState = atom({
  key: 'userState',

  default: {
    isAdmin: false,
    isBoard: false,
    isSuperAdmin: false,
  },
});

export const userSelector = selector({
  key: 'userSelector', // unique ID (with respect to other atoms/selectors)
  get: ({get}) => {
    const user = get(userState);

    return user;
  },
});
