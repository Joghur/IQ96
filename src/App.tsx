import React, {useEffect, useState} from 'react';
import {Alert, LogBox} from 'react-native';
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
import {fetchDocuments, queryDocuments} from './utils/db';
import {getData, storeData, keys} from './utils/async';

import './i18n';
import './utils/firebase';

const Tab = createBottomTabNavigator();

const App = () => {
  LogBox.ignoreAllLogs();
  const {t} = useTranslation();

  const [authUser, setAuthUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  console.log('settings', settings);
  console.log('user', user);

  useEffect(() => {
    const auth = getAuth();
    const subscriber = onAuthStateChanged(auth, userObj => {
      if (userObj) {
        setInitializing(false);
        setAuthUser(() => userObj);
        checkStorage(userObj.uid);
      } else {
        setAuthUser(null);
      }
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  const checkStorage = async uid => {
    const settingsData = await getData(keys.settings);
    const userData = await getData(keys.user);

    if (uid === undefined) return;

    if (settingsData !== null) {
      console.log('async settingsData');
      setSettings(() => settingsData);
    } else {
      console.log('firebase settingsData');
      const settingsData = await fetchDocuments('settings');
      if (settingsData?.success?.length === 1) {
        setSettings(() => settingsData.success[0]);
        storeData('settings', settingsData.success[0]);
      } else {
        console.log('Error happened in App - settings: ', settingsData?.error);
        Alert.alert('Fejl under hentning af indstillinger');
      }
    }

    if (userData !== null) {
      console.log('async userData');
      setUser(() => userData);
    } else {
      console.log('firebase userData');
      const userData = await queryDocuments('users', 'uid', '==', uid);
      if (userData?.success?.length === 1) {
        setUser(() => userData.success[0]);
        storeData('user', userData.success[0]);
      } else {
        console.log('Error happened in App - user: ', userData?.error);
        Alert.alert('Fejl under hentning af bruger data');
      }
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

//   useEffect(() => {
//     const auth = getAuth();
//     onAuthStateChanged(auth, userObj => {
//       if (userObj.uid) {
//         const uid = userObj.uid;
//         setAuthUser(() => userObj);
//         console.log('uid', uid);
//         fetchAsyncStorage();
//       } else {
//         setAuthUser(null);
//       }
//     });
//     console.log('user', user);
//     console.log('settings', settings);
//     if (authUser.uid && (!settings || !user)) {
//       fetchData();
//     }
//   }, []);

//   const fetchAsyncStorage = async () => {
//     const settingsData = await getAsync('settings');
//     const userdata = await getAsync('user');

//     setSettings(() => settingsData);
//     setUser(() => userdata);
//   };

//   const fetchData = async () => {
//     const settingsData = await fetchDocuments('settings');
//     console.log('authUser.uid', authUser.uid);
//     const userData = await queryDocuments('users', 'uid', '==', authUser.uid);

//     console.log('settingsData', settingsData);
//     console.log('userData', userData);

//     if (settingsData?.success.length === 1) {
//       setSettings(() => settingsData.success[0]);
//       await AsyncStorage.setItem(
//         'settings',
//         JSON.stringify(settingsData.success[0]),
//       );
//     } else {
//       console.log('Error happened in App - settings: ', settingsData.error);
//       Alert.alert('Kunne ikke hente indstillinger');
//     }

//     if (userData?.success?.length === 1) {
//       setUser(() => userData.success[0]);
//       await AsyncStorage.setItem('user', JSON.stringify(userData.success[0]));
//     } else {
//       console.log('Error happened in App - user: ', userData.error);
//       Alert.alert('Fejl under hentning af bruger data');
//     }
//   };
