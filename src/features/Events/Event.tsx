import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';

import {convertEpochSecondsToDateString} from '../../utils/dates';
import {CustomDivider} from '../../components/CustomDivider';
import {EventType} from '../../types/Event';
import {handleType} from '../../utils/convertEventType';
import Colors from '../../constants/colors';

const EventPage: React.FunctionComponent<{
  event: EventType;
  onDelete(): void;
  onEdit(): number;
}> = ({event, onDelete, onEdit}) => {
  console.log('EventPage - event', event);

  if (!event) {
    return <></>;
  }

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
      {!!event.meetingPoints && (
        <>
          <CustomDivider />
          <Text style={styles.headLine}>Mødesteder</Text>
          <View style={styles.eventContainer}>
            <Text>{event.meetingPoints}</Text>
          </View>
        </>
      )}
      {!!event.activities && (
        <>
          <CustomDivider />
          <Text style={styles.headLine}>Aktiviteter</Text>
          <View style={styles.eventContainer}>
            <Text>{event.activities}</Text>
          </View>
        </>
      )}
      {onDelete && onEdit && (
        <View style={styles.editContainer}>
          <Icon
            raised
            name="edit"
            type="font-awesome"
            color={Colors.button}
            onPress={() => onEdit()}
          />

          <Icon
            raised
            name="trash"
            type="font-awesome"
            color={Colors.button}
            onPress={() => onDelete()}
          />
        </View>
      )}
    </View>
  );
};

export default EventPage;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderColor: Colors.dark,
    width: '90%',
    marginHorizontal: 5,
    marginVertical: 10,
    paddingVertical: 10,
    backgroundColor: Colors.light,
  },
  headLine: {
    fontWeight: 'bold',
  },
  //   eventContainer: {
  //     alignItems: 'center',
  //     borderColor: Colors.event,
  //     borderWidth: 1,
  //     borderRadius: 20,
  //     width: '80%',
  //     marginVertical: 5,
  //   },
  editContainer: {
    marginTop: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
