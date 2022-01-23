import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useRecoilValue} from 'recoil';

import Colors from '../../constants/colors';
import {userState} from '../../utils/appState';
import {CustomDivider} from '../../components/CustomDivider';
import User from '../../types/User';
import Banner from '../../components/Banner';

function Map() {
  const user: User = useRecoilValue(userState);

  console.log('user', user);

  return (
    <>
      <Banner label={'Kort'} />
      <View style={styles.container}>
        <Text>IQ96 kort</Text>
        <CustomDivider />
      </View>
    </>
  );
}

export default memo(Map);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light,
  },
});
