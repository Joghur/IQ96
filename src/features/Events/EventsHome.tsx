import React, {memo, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {fetchAll} from '../../utils/db';

import Banner from '../../components/Banner';
import Event from './Event';
import Colors from '../../constants/colors';
import {convertEpochSecondsToDateString} from '../../utils/dates';
import {EventType} from '../../types/Event';
import AddEvent from './AddEvent';
import {handleType} from '../../utils/convertEventType';
import {FAB, Overlay} from 'react-native-elements';
import {deleteCollection} from '../../utils/db';

const EventsHome: React.FunctionComponent = () => {
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
  const [visible, setVisible] = useState(false);

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

  const toggleOverlay = item => {
    setEvent(events.filter(event => event.id === item.id)[0]);
    setVisible(!visible);
  };

  const handleDelete = () => {
    deleteCollection('events', event.id);
    setEvents(oldEvents => {
      return oldEvents.filter(oldEvent => event.id !== oldEvent.id);
    });
    setEvent(initEvent);
    setVisible(false);
  };

  const onEdit = () => {
    setPage('edit');
    setVisible(false);
  };

  const onDelete = () => {
    Alert.alert(
      'Fjern begivenhed',
      'Er du sikker på at du vil slette denne begivenhed?',
      [
        {
          text: 'Fortryd',
          onPress: () => setVisible(false),
          style: 'cancel',
        },
        {text: 'Ja', onPress: () => handleDelete()},
      ],
    );
  };

  console.log('1- events', events);
  console.log('2- event.id', event?.id);
  console.log('2b- event', event);
  console.log('3- page', page);

  return (
    <SafeAreaView style={styles.container}>
      <Banner label={'Næste begivenheder'} />
      {page !== 'add' && page !== 'edit' && (
        <FAB
          icon={{name: 'add', color: Colors.aliceBlue}}
          style={styles.floatingButton}
          placement="right"
          color={'black'}
          onPress={() => setPage('add')}
        />
      )}
      <View>
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
                      onPress={() => toggleOverlay(item)}>
                      <Text style={styles.bold}>
                        {item?.startDate?.seconds
                          ? convertEpochSecondsToDateString(
                              item.startDate.seconds,
                              'D/MMMM-YYYY',
                            )
                          : 'Ukendt dato'}
                      </Text>
                      <Text>
                        {' '}
                        {handleType(item.type)}
                        {item.type === 'tour' && ` de ${item.city}`}
                      </Text>
                    </Text>
                  </View>
                )}
              />
            )}
            {events?.length === 0 && (
              <Text>Ingen begivenheder eller intet internet</Text>
            )}
            <Overlay
              isVisible={visible}
              onBackdropPress={toggleOverlay}
              overlayStyle={styles.overlay}>
              {!!event?.id && (
                <Event event={event} onDelete={onDelete} onEdit={onEdit} />
              )}
            </Overlay>
          </View>
        )}
        {page === 'add' && <AddEvent backLink={() => setPage('main')} />}
        {page === 'edit' && (
          <AddEvent
            backLink={() => setPage('main')}
            editable
            editableEvent={event}
          />
        )}
      </View>
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
  floatingButton: {
    zIndex: 999,
    borderRadius: 50,
    borderWidth: 10,
  },
  overlay: {
    borderRadius: 50,
    elevation: 7,
  },
});
