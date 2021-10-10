import React, {memo} from 'react';
import {StyleSheet, View, Image, Text} from 'react-native';
import Colors from '../../constants/colors';

function Chat() {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          style={styles.tinyLogo}
          source={require('../../images/iqlogo_512.png')}
        />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View>
            <Text style={styles.headerText}>Med-lemmer</Text>
          </View>
          <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
        </View>
      </View>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 20,
    width: 250,
    textAlign: 'center',
  },
  tinyLogo: {
    alignItems: 'flex-start',
    width: 50,
    height: 50,
  },
});
