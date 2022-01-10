import React, {memo} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';
import Colors from '../../constants/colors';

function Settings() {
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <Text>{t('settings')}</Text>
      <Text>Her kommer logud og version</Text>
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
});
