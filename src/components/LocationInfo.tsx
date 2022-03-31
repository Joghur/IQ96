import React, {useLayoutEffect} from 'react';
import {StyleSheet, Text, View, Pressable, Alert} from 'react-native';
import {useRecoilState} from 'recoil';

import Colors from '../constants/colors';
import {lokationState} from '../utils/appState';
import {getData} from '../utils/async';

const LocationInfo = () => {
  const [isLocationOn, setIsLocationOn] = useRecoilState(lokationState);

  useLayoutEffect(() => {
    handleStartLocation();
  }, []);

  const handleStartLocation = async () => {
    const lok = await getData('isLocationOn');
    // console.log('lok', lok);
    if (lok === null) {
      setIsLocationOn(false);
    } else {
      if (lok) {
        setIsLocationOn(true);
        return;
      }
    }
  };

  return (
    <View style={isLocationOn ? styles.green : styles.red}>
      <Pressable
        onPress={() =>
          Alert.alert(
            'Grøn -> IQ med-lemmer kan se din position. Skift under indstillinger',
          )
        }
        onLongPress={() =>
          Alert.alert(
            'Grøn -> IQ med-lemmer kan se din position. Skift under indstillinger',
          )
        }>
        <Text>{'Lokation'}</Text>
      </Pressable>
    </View>
  );
};

export default LocationInfo;

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
