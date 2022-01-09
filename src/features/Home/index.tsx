import React, {memo, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';

import Colors from '../../constants/colors';
import {CustomDivider} from '../../components/CustomDivider';
import {fetchAll} from '../../utils/db';
import {
  convertEpochSecondsToDateString,
  fromNow,
  dayDiff,
} from '../../utils/dates';
import {handleType} from '../../utils/convertEventType';
import {EventType} from '../../types/Event';
import Event from '../Events/Event';

function Home({navigation}) {
  const {t} = useTranslation();
  const [event, setEvent] = useState<EventType>();
  const [dateCounter, setDateCounter] = useState('');
  const [diff, setDiff] = useState(0);

  console.log('Home - event', event);
  console.log('diff', diff);

  const eventsList = async () => {
    const eventData = await fetchAll('events');

    console.log('eventData ----------', eventData);
    if (eventData?.success) {
      const sortedData: EventType[] = eventData.success.sort((a, b) => {
        return a.startDate - b.startDate;
      });
      setEvent(sortedData[0]);
    } else {
      console.log('Error happened in Home: ', eventData.error);
      Alert.alert('Kunne ikke hente begivenheds data');
    }
  };
  useEffect(() => {
    eventsList();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      eventsList();
    });

    return () => {
      unsubscribe;
    };
  }, []);

  useEffect(() => {
    if (event?.startDate?.seconds) {
      setDateCounter(fromNow(event.startDate.seconds));
      setDiff(dayDiff(event.startDate.seconds));
    }
  }, [event]);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>{t('welcome')}</Text>
      <CustomDivider />
      <Text style={styles.upcomingEvent}>{t('upcoming')}</Text>
      {!!dateCounter && <Text>{dateCounter}</Text>}
      {diff < 7 && <Event event={event} />}
      {diff >= 7 && (
        <View style={styles.event}>
          <Text style={styles.upcomingEvent}>
            {event?.type === 'tour'
              ? `${handleType(event?.type)} de ${event.city}`
              : handleType(event?.type)}
          </Text>
          <Text>
            {convertEpochSecondsToDateString(event?.startDate, 'D/MMM')}
          </Text>
        </View>
      )}
    </View>
  );
}

export default memo(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  upcomingEvent: {
    fontWeight: 'bold',
  },
  event: {
    alignItems: 'center',
    marginTop: 20,
  },
});
