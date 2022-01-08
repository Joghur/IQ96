import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, Input, Text} from 'react-native-elements';

import {ActivityType} from '../../types/Event';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {countries} from '../../constants/countries';
import {editDocument, saveData} from '../../utils/db';
import Colors from '../../constants/colors';

const initialActivity: ActivityType = {
  meetingPlace: '',
  meetingTime: '',
  place: '',
  time: '',
};

const AddActivity = ({backLink, editable}) => {
  const [activity, setActivity] = useState(
    Object.keys(editable).length > 0 ? editable : initialActivity,
  );
  console.log('activity', activity);
  console.log('editable', editable);
  console.log('backLink', backLink);

  const handleChange = option => {
    console.log('handleChange activity, option', option);
    setActivity(oldActivity => ({
      ...oldActivity,
      [option.selectorType]: option.dbKey,
    }));
  };

  const handleSubmit = async params => {
    if (editable) {
      await editDocument('events', event.id, event);
    } else {
      await saveData('events', event);
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
            handleChange({dbKey: value, dbValue: 'meetingPlace'})
          }
        />

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

export default AddEvent;

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
