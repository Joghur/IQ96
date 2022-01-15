import {Alert} from 'react-native';

import {deleteData} from './async';

import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';

import './firebase';

const auth = getAuth();

export const logIn = async ({email, password}) => {
  let userObj;
  try {
    userObj = await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log('Login error: ', error);
    Alert.alert('Der er skete en fejl under log ind');
  }

  return userObj;
};

export const logOut = async () => {
  console.log('logOut');
  try {
    await signOut(auth);
    await deleteData();
  } catch (error) {
    console.log('Logout error: ', error);
    Alert.alert('Der er skete en fejl under log ud');
  }
};

export const resetPassword = async email => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.log('Logout error: ', error);
    Alert.alert('Der er skete en fejl under log ud', error);
  }
};
