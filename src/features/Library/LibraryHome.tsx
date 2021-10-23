import React from 'react';
import {Button, StyleSheet, View} from 'react-native';

import Banner from '../../components/Banner';
import Colors from '../../constants/colors';
import {SONG} from './song';

function LibraryHome({navigation}: any) {
  return (
    <View style={styles.container}>
      <Banner label={'Bibliotheket'} />
      <Button title="IQ Breve" onPress={() => navigation.navigate('Letters')} />
      <Button
        title="Love og Vedtægter"
        onPress={() => navigation.navigate('Laws')}
      />
      <Button
        title="IQ Sangen"
        onPress={() =>
          navigation.navigate('PdfScreen', {
            media: SONG,
          })
        }
      />
      <Button
        title="GF referat"
        onPress={() => navigation.navigate('Summary')}
      />
      <Button
        title="De hellige Annaler"
        onPress={() => navigation.navigate('Logs')}
      />
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
