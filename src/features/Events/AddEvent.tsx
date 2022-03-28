import React, {useState, useEffect} from 'react';
import {Platform, ScrollView, StyleSheet, View} from 'react-native';
import {Button, Input, Text} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import ModalSelector from 'react-native-modal-selector';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {EventType} from '../../types/Event';
import {convertEpochSecondsToDateString} from '../../utils/dates';
import {editDocument, saveData} from '../../utils/db';
import {handleType} from '../../utils/convertEventType';
import {countries} from '../../constants/countries';
import Colors from '../../constants/colors';

const initialEvent: EventType = {
  type: '',
  city: 'Kokkedal',
  country: 'Danmark',
  startDate: '',
  endDate: '',
  timezone: 'Europe/Copenhagen',
  year: 0,
  activities: `
  KL. 13 - Guided tur i byen, mødested udenfor hotellet kl. 12:45
  KL. 18 - Restaurant, mødested udenfor hotellet kl. 17:45
  `,
  meetingPoints: `
  Kokkedal ved Centerpubben kl. 14
  Hovedbanegården under uret kl. 15
  `,
};

let typeIndex = 0;
const typeSelectData = [
  {key: typeIndex++, section: true, label: 'Begivenhed'},
  {key: typeIndex++, selectorType: 'type', label: 'Tour', dbValue: 'tour'},
  {
    key: typeIndex++,
    selectorType: 'type',
    label: 'Generalforsamling',
    dbValue: 'gf',
  },
  {
    key: typeIndex++,
    selectorType: 'type',
    label: 'Ølympiske Lege',
    dbValue: 'ol',
  },
  {
    key: typeIndex++,
    selectorType: 'type',
    label: 'Frisbee Golf',
    dbValue: 'fg',
  },
  {
    key: typeIndex++,
    selectorType: 'type',
    label: 'Andet arrangement',
    dbValue: 'andet',
  },
];

type startOrEndDates = 'startDate' | 'endDate';

const AddEvent: React.Component<{
  backLink(): void;
  editable: boolean;
  editableEvent: EventType;
}> = ({
  backLink,
  //   addActivity,
  editable = false,
  editableEvent = {},
}) => {
  const [event, setEvent] = useState<EventType>(
    Object.keys(editableEvent).length > 0 ? editableEvent : initialEvent,
  );
  const [countryLocale, setCountryLocale] = useState([]);
  const [isDatePickerShow, setIsDatePickerShow] = useState(false);
  const [isTimePickerShow, setIsTimePickerShow] = useState(false);
  const [isStartOrEnd, setIsStartOrEnd] =
    useState<startOrEndDates>('startDate');
  const [date, setDate] = useState(
    editableEvent?.startDate?.seconds > 0
      ? new Date(editableEvent.startDate.seconds * 1000)
      : new Date(Date.now()),
  );

  useEffect(() => {
    const countrySelectData = countries.map((country, index) => {
      if (country.label) {
        return {key: index, section: true, label: country.label};
      }
      return {
        key: index,
        selectorType: 'country',
        label: country.country,
        dbValue: country.country,
        timezone: country.timezone,
      };
    });
    setCountryLocale(countrySelectData);
  }, []);

  const handleChange = option => {
    setEvent(oldEvent => ({
      ...oldEvent,
      [option.selectorType]: option.dbValue,
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
    if (backLink) {
      backLink();
    }
  };

  const showPicker = (value: startOrEndDates) => {
    setIsDatePickerShow(() => true);
    setIsStartOrEnd(() => value);
  };

  const onChangeDate = event => {
    if (event.type === 'set') {
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
      <View style={styles.buttonContainer}></View>
      <View style={styles.submitButtonContainer}>
        <Button
          type="clear"
          raised
          title="Tilbage"
          buttonStyle={styles.submitButton}
          containerStyle={styles.submitButtonContainer}
          onPress={() => backLink()}
        />
        <Button
          type="clear"
          raised
          title={editable ? 'Opdatér begivenhed' : 'Tilføj begivenhed'}
          titleStyle={styles.submitButtonTitle}
          buttonStyle={styles.submitButton}
          containerStyle={styles.submitButtonContainer}
          onPress={() => handleSubmit()}
        />
      </View>
      <ScrollView>
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
            handleChange({dbValue: value, selectorType: 'city'})
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
        <View on style={styles.inputContainer}>
          <Input
            multiline
            value={event.meetingPoints}
            placeholder="Mødesteder"
            leftIcon={
              <>
                <Icon name="place" size={24} color={Colors.dark} />
                <Icon name="groups" size={24} color={Colors.dark} />
                <Icon name="train" size={24} color={Colors.dark} />
              </>
            }
            onChangeText={value =>
              handleChange({dbValue: value, selectorType: 'meetingPoints'})
            }
          />
        </View>
        <View on style={styles.inputContainer}>
          <Input
            multiline
            value={event.activities}
            placeholder="Aktiviteter"
            leftIcon={
              <>
                <Icon name="nightlife" size={24} color={Colors.dark} />
                <Icon name="restaurant" size={24} color={Colors.dark} />
              </>
            }
            onChangeText={value =>
              handleChange({dbValue: value, selectorType: 'activities'})
            }
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
    width: 170,
    height: 50,
    elevation: 1,
    backgroundColor: 'transparent',
  },
  submitButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginRight: 10,
  },
  submitButtonTitle: {
    color: Colors.button,
  },
  inputContainer: {
    marginTop: 10,
  },
});
