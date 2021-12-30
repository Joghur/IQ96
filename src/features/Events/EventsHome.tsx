import React, {memo, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {fetchAll, saveData} from '../../utils/db';
import short from 'short-uuid';

import Banner from '../../components/Banner';
import Event from './Event';
import Colors from '../../constants/colors';
import {app} from '../../utils/firebase';
import {convertEpochSecondsToDateString} from '../../utils/dates';
import {EventType} from '../../types/Event';
import AddEvent from './AddEvent';
// import {CustomSpeedDial} from '../../components/CustomSpeedDial';
import {handleType} from '../../utils/convertEventType';
import {FAB} from 'react-native-elements';

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

      // const sortedData = eventData.sort(())

      if (eventData?.success) {
        setEvents(eventData.success);
      } else {
        console.log('Error happened in EventsHome: ', eventData?.error);
      }
    };
    eventsList();
  }, [page]);

  console.log('1- events', events);
  console.log('2- event.id', event.id);

  return (
    <SafeAreaView style={styles.container}>
      <Banner label={'Næste begivenheder'} />
      {page === 'main' && (
        <View>
          {events?.length > 0 && (
            <FlatList
              data={events}
              keyExtractor={(ev: Event) => ev.id}
              renderItem={({item}) => (
                <View style={styles.listItemContainer}>
                  <Text
                    style={styles.listText}
                    onPress={() => {
                      setEvent(
                        () => events.filter(event => event.id === item.id)[0],
                      );
                    }}>
                    <Text style={styles.bold}>
                      {convertEpochSecondsToDateString(
                        item?.startDate?.seconds,
                        'D/MMMM-YYYY',
                      )}
                    </Text>
                    {' - '}
                    {handleType(item.type)} {item.type === 'tour' && item.city}{' '}
                  </Text>
                </View>
              )}
            />
          )}
          {events?.length === 0 && (
            <Text>Ingen begivenheder eller intet internet</Text>
          )}
          {!!event.id && <Event event={event} />}
        </View>
      )}
      {page === 'add' && <AddEvent backLink={() => setPage('main')} />}
      {page !== 'add' && (
        <FAB
          placement="right"
          icon={{
            name: 'add',
            color: Colors.white,
          }}
          onPress={() => setPage('add')}
          style={{zIndex: 1000}}
        />
      )}
    </SafeAreaView>
  );
};

export default memo(EventsHome);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    backgroundColor: Colors.aliceBlue,
  },
  bold: {
    fontWeight: 'bold',
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
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 20,
    width: '90%',
    marginHorizontal: 5,
    marginVertical: 10,
    paddingVertical: 10,
    elevation: 7,
    backgroundColor: 'white',
  },
  listText: {
    paddingLeft: 10,
    fontSize: 15,
  },
  tinyLogo: {
    alignItems: 'flex-start',
    width: 50,
    height: 50,
  },
});
