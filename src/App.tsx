import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-easy-icon';
import {useTranslation} from 'react-i18next';
import Home from './features/Home';
import Settings from './features/Settings';
import './i18n';

const Tab = createBottomTabNavigator();

const App = () => {
  const {t} = useTranslation();
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="home">
        <Tab.Screen
          name="home"
          component={Home}
          options={{
            tabBarLabel: t('home'),
            tabBarIcon: ({focused, color, size}) => (
              <Icon
                name={focused ? 'home' : 'home-outline'}
                type="material-community"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="settings"
          component={Settings}
          options={{
            tabBarLabel: t('settings'),
            tabBarIcon: ({focused, color, size}) => (
              <Icon
                name={focused ? 'cog' : 'cog-outline'}
                type="material-community"
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
