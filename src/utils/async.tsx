/* eslint-disable @typescript-eslint/no-unused-vars */
import AsyncStorage from '@react-native-community/async-storage';

export const getData = async key => {
  try {
    const asyncToken = JSON.parse(await AsyncStorage.getItem(key));
    return asyncToken;
  } catch (error) {
    return error;
  }
};

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    return error;
  }
};

/**
 * Delete user data in AsyncStorage
 *
 * Called when user is loggin out
 *
 * @param {object} keys - keys to be erased
 * @returns {*} true if succesfull or null if unsuccessfull
 */
export const deleteData = async keys => {
  // Put other keys not to be erased here
  const {email, ...rest} = keys;

  try {
    await AsyncStorage.multiRemove(Object.keys(rest));
    return true;
  } catch (error) {
    return error;
  }
};

export const queryKeys = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys;
  } catch (error) {
    return error;
  }
};

export const keys = {
  settings: 'settings',
  user: 'user',
  email: 'email',
};
