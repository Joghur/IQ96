import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, Input, Text} from 'react-native-elements';

import {EventActivityType} from '../../types/Event';
import {ActivityType} from '../../types/Activity';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {fetchData, editDocument, saveData} from '../../utils/db';
import Colors from '../../constants/colors';

const initialActivity: ActivityType = {
  meetingPlace: '',
  meetingTime: '',
  place: '',
  time: '',
};

const AddActivity = ({
  backLink,
  editable,
  editableActivity,
  editableEvent,
  setEvent,
}) => {
  const [activity, setActivity] = useState<ActivityType>(
    editable ? editable : initialActivity,
  );
  const [activities, setActivities] = useState<EventActivityType[]>([]);
  console.log('activity', activity);
  console.log('editable', editable);
  console.log('editableEvent', editableEvent);

  useEffect(() => {
    const fetch = async () => {
      const activityData = await fetchData(
        'activities',
        'id',
        '==',
        editableEvent.id,
      );
      setActivities(activityData.success);
    };
    fetch();
  }, []);

  const handleChange = option => {
    console.log('handleChange activity, option', option);
    setActivity(oldActivity => ({
      ...oldActivity,
      [option.dbKey]: option.dbValue,
    }));
  };

  const handleSubmit = async () => {
    if (activity?.id) {
      await editDocument('activities', editableActivity.id, activity);
    } else {
      await saveData('activities', activity);
      let activities = [];
      if (editableEvent?.activities?.length > 0) {
        activities = editableEvent?.activities;
      }
      activities.push(id);
      setEvent(oldEvent => ({...oldEvent, activities}));
    }
    backLink();
  };

  return (
    <View>
      <ScrollView>
        <View style={styles.buttonContainer}></View>
        <View style={styles.headerTextContainer}>
          <Text h3 style={styles.headerText}>
            Tilføj ny aktivitet
          </Text>
        </View>
        <Input
          value={activity.meetingPlace}
          placeholder="Indtast Mødested"
          leftIcon={<Icon name="location-city" size={24} color={Colors.dark} />}
          onChangeText={value =>
            handleChange({dbKey: 'meetingPlace', dbValue: value})
          }
        />
        {activities.map(act => (
          <Text>
            {act.id} - {act.name}
          </Text>
        ))}

        <View style={styles.submitButtonContainer}>
          <Button
            raised
            title="Tilbage"
            buttonStyle={styles.submitButton}
            type="clear"
            containerStyle={styles.submitButtonContainer}
            onPress={() => backLink()}
          />
          <Button
            raised
            title="Tilføj begivenhed"
            onPress={() => handleSubmit()}
            buttonStyle={styles.submitButton}
            type="clear"
            containerStyle={styles.submitButtonContainer}
            titleStyle={styles.submitButtonTitle}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default AddActivity;

const styles = StyleSheet.create({
  headerTextContainer: {
    alignItems: 'center',
  },
  headerText: {
    color: Colors.dark,
  },
  //   icon: {
  //     paddingRight: 7,
  //   },
  submitButton: {
    width: 150,
    height: 50,
    elevation: 1,
    backgroundColor: 'transparent',
  },
  submitButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginRight: 10,
  },
  submitButtonTitle: {
    color: Colors.button,
  },
});
