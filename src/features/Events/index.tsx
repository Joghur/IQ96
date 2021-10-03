import React, {memo, useEffect, useState} from 'react';
// import {useTranslation} from 'react-i18next';
import {StyleSheet, View, Image, Text, FlatList} from 'react-native';
import {getFirestore, collection, getDocs} from 'firebase/firestore/lite';
import Colors from '../../constants/colors';
import {app} from '../../utils/firebase';
import {convertEpochSecondsToDateString} from '../../utils/dates';

type Event = {
  id?: string;
  city: string;
  country: string;
  endDate: datetime;
  startDate: datetime;
  locale: string;
  type: string;
  year: number;
};

function Events() {
  //   const {t} = useTranslation();
  const db = getFirestore(app);

  const initEvent = {
    id: '',
    city: '',
    country: 'da',
    endDate: new Date(0),
    startDate: new Date(0),
    locale: '',
    type: '',
    year: 0,
  };

  const [events, setEvents] = useState<Event[]>([]);
  const [event, setEvent] = useState<Event>(initEvent);

  useEffect(() => {
    const eventsList = async () => {
      try {
        const eventsCollection = collection(db, 'events');
        const eventsSnapshot = await getDocs(eventsCollection);
        setEvents(
          eventsSnapshot.docs.map(doc => {
            const obj: Event = doc.data();
            obj.id = doc.id;
            return obj;
          }),
        );
      } catch (e) {
        console.error('Error adding document: ', e);
      }
    };
    eventsList();
  }, []);

  console.log('event', event);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          style={styles.tinyLogo}
          source={require('../../images/iqlogo_512.png')}
        />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View>
            <Text style={styles.headerText}>Næste begivenheder</Text>
          </View>
          <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
        </View>
      </View>
      <View style={styles.listContainer}>
        {events.length > 0 && (
          <FlatList
            data={events}
            keyExtractor={ev => ev.id}
            renderItem={({item}) => (
              <Text
                style={styles.listText}
                onPress={item => {
                  console.log('events[item.id]', events[item.id]);
                  setEvent(events[item.id]);
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
      {/* <Text>Event type: {events && events[0]?.type}</Text> */}
      {/* <Text>By: {events && events[0]?.city}</Text> */}
      {/* <Text>Start: {events && events[0]?.startDate}</Text> */}
      {/* <Text>Slut: {events && events[0]?.endDate}</Text> */}
      <Text>Test</Text>
    </View>
  );
}

export default memo(Events);

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
    width: '100%',
    marginHorizontal: 5,
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
