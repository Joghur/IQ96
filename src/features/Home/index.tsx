import React, {memo, useEffect, useLayoutEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Divider} from 'react-native-elements';

import Colors from '../../constants/colors';
import {fetchDocuments} from '../../utils/db';
import {
  convertEpochSecondsToDateString,
  fromNow,
  dayDiff,
} from '../../utils/dates';
import {handleType} from '../../utils/convertEventType';
import {EventType} from '../../types/Event';
import Event from '../Events/Event';
import Banner from '../../components/Banner';

function Home({navigation}) {
  const {t} = useTranslation();
  const [event, setEvent] = useState<EventType>();
  const [dateCounter, setDateCounter] = useState('');
  const [diff, setDiff] = useState(0);

  const eventsList = async () => {
    const eventData = await fetchDocuments('events');

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
  useLayoutEffect(() => {
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

  useLayoutEffect(() => {
    if (event?.startDate?.seconds) {
      setDateCounter(fromNow(event.startDate.seconds));
      setDiff(dayDiff(event.startDate.seconds));
    }
    if (event?.endDate?.seconds) {
      setDiff(dayDiff(event.endDate.seconds));
    }
  }, [event]);

  return (
    <View>
      <ScrollView>
        <Banner label={'Overblik'} />
        <View style={styles.container}>
          <Text style={styles.welcome}>{t('welcome')}</Text>
          <Divider orientation="horizontal" width={1} />
          <View style={styles.event}>
            <Text style={styles.upcomingEvent}>{t('upcoming')}</Text>
            {(!!event?.endDate || !!event?.startDate) && (
              <>
                {!!dateCounter && <Text>{dateCounter}</Text>}
                {diff < 9 && diff >= -4 && <Event event={event} />}
                {diff >= 9 && (
                  <>
                    <Text style={styles.upcomingEvent}>
                      {event?.type === 'tour'
                        ? `${handleType(event?.type)} de ${event.city}`
                        : handleType(event?.type)}
                    </Text>
                    <Text>
                      {convertEpochSecondsToDateString(
                        event?.startDate,
                        'D/MMM',
                      )}
                    </Text>
                  </>
                )}
              </>
            )}
            {!event?.endDate && !event?.startDate && (
              <>
                <Text style={styles.noUpcomingEvent}>{t('noDate')}</Text>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default memo(Home);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  upcomingEvent: {
    fontWeight: 'bold',
    marginTop: 15,
  },
  noUpcomingEvent: {
    alignContent: 'center',
    width: '50%',
  },
  event: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 100,
    height: '100%',
  },
});
