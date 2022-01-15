import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

import Colors from '../constants/colors';

const Banner = (props: {
  label:
    | boolean
    | React.ReactChild
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;
}) => {
  return (
    <View style={styles.headerContainer}>
      <Image
        style={styles.tinyLogo}
        source={require('../images/iqlogo_512.png')}
      />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View>
          <Text style={styles.headerText}>{props.label}</Text>
        </View>
        <View style={{flex: 1, height: 1, backgroundColor: Colors.dark}} />
      </View>
    </View>
  );
};

export default Banner;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    backgroundColor: Colors.light,
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
