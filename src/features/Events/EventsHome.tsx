import React, {memo, useEffect, useState} from 'react';
import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  QuerySnapshot,
  doc,
  col,

} from 'firebase/firestore/lite';
import short from 'short-uuid';

import Banner from '../../components/Banner';
import Event from './Event';
import Colors from '../../constants/colors';
import {app} from '../../utils/firebase';
import {convertEpochSecondsToDateString} from '../../utils/dates';
import {EventType} from '../../types/Event';

const EventsHome: React.FunctionComponent = ({navigation}) => {
  const db = getFirestore(app);

  const initEvent: EventType = {
    id: '',
    city: '',
    country: 'da',
    endDate: new Date(0),
    startDate: new Date(0),
    locale: '',
    type: '',
    year: 0,
  };

  const [events, setEvents] = useState<EventType[]>([]);
  const [event, setEvent] = useState<EventType>(initEvent);

  useEffect(() => {
    const eventsList = async () => {
      try {
        const eventsCollection = collection(db, 'events');
        const eventsSnapshot = await getDocs(eventsCollection);
        setEvents(
          eventsSnapshot.docs.map(doc => {
            const obj = doc.data();
            obj.id = doc.id;
            return obj;
          }),
        );
      } catch (e) {
        console.error('Error fetching documents: ', e);
      }
    };
    eventsList();
  }, []);

  console.log('1- events', events);
  console.log('2- event.id', event.id);

  return (
    <View style={styles.container}>
      <Banner label={'Næste begivenheder'} />
      <View style={styles.listContainer}>
        {events.length > 0 && (
          <FlatList
            data={events}
            keyExtractor={(ev: Event) => ev.id}
            renderItem={({item}) => (
              <Text
                style={styles.listText}
                onPress={() => {
                  setEvent(events.filter(event => event.id === item.id)[0]);
                }}>
                {convertEpochSecondsToDateString(
                  item?.startDate?.seconds,
                  'D/MMMM',
                )}
                {' - '}
                {item.type} {item.type === 'tour' && item.city}{' '}
              </Text>
            )}
          />
        )}
      </View>
      {!!event.id && <Event event={event} />}
    </View>
  );
};

export default memo(EventsHome);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    backgroundColor: Colors.aliceBlue,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 20,
    width: 250,
    textAlign: 'center',
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 20,
    width: '90%',
    marginHorizontal: 5,
    marginVertical: 5,
    paddingVertical: 10,
    elevation: 7,
    backgroundColor: 'white',
  },
  listText: {
    paddingLeft: 10,
    fontSize: 20,
  },
  tinyLogo: {
    alignItems: 'flex-start',
    width: 50,
    height: 50,
  },
});
