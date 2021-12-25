import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {convertEpochSecondsToDateString} from '../../utils/dates';
import {CustomDivider} from '../../utils/ui';
import {app} from '../../utils/firebase';
import {EventType} from '../../types/Event';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore/lite';
import {MeetingPointType} from '../../types/MeetingPoint';
import {ActivityType} from '../../types/Activity';

const EventPage: React.FunctionComponent<{event: EventType}> = ({event}) => {
  const db = getFirestore(app);

  const [meetingPoints, setMeetingPoints] = useState<MeetingPointType[]>([]);
  const [activities, setActivities] = useState<ActivityType[]>([]);

  console.log('meetingPoints', meetingPoints);
  console.log('activities', activities);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const meetingPointsCollection = query(
          collection(db, 'meetingPoints'),
          where('type', '==', 'transport'),
        );
        const meetingPointsSnapshot = await getDocs(meetingPointsCollection);
        setMeetingPoints(
          meetingPointsSnapshot.docs.map(doc => {
            const obj = doc.data();
            obj.id = doc.id;
            return obj;
          }),
        );
        const activitiesCollection = query(
          collection(db, 'actions'),
          where('eventId', '==', event.id),
        );
        const activitiesSnapshot = await getDocs(activitiesCollection);
        setActivities(
          activitiesSnapshot.docs.map(doc => {
            const obj = doc.data();
            obj.id = doc.id;
            return obj;
          }),
        );
      } catch (e) {
        console.error('Error fetching documents: ', e);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headLine}>{`Event: ${event.type}`}</Text>
      <Text>{`By: ${event.city}`}</Text>
      {(event.startDate || event.endDate) && (
        <>
          <CustomDivider />
          {event?.startDate && (
            <Text>
              {`Start: ${convertEpochSecondsToDateString(
                event?.startDate?.seconds,
                'dddd D/MMMM h:mm',
              )}`}
            </Text>
          )}
          {event?.endDate && (
            <Text>
              {`Slut: ${convertEpochSecondsToDateString(
                event?.endDate?.seconds,
                'dddd D/MMMM h:mm',
              )}`}
            </Text>
          )}
        </>
      )}
      {meetingPoints.length > 0 && (
        <>
          <CustomDivider />
          <Text style={styles.headLine}>Mødesteder</Text>
          {meetingPoints.map(point => (
            <>
              <Text key={point.id}>{`${
                point.point
              } kl: ${convertEpochSecondsToDateString(
                point.time.seconds,
                'h:mm',
              )}`}</Text>
            </>
          ))}
        </>
      )}
      {activities.length > 0 && (
        <>
          <CustomDivider />
          <Text style={styles.headLine}>Aktiviteter</Text>
          {activities.map(point => (
            <>
              <View style={styles.eventContainer} key={point.id}>
                <Text>{`${point.title} kl: ${convertEpochSecondsToDateString(
                  point.time.seconds,
                  'h:mm',
                )}`}</Text>
                <Text>{`Noter: ${point.notes}`}</Text>
              </View>
            </>
          ))}
        </>
      )}
    </View>
  );
};

export default EventPage;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 20,
    width: '90%',
    marginHorizontal: 5,
    elevation: 7,
    backgroundColor: 'white',
  },
  headLine: {
    fontWeight: 'bold',
  },
  eventContainer: {
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 20,
    width: '80%',
    marginVertical: 5,
  },
});
