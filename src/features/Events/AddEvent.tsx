import React, {useState, useEffect} from 'react';
import {Platform, ScrollView, StyleSheet, View} from 'react-native';
import {Button, Input, Text} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import ModalSelector from 'react-native-modal-selector';

import {EventType} from '../../types/Event';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {countries} from '../../constants/countries';
import {convertEpochSecondsToDateString} from '../../utils/dates';
import {editDocument, saveData} from '../../utils/db';
import {handleType} from '../../utils/convertEventType';
import Colors from '../../constants/colors';

const initialEvent: EventType = {
  type: '',
  city: 'Kokkedal',
  country: 'Danmark',
  startDate: '',
  endDate: '',
  timezone: 'Europe/Copenhagen',
  year: 0,
};

let typeIndex = 0;
const typeSelectData = [
  {key: typeIndex++, section: true, label: 'Begivenhed'},
  {key: typeIndex++, selectorType: 'type', label: 'Tour', dbKey: 'tour'},
  {
    key: typeIndex++,
    selectorType: 'type',
    label: 'Generalforsamling',
    dbKey: 'gf',
  },
  {
    key: typeIndex++,
    selectorType: 'type',
    label: 'Ølympiske Lege',
    dbKey: 'ol',
  },
  {
    key: typeIndex++,
    selectorType: 'type',
    label: 'Frisbee Golf',
    dbKey: 'fg',
  },
  {
    key: typeIndex++,
    selectorType: 'type',
    label: 'Andet arrangement',
    dbKey: 'andet',
  },
];

type startOrEndDates = 'startDate' | 'endDate';

