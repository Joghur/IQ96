import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useRecoilValue} from 'recoil';
import MapView, {Marker} from 'react-native-maps';
import Feather from 'react-native-vector-icons/Feather';
import Geolocation from '@react-native-community/geolocation';

import Colors from '../../constants/colors';
import {userState} from '../../utils/appState';
import {CustomDivider} from '../../components/CustomDivider';
import User from '../../types/User';
import Banner from '../../components/Banner';

function Map() {
  const user: User = useRecoilValue(userState);

  console.log('user - Map', user);
  Geolocation.getCurrentPosition((enableHighAccuracy = true), info =>
    console.log('info', info),
  );
  console.log('user?.location?.latitude', user?.location?.latitude);
  console.log('user?.location?.longitude', user?.location?.longitude);
  return (
    <>
      <Banner label={'Kort'} />
      <View style={styles.container}>
        <Text>IQ96 kort</Text>
        <CustomDivider />
        <MapView
          style={{...StyleSheet.absoluteFillObject}}
          initialRegion={{
            // initial region set to Bileto
            latitude: user?.location?.latitude || 55.913581,
            longitude: user?.location?.longitude || 12.4941323,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Marker
            coordinate={{latitude: 37.4133196, longitude: -122.1162863}}
            title="Flatiron School Atlanta"
            description="This is where the magic happens!">
            <View style={styles.mapPointer}>
              <Feather name={'map-pin'} color="red" size={18} />
              <Text>{user.nick}</Text>
            </View>
          </Marker>
        </MapView>
      </View>
    </>
  );
}

export default memo(Map);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light,
  },
  mapPointer: {
    // flexDirection: 'row',
    alignItems: 'center',
  },
});
