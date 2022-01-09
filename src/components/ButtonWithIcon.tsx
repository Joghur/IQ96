import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import Colors from '../constants/colors';

export const ButtonWithIcon = ({title, icon, onPress}) => {
  return (
    <View style={styles.button}>
      <Button
        type="clear"
        title={title}
        containerStyle={styles.buttonContainerStyle}
        titleStyle={styles.titleStyle}
        icon={icon && <Icon name={icon} size={14} style={styles.icon} />}
        onPress={() => onPress()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainerStyle: {
    borderRadius: 20,
    width: 150,
    borderWidth: 1,
    borderColor: Colors.button,
  },
  button: {
    marginTop: 10,
  },
  titleStyle: {
    color: Colors.dark,
  },
  icon: {
    paddingRight: 10,
    color: Colors.button,
  },
});
