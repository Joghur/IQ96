import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';

// import LETTERS from './lettersArray';
import Banner from '../../../components/Banner';
import {ButtonWithIcon} from '../../../components/ButtonWithIcon';
import {fetchDocument} from '../../../utils/db';
import Colors from '../../../constants/colors';
// import {convertEpochSecondsToDateString} from '../../../utils/dates';

function sortObj(obj) {
  return Object.keys(obj)
    .sort((a, b) => b - a)
    .reduce(function (result, key) {
      result[key] = obj[key];
      return result;
    }, {});
}

function Letters() {
  //   const [year, setYear] = useState(0);
  const [letters, setLetters] = useState([]);

  //   console.log('year', year);
  console.log('letters', letters);

  useEffect(() => {
    const fetchLettersPerYear = async () => {
      const letterData = await fetchDocument('pdf', 'letters');
      if (letterData.success) {
        const sorted = sortObj(letterData.success);
        setLetters(sorted);
      }
    };
    fetchLettersPerYear();
  }, []);
  return (
    <View style={styles.container}>
      <Banner label={'IQ Breve'} />
      <View style={styles.buttonContainer}>
        {letters &&
          Object.keys(letters).map(year => (
            <View key={year}>
              <ButtonWithIcon title={year} onPress={() => console.log(year)} />
            </View>
          ))}
      </View>
    </View>
  );
}

export default Letters;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    backgroundColor: Colors.light,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 30,
  },
});
