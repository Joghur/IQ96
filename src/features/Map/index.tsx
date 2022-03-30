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
  const [iq96MapData, setIq96MapData] = useState<Location[]>([]);
  const [memberMapData, setMemberMapData] = useState<Location[]>([]);
  const [poisMapData, setPoisMapData] = useState<Location[]>([]);
  const [newPoi, setNewPoi] = useState<Location[]>([]);
  const [error, setError] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [region, setRegion] = useState(null);
  const [showModal, setShowModal] = useState<
    'add' | 'members' | 'iq96' | 'pois' | undefined
  >(undefined);
  const [editable, setEditable] = useState(false);
  const [editablePoi, setEditablePoi] = useState(null);

  const latitudeDelta = 0.005274980135240526;
  const longitudeDelta = 0.007509179413318634;

  console.log('userMapLocation', userMapLocation);
  console.log('mapData', mapData);
  console.log('mapData[0]', mapData[0]);
  console.log('user', user);
  console.log('newPoi', newPoi);
  console.log('showModal', showModal);

  const geo_success = info => {
    setUserMapLocation((old: Location) => ({
      ...old,
      latitude: info.coords.latitude,
      longitude: info.coords.longitude,
      latitudeDelta,
      longitudeDelta,
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

  useEffect(() => {
    const members = mapData
      .filter(d => d?.type === 'user')
      .sort((b, a) => b.nick > a.nick);

    const iq96s = mapData
      .filter(d => d?.madeBy === 'app')
      .sort((b, a) => b.nick > a.nick);

    const pois = mapData
      .filter(d => d?.madeBy === 'user')
      .sort((b, a) => b.nick > a.nick);
    console.log('pois', pois);
    setMemberMapData(() => members);
    setIq96MapData(() => iq96s);
    setPoisMapData(() => pois);
  }, [mapData]);

  const handleRegionChangeFromModal = loc => {
    console.log('loc', loc);
    console.log('editablePoi', editablePoi);
    if (editablePoi?.location) {
      setRegion(() => ({
        latitude: editablePoi?.location.latitude,
        longitude: editablePoi?.location.longitude,
        latitudeDelta,
        longitudeDelta,
      }));
      setShowModal(undefined);
    }
  };

  const handleRegionChange = point => {
    console.log('----------------------------handleRegionChange');
    const location = {
      latitude: null,
      longitude: null,
      latitudeDelta,
      longitudeDelta,
    };
    switch (point) {
      case 'user':
        setRegion(() => ({
          ...location,
          latitude: userMapLocation?.latitude || user?.location?.latitude,
          longitude: userMapLocation?.longitude || user?.location?.longitude,
          latitudeDelta,
          longitudeDelta,
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
            latitudeDelta,
            longitudeDelta,
          }));
        }
        break;
    }
  };

  const handlePress = e => {
    console.log(e.nativeEvent);
  };

  const handleButtonPress = p => {
    setEditablePoi(() => p);
    handleRegionChangeFromModal();
  };

  const handleLongPress = async e => {
    const location = e.nativeEvent.coordinate;
    setNewPoi(location);
    setShowModal('add');
  };

  const handleButtonLongPress = async point => {
    console.log('point', point);
    setEditable(true);
    setEditablePoi(point);
    setShowModal('add');
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
      {showModal === 'iq96' && (
        <>
          <View style={styles.buttonContainer}>
            {iq96MapData.map(p => {
              return (
                <View key={p.id} style={styles.button}>
                  <Pressable
                    onLongPress={() => handleButtonLongPress(p)}
                    onPress={() => handleButtonPress(p)}
                    //   handleRegionChange(p.title ? p.title : p.nick)
                    style={{
                      borderColor: 'red',
                      ...styles.button,
                    }}>
                    <Text style={styles.text}>
                      {p.title ? p.title : p.nick}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
          <View style={styles.cancelContainer}>
            <Pressable
              onPress={() => setShowModal(undefined)}
              style={{
                color: 'red',
                borderColor: 'red',
                ...styles.button,
              }}>
              <Text style={styles.text}>Fortryd</Text>
            </Pressable>
          </View>
        </>
      )}
      {showModal === 'members' && (
        <View style={styles.buttonContainer}>
          {memberMapData.map(p => {
            return (
              <View key={p.id} style={styles.button}>
                <Pressable
                  onLongPress={() => handleButtonLongPress(p)}
                  onPress={() => handleButtonPress('member', p)}
                  //   handleRegionChange(p.title ? p.title : p.nick)
                  style={{
                    color: p.madeBy === 'app' ? Colors.error : randomColor(),
                    borderColor:
                      p.madeBy === 'app' ? Colors.error : randomColor(),
                    ...styles.button,
                  }}>
                  <Text style={styles.text}>{p.title ? p.title : p.nick}</Text>
                </Pressable>
              </View>
            );
          })}

          <View style={styles.cancelContainer}>
            <Pressable
              onPress={() => setShowModal(undefined)}
              style={{
                color: 'red',
                borderColor: 'red',
                ...styles.button,
              }}>
              <Text style={styles.text}>Fortryd</Text>
            </Pressable>
          </View>
        </View>
      )}
      {showModal === 'pois' && (
        <>
          <View style={styles.buttonContainer}>
            {poisMapData.map(p => {
              return (
                <View key={p.id} style={styles.button}>
                  <Pressable
                    onLongPress={() => handleButtonLongPress(p)}
                    onPress={() => handleButtonPress(p)}
                    //   handleRegionChange(p.title ? p.title : p.nick)
                    style={{
                      borderColor: 'green',
                      ...styles.button,
                    }}>
                    <Text style={styles.text}>
                      {p.title ? p.title : p.nick}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
            <View style={styles.cancelContainer}>
              <Pressable
                onPress={() => setShowModal(undefined)}
                style={{
                  color: 'red',
                  borderColor: 'red',
                  ...styles.button,
                }}>
                <Text style={styles.text}>Fortryd</Text>
              </Pressable>
            </View>
          </View>
        </>
      )}
      {showModal === 'add' && (
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
            <View style={styles.buttonOuter}>
              <Pressable
                onPress={() => setShowModal('iq96')}
                style={{
                  color: randomColor(),
                  borderColor: 'red',
                  ...styles.button,
                }}>
                <Text>IQ96</Text>
              </Pressable>
            </View>
            <View style={styles.buttonOuter}>
              <Pressable
                onPress={() => setShowModal('members')}
                style={{
                  color: randomColor(),
                  borderColor: 'blue',
                  ...styles.button,
                }}>
                <Text>Med-Lemmer</Text>
              </Pressable>
            </View>
            <View style={styles.buttonOuter}>
              <Pressable
                onPress={() => setShowModal('pois')}
                style={{
                  color: randomColor(),
                  borderColor: 'green',
                  ...styles.button,
                }}>
                <Text>Steder</Text>
              </Pressable>
            </View>
            <View style={styles.buttonOuter}>
              <Pressable
                title="Refresh"
                onPress={() => fetchMapAndUserData()}
                style={{
                  color: randomColor(),
                  borderColor: 'brown',
                  ...styles.button,
                }}>
                <Text>Opdater</Text>
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
                    editablePoi?.location?.latitude ||
                    userMapLocation?.latitude ||
                    mapData[0]?.location?.latitude ||
                    user?.location?.latitude,
                  longitude:
                    editablePoi?.location?.longitude ||
                    userMapLocation?.longitude ||
                    mapData[0]?.location?.longitude ||
                    user?.location?.longitude,
                  latitudeDelta,
                  longitudeDelta,
                }}
                onRegionChangeComplete={e =>
                  console.log(e.latitudeDelta, e.longitudeDelta)
                }
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
  cancelContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
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
  text: {
    textShadowColor: 'red',
    fontSize: 18,
  },
});
