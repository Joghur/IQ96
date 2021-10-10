import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

const Banner = props => {
  return (
    <View style={styles.headerContainer}>
      <Image
        style={styles.tinyLogo}
        source={require('../images/iqlogo_512.png')}
      />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View>
          <Text style={styles.headerText}>{props.children}</Text>
        </View>
        <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
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
