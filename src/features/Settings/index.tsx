import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useRecoilValue} from 'recoil';

import {ButtonWithIcon} from '../../components/ButtonWithIcon';
import {logOut} from '../../utils/auth';
import Colors from '../../constants/colors';
import packageJson from '../../../package.json';
import {userState} from '../../utils/appState';
import {CustomDivider} from '../../components/CustomDivider';
import User from '../../types/User';
import Banner from '../../components/Banner';

function Settings() {
  const user: User = useRecoilValue(userState);

  console.log('user', user);

  return (
    <>
      <Banner label={'Indstillinger'} />
      <View style={styles.container}>
        {user && (
          <>
            {user.isBoard && (
              <Text style={{...styles.bold, ...styles.italic, ...styles.board}}>
                Er i bestyrelsen
              </Text>
            )}
            {user.isAdmin && (
              <Text style={{...styles.bold, ...styles.italic, ...styles.it}}>
                IT afdelingen
              </Text>
            )}
            <Text style={styles.bold}>{user.name}</Text>
            <Text style={styles.italic}>{user.nick}</Text>
            <Text style={styles.italic}>{user.title}</Text>
          </>
        )}
        <CustomDivider />
        <Text>IQ96 app</Text>
        <Text>version {packageJson.version}</Text>
        <ButtonWithIcon
          title="Log ud"
          icon="power-off"
          onPress={() => logOut()}
        />
      </View>
    </>
  );
}

export default memo(Settings);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light,
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  board: {
    marginLeft: 70,
    color: Colors.success,
    transform: [{rotateY: '20deg'}, {rotateZ: '20deg'}],
  },
  it: {
    marginRight: 80,
    marginBottom: 5,
    color: Colors.event,
    transform: [{rotateY: '-20deg'}, {rotateZ: '-20deg'}],
  },
});
