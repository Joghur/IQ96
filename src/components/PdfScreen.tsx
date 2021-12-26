import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import Pdf from 'react-native-pdf';

import {convertEpochSecondsToDateString} from '../utils/dates';

const PdfScreen = ({route}: any) => {
  const {media} = route.params;
  console.log('PdfScreen, media.uri', media.uri);

  const source = {
    uri: media.uri,
    cache: true,
  };
  return (
    <>
      {media.date && (
        <Text>
          {convertEpochSecondsToDateString(media.date, 'D/MMMM-YYYY')}
        </Text>
      )}
      {media.uri && (
        <View style={styles.pdfContainer}>
          <Pdf
            source={source}
            onError={error => {
              console.log('PDF error', error);
            }}
            style={styles.pdf}
          />
        </View>
      )}
    </>
  );
};

export default PdfScreen;

const styles = StyleSheet.create({
  pdfContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
