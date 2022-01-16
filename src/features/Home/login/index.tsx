import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Input, Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {ButtonWithIcon} from '../../../components/ButtonWithIcon';
import {logIn, resetPassword} from '../../../utils/auth';
import Colors from '../../../constants/colors';
import {storeData, getData} from '../../../utils/async';

type LoginCreds = {
  email: string;
  password: string;
};

const Login = () => {
  console.log('Login ');
  const [user, setUser] = useState<LoginCreds>(null);
  const [reset, setReset] = useState(false);
  const [validatedEmail, setValidatedEmail] = useState(true);
  const [validatedPassword, setValidatedPassword] = useState(true);

  useEffect(() => {
    handleStart();
  }, []);

  const handleStart = async () => {
    const initUser = {email: '', password: ''};
    const startEmail = await getData('email');

    console.log('startEmail', startEmail);

    if (startEmail) {
      initUser.email = startEmail;
    }

    console.log('initUser', initUser);
    setUser(initUser);
  };

  const handleChange = option => {
    setUser(oldUser => ({
      ...oldUser,
      [option.selectorType]: option.dbValue,
    }));
  };

  const validateEmail = mail => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      setValidatedEmail(true);
      return true;
    }
    setValidatedEmail(false);
    return false;
  };

  const validatePassword = password => {
    if (password.length > 5) {
      setValidatedPassword(true);
      return true;
    }
    setValidatedPassword(false);
    return false;
  };

  const handleSubmit = () => {
    if (validateEmail(user.email) && validatePassword(user.password)) {
      storeData('email', user.email);
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
        {user && (
          <View on style={styles.inputContainer}>
            <Input
              value={user.email}
              placeholder={user.email || 'Email'}
              errorStyle={{color: 'red'}}
              errorMessage={!validatedEmail && 'Indtast en rigtig email'}
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
        )}
        {user && !reset && (
          <View on style={styles.inputContainer}>
            <Input
              secureTextEntry={true}
              value={user.password}
              placeholder="Kodeord"
              errorStyle={{color: 'red'}}
              errorMessage={
                !validatedPassword && 'Kodeord skal være mindst 6 tegn'
              }
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
