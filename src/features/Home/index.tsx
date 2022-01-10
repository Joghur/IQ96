import React, {memo, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';

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

  const eventsList = async () => {
    const eventData = await fetchAll('events');

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
    if (event?.endDate?.seconds) {
      setDiff(dayDiff(event.endDate.seconds));
    }
  }, [event]);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>{t('welcome')}</Text>
      <CustomDivider />
      <Text style={styles.upcomingEvent}>{t('upcoming')}</Text>
      {(!!event?.endDate || !!event?.startDate) && (
        <>
          {!!dateCounter && <Text>{dateCounter}</Text>}
          {diff < 9 && diff >= -4 && <Event event={event} />}
          {diff >= 9 && (
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
        </>
      )}
      {!event?.endDate && !event?.startDate && (
        <>
          <Text style={styles.noUpcomingEvent}>{t('noDate')}</Text>
        </>
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
  noUpcomingEvent: {
    alignContent: 'center',
    width: '50%',
  },
  event: {
    alignItems: 'center',
    marginTop: 20,
  },
});
