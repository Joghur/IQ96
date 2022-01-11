import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {ButtonWithIcon} from '../../components/ButtonWithIcon';
import {logOut} from '../../utils/auth';
import Colors from '../../constants/colors';
import packageJson from '../../../package.json';

function Settings() {
  console.log(packageJson.version); // "1.0.0"
  return (
    <View style={styles.container}>
      <Text>IQ96 app</Text>
      <Text>version {packageJson.version}</Text>
      <ButtonWithIcon
        title="Log ud"
        icon="power-off"
        onPress={() => logOut()}
      />
    </View>
  );
}

export default memo(Settings);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light,
  },
});
