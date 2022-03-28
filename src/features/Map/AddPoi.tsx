import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import {Button, Input, Text} from 'react-native-elements';
import ModalSelector from 'react-native-modal-selector';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useRecoilValue} from 'recoil';
import {GeoPoint} from 'firebase/firestore/lite';

import {editDocument, saveData, deleteDocument} from '../../utils/db';
import Colors from '../../constants/colors';
import {userState} from '../../utils/appState';
import Location from '../../types/Location';

const initialPoi = {
  location: null,
  description: '',
  title: '',
  type: '',
  madeBy: 'user',
  nick: '',
};

let typeIndex = 0;
const typeSelectData = [
  {key: typeIndex++, section: true, label: 'Sted type'},
  {key: typeIndex++, selectorType: 'type', label: 'Bar', dbValue: 'bar'},
  {
    key: typeIndex++,
    selectorType: 'type',
    label: 'Restaurant',
    dbValue: 'restaurant',
  },
  {
    key: typeIndex++,
    selectorType: 'type',
    label: 'Musik',
    dbValue: 'music',
  },
  {
    key: typeIndex++,
    selectorType: 'type',
    label: 'Spændende sted',
    dbValue: 'sightseeing',
  },
  {
    key: typeIndex++,
    selectorType: 'type',
    label: 'Hotel',
    dbValue: 'hotel',
  },
  {
    key: typeIndex++,
    selectorType: 'type',
    label: 'Andet',
    dbValue: 'question',
  },
];

const AddPoi: React.Component<{
  backLink(): void;
  location: Location;
  editable: boolean;
  editablePoi: PoiType;
}> = ({backLink, location, editable = false, editablePoi = {}}) => {
  const user: User = useRecoilValue(userState);
  const [poi, setPoi] = useState<PoiType>(
    Object.keys(editablePoi).length > 0 ? editablePoi : initialPoi,
  );

  console.log('poi', poi);
  console.log('location', location);
  console.log('editablePoi', editablePoi);
  console.log('editable', editable);

  const handleChange = option => {
    setPoi(oldPoi => ({
      ...oldPoi,
      [option.selectorType]: option.dbValue,
    }));
  };

  const handleSubmit = async () => {
    if (!poi.nick || !poi.type) {
      Alert.alert('Du skal som minimum vælge en type og en titel');
      return;
    }
    if (!poi.description.includes('Tilføjet')) {
      poi.description += `${poi.description && ' - '}Tilføjet af ${user.nick}`;
    }
    if (!poi.location && location) {
      poi.location = new GeoPoint(
        Number(location.latitude),
        Number(location.longitude),
      );
    }
    if (!poi.title) {
      poi.title = poi.nick;
    }
    if (editable) {
      await editDocument('map', poi.id, poi);
    } else {
      await saveData('map', poi);
    }

    if (backLink) {
      backLink();
    }
  };

  const handleDelete = async () => {
    console.log('sdalæg-sdl');
    await deleteDocument('map', editablePoi.id);
    backLink();
  };

  const editor = user.isAdmin || user.isboard || user.isSuperAdmin;
  console.log('editor', editor);

  return (
    <View>
      <View style={styles.buttonContainer} />
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
          title={editable ? 'Opdatér sted' : 'Tilføj sted'}
          titleStyle={styles.submitButtonTitle}
          buttonStyle={styles.submitButton}
          containerStyle={styles.submitButtonContainer}
          onPress={() => handleSubmit()}
        />
      </View>
      <ScrollView>
        <View style={styles.headerTextContainer}>
          <Text h3 style={styles.headerText}>
            {editable ? 'Opdatér sted' : 'Tilføj nyt sted'}
          </Text>
        </View>
        <View style={styles.selectDropdown}>
          <View style={styles.icon}>
            <Icon name="location-pin" size={24} color={'blue'} />
          </View>
          <ModalSelector
            data={typeSelectData}
            initValue={poi?.type ? poi?.type : 'Vælg interessant sted'}
            onChange={option => {
              handleChange(option);
            }}
          />
        </View>
        <Input
          value={poi.city}
          placeholder={
            editablePoi ? editablePoi.nick : 'Indtast titel (vises på kortet)'
          }
          onChangeText={value =>
            handleChange({dbValue: value, selectorType: 'nick'})
          }
          errorMessage="Indtast titel (vises på kortet)"
          errorStyle={{color: 'black'}}
        />
        <Input
          value={poi.city}
          placeholder={
            editablePoi
              ? editablePoi.title
              : 'Indtast knap titel (vises også i popup)'
          }
          onChangeText={value =>
            handleChange({dbValue: value, selectorType: 'title'})
          }
          errorMessage="Indtast knap titel (vises også i popup)"
          errorStyle={{color: 'black'}}
        />
        <Input
          value={poi.city}
          placeholder={
            editablePoi
              ? editablePoi.title
              : 'Indtast beskrivelse (vises i popup)'
          }
          onChangeText={value =>
            handleChange({dbValue: value, selectorType: 'description'})
          }
          errorMessage="Indtast beskrivelse (vises i popup)"
          errorStyle={{color: 'black'}}
        />

        <Text> </Text>
        {editor && (
          <Button
            type="clear"
            title="Fjern"
            buttonStyle={styles.deleteButton}
            containerStyle={styles.deleteButtonContainer}
            onPress={() => handleDelete()}
          />
        )}
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
      </ScrollView>
    </View>
  );
};

export default AddPoi;

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
  deleteButton: {
    width: 170,
    height: 50,
    elevation: 1,
    backgroundColor: 'red',
  },
  deleteButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginRight: 10,
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
});
