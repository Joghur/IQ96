import React from 'react';
import {StyleSheet, View} from 'react-native';

import {SONG} from './song';
import Banner from '../../components/Banner';
import {ButtonWithIcon} from '../../components/ButtonWithIcon';
import Colors from '../../constants/colors';

function LibraryHome({navigation}: any) {
  return (
    <View style={styles.container}>
      <Banner label={'Bibliotheket'} />
      <View style={styles.buttonContainer}>
        <ButtonWithIcon
          title="IQ Breve"
          icon="envelope"
          onPress={() => navigation.navigate('Letters')}
        />
        <ButtonWithIcon
          title="IQ Sangen"
          icon="music"
          onPress={() =>
            navigation.navigate('PdfScreen', {
              media: SONG,
            })
          }
        />
        {/* <Button
        title="Love og Vedtægter"
        onPress={() => navigation.navigate('Laws')}
    /> */}
        {/* <Button
        title="GF referat"
        onPress={() => navigation.navigate('Summary')}
    /> */}
        {/* <Button
        title="De hellige Annaler"
        onPress={() => navigation.navigate('Logs')}
    /> */}
      </View>
    </View>
  );
}

export default LibraryHome;

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
