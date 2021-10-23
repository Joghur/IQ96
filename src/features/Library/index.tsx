import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LibraryHome from './LibraryHome';
import Letters from './Letters';

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
      <Stack.Screen name="Letters" component={Letters} options={stackoptions} />
    </Stack.Navigator>
  );
};

export default Library;
