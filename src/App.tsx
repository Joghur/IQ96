import React from 'react';
import {LogBox} from 'react-native';
import {RecoilRoot} from 'recoil';

import Start from './Start';

const App = () => {
  LogBox.ignoreAllLogs(); // TODO either update firebase to one without commmunity asyncStorage or another asyncStorage

  return (
    <RecoilRoot>
      <Start />
    </RecoilRoot>
  );
};

export default App;
