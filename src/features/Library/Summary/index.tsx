import React from 'react';
import {Text, StyleSheet, View} from 'react-native';

import Banner from '../../../components/Banner';
import Colors from '../../../constants/colors';

const Summary = () => {
  return (
    <View style={styles.container}>
      <Banner label={'GF referat'} />
      <Text>Coming up</Text>
    </View>
  );
};

export default Summary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    backgroundColor: Colors.aliceBlue,
  },
});
