import React from 'react';
import {StyleSheet, View} from 'react-native';

import LETTERS from './lettersArray';
import Banner from '../../../components/Banner';
import {ButtonWithIcon} from '../../../components/ButtonWithIcon';
import Colors from '../../../constants/colors';
import {convertEpochSecondsToDateString} from '../../../utils/dates';

function Letters({navigation}: any) {
  return (
    <View style={styles.container}>
      <Banner label={'IQ Breve'} />
      <View style={styles.buttonContainer}>
        <ButtonWithIcon
          title={convertEpochSecondsToDateString(
            LETTERS[0].date,
            'D/MMMM-YYYY',
          )}
          primary
          onPress={() => navigation.navigate('PdfScreen', {media: LETTERS[0]})}
        />
      </View>
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
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 30,
  },
});
