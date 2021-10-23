import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

import Banner from '../../components/Banner';
import Colors from '../../constants/colors';

function LibraryHome({navigation}) {
  return (
    <View style={styles.container}>
      <Banner label={'Bibliotheket'} />
      <Text>Coming up</Text>
      <Button title="IQ Breve" onPress={() => navigation.navigate('Letters')} />
    </View>
  );
}

export default LibraryHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    backgroundColor: Colors.aliceBlue,
  },
});
