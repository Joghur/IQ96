import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';
import {getAuth, onAuthStateChanged} from 'firebase/auth';

import Home from './features/Home';
import Events from './features/Events';
// import Chat from './features/Chat';
import Library from './features/Library';
// import Members from './features/Members';
import Settings from './features/Settings';
import Login from './features/Home/login';

import './i18n';
import './utils/firebase';

const Tab = createBottomTabNavigator();

// type User = {
//   email: string;
//   password: string;
// };

const App = () => {
  const {t} = useTranslation();
  const [user, setUser] = useState({});

  console.log('user', user);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, userObj => {
      if (userObj) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = userObj.uid;
        setUser(() => userObj);
        console.log('uid', uid);
      } else {
        // User is signed out
        // ...
      }
    });
  }, []);

  if (!user?.uid) {
    return <Login />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="home">
        <Tab.Screen
          name={t('iq96')}
          component={Home}
          options={{
            tabBarIcon: ({focused, color, size}) => (
              <MaterialCommunityIcons
                name={focused ? 'home' : 'home-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name={t('events')}
          component={Events}
          options={{
            headerShown: false,
            tabBarIcon: ({focused, color, size}) => (
              <MaterialCommunityIcons
                name={focused ? 'beer' : 'beer-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
        {/* <Tab.Screen
          name={t('members')}
          component={Members}
          options={{
            headerShown: false,
            tabBarIcon: ({focused, color, size}) => (
              <MaterialCommunityIcons
                name={focused ? 'account-group' : 'account-group-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        /> */}
        <Tab.Screen
          name={t('library')}
          component={Library}
          options={{
            headerShown: false,
            tabBarIcon: ({focused, color, size}) => (
              <MaterialCommunityIcons
                name={focused ? 'library-shelves' : 'library'}
                size={size}
                color={color}
              />
            ),
          }}
        />
        {/* <Tab.Screen
          name={t('chat')}
          component={Chat}
          options={{
            headerShown: false,
            tabBarIcon: ({focused, color, size}) => (
              <MaterialCommunityIcons
                name={focused ? 'chat' : 'chat-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        /> */}
        <Tab.Screen
          name={t('settings')}
          component={Settings}
          options={{
            tabBarLabel: t('settings'),
            tabBarIcon: ({focused, color, size}) => (
              <MaterialCommunityIcons
                name={focused ? 'cog' : 'cog-outline'}
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
