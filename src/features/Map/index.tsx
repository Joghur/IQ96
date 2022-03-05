import React, {memo, useEffect, useState} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import {useRecoilValue} from 'recoil';
import MapView, {Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from '@react-native-community/geolocation';

import Colors from '../../constants/colors';
import {userState} from '../../utils/appState';
import {CustomDivider} from '../../components/CustomDivider';
import User from '../../types/User';
import Banner from '../../components/Banner';
import Location from '../../types/Location';
import {fetchDocuments} from '../../utils/db';

function Map() {
  const user: User = useRecoilValue(userState);

  const [userMapLocation, setUserMapLocation] = useState<Location>(null);
  const [mapData, setMapData] = useState<Location[]>([]);
  const [error, setError] = useState(null);
  const [region, setRegion] = useState(null);

  console.log('userMapLocation', userMapLocation);
  console.log('mapData', mapData);
  console.log('mapData[0]', mapData[0]);
  console.log('user', user);

  const geo_success = info => {
    setUserMapLocation((old: Location) => ({
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

  const fetchMapData = async () => {
    const mapDoc = await fetchDocuments('map');
    if (mapDoc?.success) {
      // remove user location as may be in list and could be rendered twice
      setMapData(() =>
        mapDoc.success.filter(doc => doc.id !== user?.locationId),
      );
      return;
    }
    setError(() => mapDoc.error);
  };

  useEffect(() => {
    // users map location
    Geolocation.getCurrentPosition(geo_success, geo_error, geo_options);

    // other locations
    fetchMapData();
  }, []);

  const handleRegionChange = () => {
    console.log('----------------------------handleRegionChange');
    setRegion(() => ({
      //   ...userMapLocation,
      latitude: 55.3,
      longitude: 12.3,
      latitudeDelta: 0.0422,
      longitudeDelta: 0.0121,
    }));
  };

  if (error) {
    Alert.alert('Der er sket en fejl i hentning af position');
  }

  return (
    <>
      <Banner label={'Kort'} />
      <View>
        <Button title="Dig" onPress={() => handleRegionChange('user')} />
      </View>
      <View style={styles.container}>
        <CustomDivider />
        {userMapLocation?.latitude && userMapLocation?.longitude && (
          <MapView
            style={{...StyleSheet.absoluteFillObject}}
            initialRegion={{
              latitude:
                userMapLocation.latitude || mapData[0].location?.latitude,
              longitude:
                userMapLocation.longitude || mapData[0].location?.longitude,
              latitudeDelta: 0.0211,
              longitudeDelta: 0.006,
            }}
            onRegionChange={region}>
            <Marker
              coordinate={{
                latitude: userMapLocation?.latitude,
                longitude: userMapLocation?.longitude,
              }}>
              <View style={styles.mapPointer}>
                <Feather name={'map-pin'} color={Colors.success} size={22} />
                <Text>{user.nick}</Text>
              </View>
            </Marker>
            {mapData.map(point => {
              console.log('point', point);
              console.log(
                'point?.location?.latitude',
                point?.location?.latitude,
              );
              console.log(
                'point?.location?.longitude',
                point?.location?.longitude,
              );

              let color =
                point.madeBy === 'app' ? Colors.error : Colors.success;
              let icon;
              let ShowIcon;
              const size = 20;
              switch (point.type) {
                case 'hotel':
                  icon = 'hotel';
                  ShowIcon = <Icon name={icon} color={color} size={size} />;
                  break;

                case 'restaurant':
                  icon = 'restaurant';
                  ShowIcon = <Icon name={icon} color={color} size={size} />;
                  break;

                case 'user':
                  color = '#' + Math.random().toString(16).substr(-6);
                  icon = 'location-pin';
                  ShowIcon = <Icon name={icon} color={color} size={size} />;
                  break;

                case 'music':
                  icon = 'music-note';
                  ShowIcon = (
                    <MaterialCommunityIcons
                      name={icon}
                      color={color}
                      size={size}
                    />
                  );
                  break;

                case 'bar':
                  icon = 'glass-cocktail';
                  ShowIcon = (
                    <MaterialCommunityIcons
                      name={icon}
                      color={color}
                      size={size}
                    />
                  );
                  break;

                case 'sightseeing':
                  icon = 'apple-keyboard-command';
                  ShowIcon = (
                    <MaterialCommunityIcons
                      name={icon}
                      color={color}
                      size={size}
                    />
                  );
                  break;

                default:
                  icon = 'question';
                  ShowIcon = (
                    <MaterialCommunityIcons
                      name={icon}
                      color={color}
                      size={size}
                    />
                  );
              }

              console.log('color', color);
              console.log('icon', icon);
              return (
                <View key={point.id}>
                  <Marker
                    coordinate={{
                      latitude: point?.location?.latitude,
                      longitude: point?.location?.longitude,
                    }}
                    title={point.title ? point.title : ''}
                    description={point.description ? point.description : ''}>
                    <View style={styles.mapPointer}>
                      {ShowIcon}
                      <Text>{point.nick}</Text>
                    </View>
                  </Marker>
                </View>
              );
            })}
          </MapView>
        )}
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
    alignItems: 'center',
  },
});
