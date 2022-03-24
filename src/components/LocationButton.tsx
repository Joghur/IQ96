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
import {
  fetchDocument,
  saveData,
  deleteDocument,
  editDocument,
} from '../utils/db';

const LocationButton = () => {
  const [isLocationOn, setIsLocationOn] = useRecoilState(lokationState);
  const [user, setUser] = useRecoilState(userState);
  const [location, setLocation] = useState<Location>(null);
  const [error, setError] = useState();

  console.log('location -------------- ', location);
  console.log('user -------------- ', user);

  const geo_success = info => {
    setLocation((old: Location) => ({
      ...old,
      latitude: info.coords.latitude,
      longitude: info.coords.longitude,
    }));
  };
  const geo_error = error => {
    setError(error);
  };
  const geo_options = {
    enableHighAccuracy: true,
    timeout: 5000,
  };

  useLayoutEffect(() => {
    handleStartLocation();
  }, []);

  const handleStartLocation = async () => {
    const locationAllowed = await getData('isLocationOn');
    const asyncLocationId = await getData('locationId');
    console.log('locationAllowed', locationAllowed);
    console.log('asyncLocationId', asyncLocationId);
    if (locationAllowed === null) {
      await storeData('isLocationOn', false);
      setIsLocationOn(false);
    } else {
      if (locationAllowed) {
        setUser(oldUser => ({
          ...oldUser,
          locationId: asyncLocationId,
        }));
        console.log('55');
        saveLocationToDB();
        return;
      }
      //   if it's not allowed to transmit location
      if (user?.locationId) {
        console.log('77');
        const result = await deleteDocument('map', user.locationId);
        setUser(oldUser => ({
          ...oldUser,
          locationId: null,
        }));
        console.log('delete field', result);
        setIsLocationOn(false);
      }
    }
  };

  const handleChange = async () => {
    console.log('85');
    if (isLocationOn) {
      console.log('87');
      await storeData('isLocationOn', false);
      setIsLocationOn(false);
      setLocation(null);
      if (user.locationId) {
        console.log('92');
        console.log('88- user.locationId');
        await deleteDocument('map', user.locationId);
        setUser(oldUser => ({
          ...oldUser,
          locationId: null,
        }));
        await editDocument('users', user.id, {
          location: new GeoPoint(
            Number(location.latitude),
            Number(location.longitude),
          ),
          timestamp: new Date(),
          locationId: '',
        });
      }
      return;
    }
    // if isLokationOn is false and we turn it on permissions have to be checked
    permissionStatus();
  };

  const saveLocationToDB = async () => {
    console.log('110');
    Geolocation.getCurrentPosition(geo_success, geo_error, geo_options);
    console.log('location', location);
    if (location) {
      console.log('112');
      console.log('131');
      await storeData('isLocationOn', true);
      setIsLocationOn(true);
      console.log(
        '1 - Number(location.latitude) Number(location.latitude)',
        Number(location.latitude),
        Number(location.longitude),
      );
      try {
        console.log('140');
        let doc;
        if (user?.locationId) {
          doc = await fetchDocument('map', user.locationId);
        }
        console.log('141');
        console.log('doc - ----- ', doc);
        if (doc) {
          await editDocument('map', user.locationId, {
            nick: user.nick,
            location: new GeoPoint(
              Number(location.latitude),
              Number(location.longitude),
            ),
            timestamp: new Date(),
            type: 'user',
          });
        } else {
          console.log('150');
          const locationId = await saveData('map', {
            nick: user.nick,
            location: new GeoPoint(
              Number(location.latitude),
              Number(location.longitude),
            ),
            timestamp: new Date(),
            type: 'user',
          });
          if (locationId.success) {
            console.log('160');
            await storeData('locationId', locationId.success);
            setUser(oldUser => ({
              ...oldUser,
              locationId: locationId.success,
            }));
            await editDocument('users', user.id, {
              location: new GeoPoint(
                Number(location.latitude),
                Number(location.longitude),
              ),
              timestamp: new Date(),
              locationId: locationId.success,
            });
          }
        }
      } catch (error) {
        console.log('permissionStatus - error', error);
      }
    }
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
        console.log('122');
        saveLocationToDB();
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
        console.log('201');
        saveLocationToDB();
      }
      return permissionGranted;
    } catch (error) {
      console.log('permissionStatus error', error);
      Alert.alert('Fejl opstået', 'Der opstod en fejl under lokationsadgang', [
        {
          text: 'Ok',
        },
      ]);
    }
  };

  if (error) {
    let errorMessage;
    switch (error.code) {
      case 1:
        errorMessage = 'Lokation er slået fra';
        break;

      case 2:
        errorMessage =
          'Kan ikke hente position. Prøv at gå udenfor, forsøg igen og genstart app';
        break;

      default:
        errorMessage = 'Lokation timeout';
        break;
    }
    Alert.alert(errorMessage);
  }

  return (
    <View style={isLocationOn ? styles.green : styles.red}>
      <Pressable
        onPress={handleChange}
        onLongPress={() =>
          Alert.alert(
            'Grøn -> IQ med-lemmer kan se din position. Skift under indstillinger',
          )
        }>
        <Text>
          {isLocationOn ? 'Sender lokation' : '  Sender ikke lokation'}
        </Text>
      </Pressable>
    </View>
  );
};

export default LocationButton;

const styles = StyleSheet.create({
  green: {
    backgroundColor: Colors.success,
    borderColor: Colors.lightSuccess,
    borderWidth: 2,
    borderRadius: 20,
    padding: 7,
  },
  red: {
    backgroundColor: Colors.error,
    borderColor: Colors.lightError,
    borderWidth: 2,
    borderRadius: 20,
    padding: 7,
  },
});