const AddEvent = ({backLink, editable = false, editableEvent = {}}) => {
  const [event, setEvent] = useState(
    Object.keys(editableEvent).length > 0 ? editableEvent : initialEvent,
  );
  const [countryLocale, setCountryLocale] = useState([]);
  const [isDatePickerShow, setIsDatePickerShow] = useState(false);
  const [isTimePickerShow, setIsTimePickerShow] = useState(false);
  const [isStartOrEnd, setIsStartOrEnd] =
    useState<startOrEndDates>('startDate');
  const [date, setDate] = useState(new Date(Date.now()));
  console.log('event', event);
  console.log('isDatePickerShow', isDatePickerShow);
  console.log('date', date);
  console.log('isStartOrEnd', isStartOrEnd);
  console.log('editableEvent', editableEvent);
  console.log('editable', editable);
  console.log('backLink', backLink);

  useEffect(() => {
    const countrySelectData = countries.map((country, index) => {
      if (country.label) {
        return {key: index, section: true, label: country.label};
      }
      return {
        key: index,
        selectorType: 'country',
        label: country.country,
        dbKey: country.country,
        timezone: country.timezone,
      };
    });
    setCountryLocale(countrySelectData);
  }, []);

  const handleChange = option => {
    console.log('handleChange, option', option);
    setEvent(oldEvent => ({
      ...oldEvent,
      [option.selectorType]: option.dbKey,
    }));
    if (option.timezone) {
      setEvent(oldEvent => ({
        ...oldEvent,
        timezone: option.timezone,
      }));
    }
  };

  const handleSubmit = async params => {
    if (editable) {
      await editDocument('events', event.id, event);
    } else {
      await saveData('events', event);
    }
    backLink();
  };

  const showPicker = (value: startOrEndDates) => {
    console.log('showPicker value-------------', value);
    setIsDatePickerShow(() => true);
    setIsStartOrEnd(() => value);
  };

  const onChangeDate = event => {
    if (event.type === 'set') {
      console.log(
        'onChangeDate - event.nativeEvent.timestamp',
        event.nativeEvent.timestamp,
      );
      setDate(event.nativeEvent.timestamp);
      setEvent(oldEvent => ({
        ...oldEvent,
        [isStartOrEnd]: event.nativeEvent.timestamp,
        year: convertEpochSecondsToDateString(
          event.nativeEvent.timestamp.getTime() / 1000,
          'YYYY',
          event.timezone,
        ),
      }));
      if (isDatePickerShow) {
        setIsTimePickerShow(true);
        setIsDatePickerShow(false);
      }
      if (isTimePickerShow) setIsTimePickerShow(false);
    }
  };

  return (
    <View>
      <ScrollView>
        <View style={styles.buttonContainer}></View>
        <View style={styles.headerTextContainer}>
          <Text h3 style={styles.headerText}>
            Tilføj ny begivenhed
          </Text>
        </View>
        <View style={styles.selectDropdown}>
          <View style={styles.icon}>
            <Icon name="event" size={24} color={Colors.dark} />
          </View>
          <ModalSelector
            data={typeSelectData}
            initValue={event?.type ? handleType(event?.type) : 'Begivenhed'}
            onChange={option => {
              handleChange(option);
            }}
          />
        </View>
        <Input
          value={event.city}
          placeholder="Indtast destinations by"
          leftIcon={<Icon name="location-city" size={24} color={Colors.dark} />}
          onChangeText={value =>
            handleChange({dbKey: value, selectorType: 'city'})
          }
        />
        <View style={styles.selectDropdown}>
          <View style={styles.icon}>
            <Icon name="flag" size={24} color={Colors.dark} />
          </View>
          <ModalSelector
            data={countryLocale}
            initValue={event.country}
            onChange={option => {
              handleChange(option);
            }}
          />
        </View>

        <View style={styles.dateContainer}>
          <Icon name="flight-takeoff" size={24} colo={Colors.dark} />
          <View style={styles.dateButtonContainer}>
            <Button
              icon={{
                name: 'sentiment-very-satisfied',
                size: 18,
                color: Colors.success,
              }}
              title="Start dato"
              type="outline"
              onPress={() => showPicker('startDate')}
            />
          </View>
          <View on style={styles.pickedDateContainer}>
            {!!event?.startDate && (
              <Text
                style={styles.pickedDate}
                onPress={() => showPicker('startDate')}>
                {`${convertEpochSecondsToDateString(
                  event.startDate?.seconds
                    ? event.startDate.seconds
                    : event.startDate.getTime() / 1000,
                  'D/MMMM-YYYY HH:mm',
                  event.timezone,
                )}`}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.dateContainer}>
          <Icon name="flight-land" size={24} color={Colors.dark} />
          <View style={styles.dateButtonContainer}>
            <Button
              icon={{
                name: 'sick',
                size: 18,
                color: Colors.error,
              }}
              type="outline"
              title="Slut dato"
              onPress={() => showPicker('endDate')}
            />
          </View>
          <View on style={styles.pickedDateContainer}>
            {!!event?.endDate && (
              <Text
                style={styles.pickedDate}
                onPress={() => showPicker('endDate')}>
                {convertEpochSecondsToDateString(
                  event.endDate?.seconds
                    ? event.endDate.seconds
                    : event.endDate.getTime() / 1000,
                  'D/MMMM-YYYY HH:mm',
                  event.timezone,
                )}
              </Text>
            )}
          </View>

          {isDatePickerShow && (
            <DateTimePicker
              value={date}
              mode={'date'}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              is24Hour={true}
              onChange={value => onChangeDate(value)}
              style={styles.datePicker}
            />
          )}
          {isTimePickerShow && (
            <DateTimePicker
              value={date}
              mode={'time'}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              is24Hour={true}
              onChange={value => onChangeDate(value)}
              style={styles.datePicker}
            />
          )}
        </View>
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
  selectDropdown: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 10,
  },
  icon: {
    paddingRight: 7,
  },
  dateContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  pickedDateContainer: {
    padding: 15,
    borderRadius: 10,
  },
  pickedDate: {
    color: Colors.dark,
  },
  dateButtonContainer: {
    width: 120,
    padding: 5,
  },
  // This only works on iOS
  datePicker: {
    width: 320,
    height: 260,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
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
