import React, {memo} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useRecoilValue} from 'recoil';

import {ButtonWithIcon} from '../../components/ButtonWithIcon';
import {logOut} from '../../utils/auth';
import Colors from '../../constants/colors';
import packageJson from '../../../package.json';
import {userState} from '../../utils/appState';
import {CustomDivider} from '../../components/CustomDivider';
import User from '../../types/User';
import Banner from '../../components/Banner';
import LocationButton from '../../components/LocationButton';
import {saveData} from '../../utils/db';

function Settings() {
  const user = useRecoilValue(userState) as User;

  console.log('user', user);

  const handleAdd = async () => {
    // const u: User = {
    //   isAdmin: true,
    //   isBoard: false,
    //   isSuperAdmin: false,
    //   name: 'string',
    //   nick: 'string',
    //   title: 'string',
    //   avatar: 'string',
    //   uid: 'string',
    //   locationId: 'string',
    // };
    // await saveData('users', u);

    // const loc = {
    //   madeBy: 'app',
    //   nick: 'Milling Hotel Windsor',
    //   type: 'hotel',
    // };

    // await saveData('map', loc);
  };

  return (
    <View>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <Banner label={'Indstillinger'} />
        <View style={styles.container}>
          {user && (
            <>
              {user.isBoard && (
                <Text
                  style={{...styles.bold, ...styles.italic, ...styles.board}}>
                  Er i bestyrelsen
                </Text>
              )}
              {user.isAdmin && (
                <Text style={{...styles.bold, ...styles.italic, ...styles.it}}>
                  IT afdelingen
                </Text>
              )}

              <Text style={{...styles.bold, ...styles.textShadow}}>
                {user.name}
              </Text>
              <Text style={styles.italic}>{user.nick}</Text>
              <Text style={styles.italic}>{user.title}</Text>
            </>
          )}
          <CustomDivider />
          <Text style={{...styles.bold, ...styles.textShadow}}>
            Lokationsstatus
          </Text>
          <View style={styles.locationContainer}>
            <Text style={styles.green}>Grøn</Text>
            <Text style={styles.text}>
              IQ med-lemmer kan se din lokation i denne app. Lokation bliver
              ikke sendt andre steder hen.
            </Text>
            <Text style={styles.red}>Rød</Text>
            <Text style={styles.text}>
              IQ med-lemmer kan ikke se din lokation.
            </Text>
            <LocationButton />
            <Text style={styles.text}>
              Tryk her (evt to tryk) for at ændre.
            </Text>
          </View>
          <CustomDivider />
          <Text style={{...styles.bold, ...styles.textShadow}}>IQ96 app</Text>
          <Text>version {packageJson.version}</Text>
          <ButtonWithIcon
            title="Log ud"
            icon="power-off"
            onPress={() => logOut()}
          />
          <CustomDivider horizontalWidth={25} />
          {/* {user.isSuperAdmin && (
            <>
              <Text style={{...styles.bold, ...styles.textShadow}}>
                Bruger administration
              </Text>
              <Text style={styles.text}>
                Brug kun hvis du har adgang til DB konsollen
              </Text>
              <ButtonWithIcon
                title="Tilføj"
                icon="plus"
                onPress={() => handleAdd()}
              />
            </>
          )} */}
        </View>
      </ScrollView>
    </View>
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
  textShadow: {
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 5,
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  italic: {
    fontStyle: 'italic',
  },
  locationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  green: {
    color: Colors.success,
  },
  red: {
    color: Colors.error,
  },
  text: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 5,
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
