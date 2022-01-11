import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, Input, Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {ButtonWithIcon} from '../../../components/ButtonWithIcon';
import {logIn, resetPassword} from '../../../utils/auth';
import Colors from '../../../constants/colors';

const initUser = {email: '', password: ''};

type User = {
  email: string;
  password: string;
};

const Login = () => {
  const [user, setUser] = useState<User>(initUser);
  const [reset, setReset] = useState(false);
  const [validated, setValidated] = useState(true);

  console.log('user', user);

  const handleChange = option => {
    console.log('handleChange, option', option);
    setUser(oldUser => ({
      ...oldUser,
      [option.selectorType]: option.dbValue,
    }));
  };

  const validate = mail => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      setValidated(true);
      return true;
    }
    setValidated(false);
    return false;
  };

  const handleSubmit = () => {
    if (validate(user.email)) {
      logIn(user);
    }
  };

  const handleReset = () => {
    if (validate(user.email)) {
      setReset(false);
      resetPassword(user.email);
    }
  };

  return (
    <View>
      <ScrollView>
        <View style={styles.buttonContainer}></View>
        <View style={styles.headerTextContainer}>
          <Text h3 style={styles.headerText}>
            Login
          </Text>
        </View>
        <View on style={styles.inputContainer}>
          <Input
            value={user.email}
            placeholder="Email"
            errorStyle={{color: 'red'}}
            errorMessage={!validated && 'Indtast en rigtig email'}
            leftIcon={
              <>
                <Icon name="email" size={24} color={Colors.dark} />
              </>
            }
            onChangeText={value =>
              handleChange({dbValue: value, selectorType: 'email'})
            }
          />
        </View>
        {!reset && (
          <View on style={styles.inputContainer}>
            <Input
              secureTextEntry={true}
              value={user.password}
              placeholder="Kodeord"
              leftIcon={
                <>
                  <Icon name="lock" size={24} color={Colors.dark} />
                </>
              }
              onChangeText={value =>
                handleChange({dbValue: value, selectorType: 'password'})
              }
            />
          </View>
        )}
        {reset && (
          <View style={styles.resetText}>
            <Text>1. Indtast din email ovenover og tryk Reset</Text>
            <Text>2. Gå til din email indboks </Text>
            <Text>
              3. Find reset mailen. Den kommer fra iq96-20418.firebaseapp.com{' '}
            </Text>
            <Text>
              4. Tryk på link - vælg nyt kodeord - kom tilbage hertil{' '}
            </Text>
          </View>
        )}
        <View style={styles.buttons}>
          <ButtonWithIcon
            title={reset ? 'Reset' : 'Login'}
            icon={reset ? 'refresh' : 'unlock'}
            onPress={reset ? handleReset : handleSubmit}
          />
          <View style={styles.resetButton}>
            <Text onPress={() => setReset(reset => !reset)}>
              {reset ? 'Login' : 'Glemt kodeord'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  headerTextContainer: {
    alignItems: 'center',
  },
  headerText: {
    color: Colors.dark,
  },
  inputContainer: {
    marginTop: 10,
  },
  buttons: {
    alignItems: 'center',
  },
  resetButton: {
    paddingVertical: 15,
  },
  resetText: {
    alignItems: 'center',
  },
});
