import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';

import Banner from '../../components/Banner';
import {ButtonWithIcon} from '../../components/ButtonWithIcon';
import {fetchDocument} from '../../utils/db';
import Colors from '../../constants/colors';

const iq96Url = 'https://iq96.dk';
const media = '/media';
const songFolder = '/pdf/song/';

function LibraryHome({navigation}: any) {
  const [song, setSong] = useState({});

  useEffect(() => {
    const fetchSong = async () => {
      const songData = await fetchDocument('pdf', 'song');
      if (songData.success) {
        setSong(songData.success);
      }
    };
    fetchSong();
  }, []);

  return (
    <View style={styles.container}>
      <Banner label={'Bibliotheket'} />
      <View style={styles.buttonContainer}>
        <ButtonWithIcon
          title="IQ Breve"
          icon="envelope"
          onPress={() => navigation.navigate('Letters')}
        />
        {song && (
          <ButtonWithIcon
            title="IQ Sangen"
            icon="music"
            onPress={() =>
              navigation.navigate('PdfScreen', {
                media: {
                  uri: iq96Url + media + songFolder + song.filename,
                },
              })
            }
          />
        )}
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
