import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import {Button, Input, Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

import '../../../utils/firebase';
import Colors from '../../../constants/colors';

const auth = getAuth();

const initUser = {email: '', password: ''};

type User = {
  email: string;
  password: string;
};

const Login = () => {
  const [user, setUser] = useState<User>(initUser);

  console.log('user', user);

  const handleChange = option => {
    console.log('handleChange, option', option);
    setUser(oldUser => ({
      ...oldUser,
      [option.selectorType]: option.dbValue,
    }));
  };

  const handleSubmit = async () => {
    signInWithEmailAndPassword(auth, user.email, user.password)
      .then(userCredential => {
        // Signed in
        const userObj = userCredential.user;
        console.log('userObj', userObj);
        // ...
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('errorCode', errorCode);
        console.log('errorMessage', errorMessage);
      });
  };

  return (
    <View>
      <ScrollView>
        <View style={styles.buttonContainer}></View>
        <View style={styles.submitButtonContainer}>
          <Button
            type="clear"
            raised
            title="Login"
            titleStyle={styles.submitButtonTitle}
            buttonStyle={styles.submitButton}
            containerStyle={styles.submitButtonContainer}
            onPress={() => handleSubmit()}
          />
        </View>
        <View style={styles.headerTextContainer}>
          <Text h3 style={styles.headerText}>
            Tilføj ny begivenhed
          </Text>
        </View>
        <View on style={styles.inputContainer}>
          <Input
            value={user.email}
            placeholder="Email"
            leftIcon={
              <>
                <Icon name="place" size={24} color={Colors.dark} />
              </>
            }
            onChangeText={value =>
              handleChange({dbValue: value, selectorType: 'email'})
            }
          />
        </View>
        <View on style={styles.inputContainer}>
          <Input
            passwordRules
            value={user.password}
            placeholder="Kodeord"
            leftIcon={
              <>
                <Icon name="nightlife" size={24} color={Colors.dark} />
              </>
            }
            onChangeText={value =>
              handleChange({dbValue: value, selectorType: 'password'})
            }
          />
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
  submitButton: {
    width: 170,
    height: 50,
    elevation: 1,
    backgroundColor: 'transparent',
  },
  submitButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginRight: 10,
  },
  submitButtonTitle: {
    color: Colors.button,
  },
  inputContainer: {
    marginTop: 10,
  },
});
