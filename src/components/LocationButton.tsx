import React, {useLayoutEffect, useState} from 'react';
import {StyleSheet, Text, View, Pressable, Alert} from 'react-native';
import {useRecoilState} from 'recoil';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import {GeoPoint} from 'firebase/firestore/lite';

import Colors from '../constants/colors';
import {lokationState, userState} from '../utils/appState';
import {getData, storeData} from '../utils/async';
import Location from '../types/Location';
import User from '../types/User';
import {editDocument, deleteDocumentField} from '../utils/db';

const LocationButton = () => {
  const [isLocationOn, setIsLocationOn] = useRecoilState(lokationState);
  const [user, setUser] = useRecoilState(userState);
  const [location, setLocation] = useState<Location>(null);

  console.log('location -------------- ', location);

  useLayoutEffect(() => {
    handleStartLocation();
  }, []);

  const handleStartLocation = async () => {
    const lok = await getData('isLocationOn');
    console.log('lok', lok);
    if (lok === null) {
      await storeData('isLocationOn', false);
      setIsLocationOn(false);
    } else {
      if (lok) {
        console.log('33');
        Geolocation.getCurrentPosition(info =>
          setLocation((old: Location) => ({
            ...old,
            latitude: info.coords.latitude,
            longitude: info.coords.longitude,
          })),
        );
        console.log('41');
        if (location) {
          setIsLocationOn(true);
          setUser((old: User) => ({
            ...old,
            location,
          }));
          await editDocument('users', user.id, {
            location: new GeoPoint(
              Number(location.latitude),
              Number(location.latitude),
            ),
          });
        }
        console.log('56');
        return;
      }
      if (user.id) {
        const result = await deleteDocumentField('users', user.id, 'location');
        console.log('delete field', result);
        setIsLocationOn(false);
        setUser((old: User) => ({
          ...old,
          location: null,
        }));
      }
    }
  };

  const handleChange = async () => {
    if (isLocationOn) {
      await storeData('isLocationOn', false);
      setIsLocationOn(false);
      setLocation(null);
      setUser((old: User) => ({
        ...old,
        location: null,
      }));
      await deleteDocumentField('users', user.id, 'location');
      return;
    }
    // if isLokationOn is false and we turn it on permissions have to be checked
    permissionStatus();
  };

  const permissionStatus = async () => {
    try {
      let permissionStatus;
      console.log('Platform.OS', Platform.OS);
      if (Platform.OS === 'android') {
        console.log('android');
        permissionStatus = await request(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        );
      } else {
        // iOS permissions
        permissionStatus = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
        if (permissionStatus === RESULTS.DENIED) {
          permissionStatus = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
        }
      }
      console.log('permissionStatus', permissionStatus);
      const permissionGranted = permissionStatus === RESULTS.GRANTED;
      console.log('permissionGranted', permissionGranted);
      if (permissionGranted) {
        Geolocation.getCurrentPosition(info =>
          setLocation((old: Location) => ({
            ...old,
            latitude: info.coords.latitude,
            longitude: info.coords.longitude,
          })),
        );
        if (location) {
          await storeData('isLocationOn', true);
          setIsLocationOn(true);
          console.log(
            '1 - Number(location.latitude) Number(location.latitude)',
            Number(location.latitude),
            Number(location.latitude),
          );
          await editDocument('users', user.id, {
            location: new GeoPoint(
              Number(location.latitude),
              Number(location.latitude),
            ),
          });
        }
        return true;
      }

      const permissionDenied = permissionStatus === RESULTS.DENIED;
      console.log('permissionDenied', permissionDenied);
      const alertMessage = permissionDenied
        ? 'IQ96 appen kræver adgang til din lokation og vil ikke vise og sende position til andre med-lemmer'
        : 'Hvis du ikke giver adgang nu skal du gå ind i din telefons indstillinger og give lov før du kan sende lokation';

      Alert.alert('IQ96 appen kræver adgang til din lokation', alertMessage, [
        {
          text: 'Den er jeg med på',
        },
      ]);
      await storeData('isLocationOn', permissionGranted);
      setIsLocationOn(permissionGranted);

      if (permissionGranted) {
        Geolocation.getCurrentPosition(info =>
          setLocation((old: Location) => ({
            ...old,
            latitude: info.coords.latitude,
            longitude: info.coords.longitude,
          })),
        );
        await editDocument('users', user.id, {
          location: new GeoPoint(
            Number(location.latitude),
            Number(location.latitude),
          ),
        });
      }
      return permissionGranted;
    } catch (error) {
      console.log('permissionStatus error', error);
      Alert.alert('Fejl opstået', 'Der opstod en fejl under adgangen', [
        {
          text: 'Ok',
        },
      ]);
    }
  };

  return (
    <View style={isLocationOn ? styles.green : styles.red}>
      <Pressable
        onPress={handleChange}
        onLongPress={() =>
          Alert.alert('Grøn betyder at IQ med-lemmer kan se din position')
        }>
        <Text>{isLocationOn ? 'Sender lokation' : '  Send Lokation'}</Text>
      </Pressable>
    </View>
  );
};

export default LocationButton;

const styles = StyleSheet.create({
  green: {
    backgroundColor: Colors.success,
    borderColor: Colors.lightSuccess,
    position: 'absolute',
    right: 100,
    borderWidth: 2,
    borderRadius: 20,
    padding: 7,
  },
  red: {
    backgroundColor: Colors.error,
    borderColor: Colors.lightError,
    position: 'absolute',
    right: 100,
    borderWidth: 2,
    borderRadius: 20,
    padding: 7,
  },
});
