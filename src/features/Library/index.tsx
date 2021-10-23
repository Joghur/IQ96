import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LibraryHome from './LibraryHome';
import Laws from './Laws';
import Song from './Song';
import Summary from './Summary';
import Logs from './Logs';
import Letters from './Letters';
import PdfScreen from '../../components/PdfScreen';

const Stack = createNativeStackNavigator();

const stackoptions = {headerShown: false};

const Library = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LibraryHome"
        component={LibraryHome}
        options={stackoptions}
      />
      <Stack.Screen name="Laws" component={Laws} options={stackoptions} />
      <Stack.Screen name="Song" component={Song} options={stackoptions} />
      <Stack.Screen name="Summary" component={Summary} options={stackoptions} />
      <Stack.Screen name="Logs" component={Logs} options={stackoptions} />
      <Stack.Screen name="Letters" component={Letters} options={stackoptions} />
      <Stack.Screen
        name="PdfScreen"
        component={PdfScreen}
        options={stackoptions}
      />
    </Stack.Navigator>
  );
};

export default Library;
