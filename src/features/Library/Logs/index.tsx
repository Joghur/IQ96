import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import Banner from '../../../components/Banner';
import Colors from '../../../constants/colors';

const Logs = () => {
  return (
    <View style={styles.container}>
      <Banner label={'De hellige Annaler'} />
      <Text>Coming up</Text>
    </View>
  );
};

export default Logs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    backgroundColor: Colors.light,
  },
});
