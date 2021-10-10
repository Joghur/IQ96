import React, {memo} from 'react';
import {StyleSheet, View, Text} from 'react-native';

import Banner from '../../components/Banner';
import Colors from '../../constants/colors';

function Chat() {
  return (
    <View style={styles.container}>
      <Banner label={'Chat'} />
      <Text>Coming up</Text>
    </View>
  );
}

export default memo(Chat);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    backgroundColor: Colors.aliceBlue,
  },
});
