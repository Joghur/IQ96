import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import EventsHome from './EventsHome';
import Event from './Event';

const Stack = createNativeStackNavigator();

const stackoptions = {headerShown: false};

const Events = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="EventsHome"
        component={EventsHome}
        options={stackoptions}
      />
      <Stack.Screen name="Event" component={Event} options={stackoptions} />
    </Stack.Navigator>
  );
};

export default Events;
