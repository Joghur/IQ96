import React, {memo, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {FAB, Overlay} from 'react-native-elements';

import AddEvent from './AddEvent';
import Event from './Event';
// import AddActivity from '../Activities/AddActivity';
import Banner from '../../components/Banner';
import {fetchAll, deleteDocument} from '../../utils/db';
import {convertEpochSecondsToDateString} from '../../utils/dates';
import {handleType} from '../../utils/convertEventType';
import Colors from '../../constants/colors';
import {EventType} from '../../types/Event';

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
    activities: '',
    meetingPoints: '',
  };

  const [events, setEvents] = useState<EventType[]>([]);
  const [event, setEvent] = useState<EventType>(initEvent);
  const [page, setPage] = useState('main');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const eventsList = async () => {
      const eventData = await fetchAll('events');

      console.log('eventData ----------', eventData);
      if (eventData?.success) {
        const sortedData: EventType[] = eventData.success.sort((a, b) => {
          return a.startDate - b.startDate;
        });
        setEvents(sortedData);
      } else {
        console.log('Error happened in EventsHome: ', eventData.error);
        Alert.alert('Kunne ikke hente begivenheds data');
      }
    };
    eventsList();
  }, [page]);

  const toggleOverlay = item => {
    setEvent(events.filter(event => event.id === item.id)[0]);
    setVisible(!visible);
  };

  const handleDelete = () => {
    deleteDocument('events', event.id);
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
          icon={{name: 'add', size: 24, color: Colors.button}}
          buttonStyle={{
            backgroundColor: Colors.white,
            borderRadius: 50,
            borderColor: Colors.button,
          }}
          style={styles.floatingButton}
          titleStyle={{backgroundColor: 'red'}}
          placement="right"
          color={Colors.dark}
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
        {page === 'add' && (
          <AddEvent
            backLink={() => setPage('main')}
            // addActivity={() => setPage('activity')}
          />
        )}
        {page === 'edit' && (
          <AddEvent
            backLink={() => setPage('main')}
            // addActivity={() => setPage('activity')}
            editable
            editableEvent={event}
          />
        )}
        {/* {page === 'activity' && (
          <AddActivity
            backLink={() => setPage('edit')}
            setEvent={setEvent}
            editable
            editableEvent={event}
          />
        )} */}
      </View>
    </SafeAreaView>
  );
};

export default memo(EventsHome);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    backgroundColor: Colors.light,
  },
  bold: {
    fontWeight: 'bold',
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.button,
    borderWidth: 1,
    borderRadius: 20,
    width: '90%',
    marginHorizontal: 5,
    marginVertical: 10,
    paddingVertical: 10,
    elevation: 7,
    backgroundColor: Colors.white,
  },
  listText: {
    paddingLeft: 10,
    fontSize: 15,
  },
  floatingButton: {
    zIndex: 999,
  },
  overlay: {
    borderRadius: 50,
    elevation: 7,
  },
});
