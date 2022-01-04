import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {convertEpochSecondsToDateString} from '../../utils/dates';
import {CustomDivider} from '../../components/CustomDivider';
import {fetchData} from '../../utils/db';
import {EventType} from '../../types/Event';
import {MeetingPointType} from '../../types/MeetingPoint';
import {ActivityType} from '../../types/Activity';
import {handleType} from '../../utils/convertEventType';
import {Icon} from 'react-native-elements';

const EventPage: React.FunctionComponent<{
  event: EventType;
  onDelete(): void;
  onEdit(): number;
}> = ({event, onDelete, onEdit}) => {
  const [meetingPoints, setMeetingPoints] = useState<MeetingPointType[]>([]);
  const [activities, setActivities] = useState<ActivityType[]>([]);

  console.log('meetingPoints', meetingPoints);
  console.log('activities', activities);
  useEffect(() => {
    const fetch = async () => {
      const meetingPointData = await fetchData(
        'meetingPoints',
        'type',
        '==',
        'transport',
      );
      const activityData = await fetchData(
        'actions',
        'eventId',
        '==',
        event.id,
      );
      setMeetingPoints(meetingPointData.success);
      setActivities(activityData.success);
    };
    fetch();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headLine}>{`Event: ${handleType(event.type)}`}</Text>
      {!!event.city && <Text>{`By: ${event.city}`}</Text>}
      {(!!event.startDate || !!event.endDate) && (
        <>
          <CustomDivider />
          {!!event?.startDate && (
            <Text>
              {`Start: ${convertEpochSecondsToDateString(
                event.startDate?.seconds,
                'dddd D/MMMM h:mm',
              )}`}
            </Text>
          )}
          {!!event?.endDate && (
            <Text>
              {`Slut: ${convertEpochSecondsToDateString(
                event.endDate?.seconds,
                'dddd D/MMMM h:mm',
              )}`}
            </Text>
          )}
        </>
      )}
      {!!meetingPoints?.length > 0 && (
        <>
          <CustomDivider />
          <Text style={styles.headLine}>Mødesteder</Text>
          {meetingPoints.map(point => (
            <View key={point.id}>
              <Text>{`${point.point} kl: ${convertEpochSecondsToDateString(
                point.time.seconds,
                'h:mm',
              )}`}</Text>
            </View>
          ))}
        </>
      )}
      {!!activities?.length > 0 && (
        <>
          <CustomDivider />
          <Text style={styles.headLine}>Aktiviteter</Text>
          {activities.map(point => (
            <>
              <View key={point.id} style={styles.eventContainer}>
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
      <View style={styles.editContainer}>
        <Icon
          raised
          name="edit"
          type="font-awesome"
          color="#f50"
          onPress={() => onEdit()}
        />

        <Icon
          raised
          name="trash"
          type="font-awesome"
          color="#f50"
          onPress={() => onDelete()}
        />
      </View>
    </View>
  );
};

export default EventPage;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderColor: 'black',
    width: '90%',
    marginHorizontal: 5,
    marginVertical: 10,
    paddingVertical: 10,
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
  editContainer: {
    marginTop: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
