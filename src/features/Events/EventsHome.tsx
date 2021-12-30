import React, {memo, useEffect, useState} from 'react';
import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {fetchAll, saveData} from '../../utils/db';
import short from 'short-uuid';

import Banner from '../../components/Banner';
import Event from './Event';
import Colors from '../../constants/colors';
import {app} from '../../utils/firebase';
import {convertEpochSecondsToDateString} from '../../utils/dates';
import {EventType} from '../../types/Event';
import AddEvent from './AddEvent';
import FloatingButton from '../../components/FloatingButton';

const EventsHome: React.FunctionComponent = ({navigation}) => {
  const initEvent: EventType = {
    id: '',
    type: '',
    city: 'Kokkedal',
    country: 'da',
    endDate: new Date(0),
    startDate: new Date(0),
    timezone: 'Europe/Copenhagen',
    year: 0,
  };

  const [events, setEvents] = useState<EventType[]>([]);
  const [event, setEvent] = useState<EventType>(initEvent);
  const [page, setPage] = useState('main');

  useEffect(() => {
    const eventsList = async () => {
      const eventData = await fetchAll('events');
      if (eventData?.success) {
        setEvents(eventData.success);
      } else {
        console.log('Error happened in EventsHome: ', eventData?.error);
      }
    };
    eventsList();
  }, [page]);

  const handleType = type => {
    switch (type) {
      case 'tour':
        return 'Tour';
      case 'fg':
        return 'Frisbee Golf';
      case 'ol':
        return 'Ølympiske Lege';
      case 'gf':
        return 'Generalforsamling';
      default:
        return 'Andet arrangement';
    }
  };

  console.log('1- events', events);
  console.log('2- event.id', event.id);

  return (
    <View style={styles.container}>
      <Banner label={'Næste begivenheder'} />
      {page === 'main' && (
        <View style={styles.listContainer}>
          {events?.length > 0 && (
            <FlatList
              data={events}
              keyExtractor={(ev: Event) => ev.id}
              renderItem={({item}) => (
                <Text
                  style={styles.listText}
                  onPress={() => {
                    setEvent(
                      !event.id
                        ? events.filter(event => event.id === item.id)[0]
                        : [],
                    );
                  }}>
                  {convertEpochSecondsToDateString(
                    item?.startDate?.seconds,
                    'D/MMMM',
                  )}
                  {' - '}
                  {handleType(item.type)} {item.type === 'tour' && item.city}{' '}
                </Text>
              )}
            />
          )}
          {events?.length === 0 && (
            <Text>Ingen begivenheder eller intet internet</Text>
          )}
        </View>
      )}
      {page === 'add' && <AddEvent backLink={() => setPage('main')} />}
      {!!event.id && <Event event={event} />}
      {page !== 'add' && <FloatingButton onAdd={() => setPage('add')} />}
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
