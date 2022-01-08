import React from 'react';
import {Button, StyleSheet, View} from 'react-native';

import Banner from '../../../components/Banner';
import Colors from '../../../constants/colors';
import LETTERS from './lettersArray';
import {convertEpochSecondsToDateString} from '../../../utils/dates';

function Letters({navigation}: any) {
  return (
    <View style={styles.container}>
      <Banner label={'IQ Breve'} />
      <Button
        title={convertEpochSecondsToDateString(LETTERS[0].date, 'D/MMMM-YYYY')}
        onPress={() => navigation.navigate('PdfScreen', {media: LETTERS[0]})}
      />
    </View>
  );
}

export default Letters;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    backgroundColor: Colors.light,
  },
});
