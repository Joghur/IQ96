import React, {useEffect, useState} from 'react';
import {useRecoilState} from 'recoil';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import {useTranslation} from 'react-i18next';
import {getAuth, onAuthStateChanged} from 'firebase/auth';

import Home from './features/Home';
import Events from './features/Events';
import Chat from './features/Chat';
import Library from './features/Library';
import Map from './features/Map';
// import Members from './features/Members';
import Settings from './features/Settings';
import Login from './features/Home/login';
import {fetchDocuments, queryDocuments} from './utils/db';
import {userState} from './utils/appState';

import './i18n';
import './utils/firebase';
import {getData, storeData} from './utils/async';

const Tab = createBottomTabNavigator();
const Start = () => {
  const {t} = useTranslation();

  const [authUser, setAuthUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  //   const [settings, setSettings] = useRecoilState(null);
  const [user, setUser] = useRecoilState(userState);

  console.log('user', user);

  useEffect(() => {
    const auth = getAuth();
    const subscriber = onAuthStateChanged(auth, userObj => {
      //   console.log('userObj', userObj);
      if (userObj) {
        setAuthUser(() => userObj);
        checkStorage(userObj.uid);
      } else {
        setAuthUser(null);
      }
      setInitializing(false);
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  const checkStorage = async uid => {
    if (uid === undefined) return;
    const settings = await getData('settings');
    const asyncLocationId = await getData('locationId');
    if (!settings) {
      console.log('firebase settingsData');
      const settingsData = await fetchDocuments('settings');
      if (settingsData?.success?.length === 1) {
        storeData('settings', settingsData.success[0]);
        // setSettings(() => settingsData.success[0]);
      } else {
        console.log('Error happened in App - settings: ', settingsData?.error);
        Alert.alert('Fejl under hentning af indstillinger - 1');
      }
    } else {
      console.log('async settingsData', settings);
    }

    console.log('firebase userData');
    const userData = await queryDocuments('users', 'uid', '==', uid);
    if (userData?.success?.length === 1) {
      setUser(userData.success[0]);
      if (asyncLocationId) {
        setUser(oldUser => ({...oldUser, locationId: asyncLocationId}));
      }
    } else {
      console.log('Error happened in App - user: ', userData?.error);
      Alert.alert('Fejl under hentning af bruger data');
    }
  };

  if (initializing) {
    return <></>;
  }

  if (!authUser) {
    return <Login />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="home">
        <Tab.Screen
          name={t('iq96')}
          component={Home}
          options={{
            headerShown: false,
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
          name={'Kort'}
          component={Map}
          options={{
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <Feather name={'map'} size={size} color={color} />
            ),
          }}
        />
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
        <Tab.Screen
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
        />
        <Tab.Screen
          name={t('settings')}
          component={Settings}
          options={{
            headerShown: false,
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

export default Start;
