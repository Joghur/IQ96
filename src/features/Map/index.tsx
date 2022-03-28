import React, {memo, useEffect, useState} from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import {useRecoilValue} from 'recoil';
import MapView, {Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from '@react-native-community/geolocation';

import AddPoi from './AddPoi';
import Colors from '../../constants/colors';
import {userState} from '../../utils/appState';
import {CustomDivider} from '../../components/CustomDivider';
import User from '../../types/User';
import Banner from '../../components/Banner';
import Location from '../../types/Location';
import {fetchDocuments} from '../../utils/db';
import {randomColor} from '../../utils/colors';

function Map() {
  const user: User = useRecoilValue(userState);

  const [userMapLocation, setUserMapLocation] = useState<Location>(null);
  const [mapData, setMapData] = useState<Location[]>([]);
  const [newPoi, setNewPoi] = useState<Location[]>([]);
  const [error, setError] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [region, setRegion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editable, setEditable] = useState(false);
  const [editablePoi, setEditablePoi] = useState(false);

  console.log('userMapLocation', userMapLocation);
  console.log('mapData', mapData);
  console.log('mapData[0]', mapData[0]);
  console.log('user', user);
  console.log('newPoi', newPoi);

  const geo_success = info => {
    setUserMapLocation((old: Location) => ({
      ...old,
      latitude: info.coords.latitude,
      longitude: info.coords.longitude,
      latitudeDelta: 0.0422,
      longitudeDelta: 0.0121,
    }));
  };
  const geo_error = error => {
    setError(error);
  };
  const geo_options = {
    enableHighAccuracy: true,
    timeout: 5000,
  };

  const fetchMapAndUserData = async () => {
    const mapDocs = await fetchDocuments('map');
    if (mapDocs?.success) {
      // remove user location as it may be in list and could be rendered twice
      setMapData(() =>
        mapDocs.success.filter(doc => doc.id !== user?.locationId),
      );
      return;
    }

    setMapError(() => mapDocs.error);
  };

  useEffect(() => {
    if (!showModal) {
      fetchMapAndUserData();
      // users map location
      Geolocation.getCurrentPosition(geo_success, geo_error, geo_options);
    }
  }, [showModal]);

  const handleRegionChange = point => {
    console.log('----------------------------handleRegionChange');
    const location = {
      latitude: null,
      longitude: null,
      latitudeDelta: 0.0422,
      longitudeDelta: 0.0121,
    };
    switch (point) {
      case 'user':
        setRegion(() => ({
          ...location,
          latitude: userMapLocation?.latitude || user?.location?.latitude,
          longitude: userMapLocation?.longitude || user?.location?.longitude,
          latitudeDelta: 0.0422,
          longitudeDelta: 0.0121,
        }));
        break;

      default:
        console.log('default');
        const poi = mapData.filter(p => {
          console.log('p 94 /------', p);
          console.log('point', point);
          if (p?.title) {
            return p?.title === point;
          }
          return p?.nick === point;
        });
        console.log('poi', poi);
        if (poi.length > 0) {
          setRegion(() => ({
            ...location,
            latitude: poi[0].location.latitude,
            longitude: poi[0].location.longitude,
            latitudeDelta: 0.0422,
            longitudeDelta: 0.0121,
          }));
        }
        break;
    }
  };

  const handlePress = e => {
    console.log(e.nativeEvent);
  };

  const handleLongPress = async e => {
    const location = e.nativeEvent.coordinate;
    setNewPoi(location);
    setShowModal(true);
  };

  const handleButtonLongPress = async point => {
    console.log('point', point);
    setEditable(true);
    setEditablePoi(point);
    setShowModal(true);
  };

  if (error || mapError) {
    if (error) {
      let errorMessage;
      switch (error?.code) {
        case 1:
          errorMessage = 'Lokation er slået fra';
          break;

        case 2:
          errorMessage =
            'Kan ikke hente position. Prøv at gå udenfor og genstart app';
          break;

        default:
          errorMessage = 'Lokation timeout';
          break;
      }
      //   Alert.alert(errorMessage);
      console.error('errorMessage', errorMessage);
    }
    if (mapError) {
      Alert.alert(mapError);
    }
  }

  const loc1 = Boolean(userMapLocation?.latitude && userMapLocation?.longitude);
  const loc2 = Boolean(
    mapData[0]?.location?.latitude && mapData[0]?.location?.longitude,
  );
  const loc3 = Boolean(user?.location?.latitude && user?.location?.longitude);
  const locationPresent = loc1 || loc2 || loc3;

  return (
    <>
      <Banner label={'Kort'} />
      {showModal && (
        <>
          <AddPoi
            backLink={() => setShowModal(false)}
            refresh={fetchMapAndUserData}
            location={newPoi}
            editable={editable}
            editablePoi={editablePoi}
          />
        </>
      )}
      {!showModal && (
        <>
          <View style={styles.buttonContainer}>
            {userMapLocation?.latitude && userMapLocation?.longitude && (
              <View style={styles.buttonOuter}>
                <Pressable
                  title="Refresh"
                  onPress={() => handleRegionChange('user')}
                  style={{
                    color: randomColor(),
                    borderColor: 'blue',
                    ...styles.button,
                  }}>
                  <Text>Dig</Text>
                </Pressable>
              </View>
            )}
            {mapData.map(p => {
              return (
                <View key={p.id} style={styles.buttonOuter}>
                  <Pressable
                    onLongPress={() => handleButtonLongPress(p)}
                    onPress={() =>
                      handleRegionChange(p.title ? p.title : p.nick)
                    }
                    style={{
                      color: p.madeBy === 'app' ? Colors.error : randomColor(),
                      borderColor:
                        p.madeBy === 'app' ? Colors.error : randomColor(),
                      ...styles.button,
                    }}>
                    <Text>{p.title ? p.title : p.nick}</Text>
                  </Pressable>
                </View>
              );
            })}
            <View style={styles.buttonOuter}>
              <Pressable
                title="Refresh"
                onPress={() => fetchMapAndUserData()}
                style={{
                  color: randomColor(),
                  borderColor: 'brown',
                  ...styles.button,
                }}>
                <Text>Refresh</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.container}>
            <CustomDivider />
            {locationPresent && mapData && (
              <MapView
                style={{...StyleSheet.absoluteFillObject}}
                initialRegion={{
                  latitude:
                    userMapLocation?.latitude ||
                    mapData[0]?.location?.latitude ||
                    user?.location?.latitude,
                  longitude:
                    userMapLocation?.longitude ||
                    mapData[0]?.location?.longitude ||
                    user?.location?.longitude,
                  latitudeDelta: 0.0422,
                  longitudeDelta: 0.0121,
                }}
                onLongPress={e => handleLongPress(e)}
                onPress={e => handlePress(e)}
                region={region}>
                {userMapLocation?.latitude && userMapLocation?.longitude && (
                  <Marker
                    coordinate={{
                      latitude: userMapLocation?.latitude,
                      longitude: userMapLocation?.longitude,
                    }}
                    title="{marker.title}"
                    description="{marker.description}">
                    <View style={styles.mapPointer}>
                      <Feather
                        name={'map-pin'}
                        color={Colors.success}
                        size={22}
                      />
                      <Text>{user.nick}</Text>
                    </View>
                  </Marker>
                )}
                {mapData.map(point => {
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
                      color = randomColor();
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

                  return (
                    <View key={point.id}>
                      <Marker
                        coordinate={{
                          latitude: point?.location?.latitude,
                          longitude: point?.location?.longitude,
                        }}
                        title={point.title ? point.title : ''}
                        description={
                          point.description ? point.description : ''
                        }>
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
      )}
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
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: 100,
  },
  button: {
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  buttonOuter: {
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
});
