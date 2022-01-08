import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import Banner from '../../../components/Banner';
import Colors from '../../../constants/colors';
import IMAGES from './imagesArray';

function Images() {
  const [loading, setLoading] = useState(false);
  return (
    <View style={styles.container}>
      <Banner label={'Billeder'} />
      <ScrollView
        style={styles.ImageContainer}
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
        horizontal={false}>
        {IMAGES.map((image: any, i: React.Key | null | undefined) => {
          return (
            <View
              style={{
                padding: 5,
              }}
              key={i}>
              <Image
                source={{uri: image}}
                style={[
                  styles.Image,
                  {
                    width: 150,
                    height: 150,
                  },
                ]}
                resizeMode="center"
                onLoadStart={() => setLoading(true)}
                onLoadEnd={() => setLoading(false)}
              />
              {loading && (
                <ActivityIndicator color={Colors.success} size="large" />
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default Images;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    backgroundColor: Colors.light,
  },

  ImageContainer: {
    marginHorizontal: 16,
    marginTop: 30,
    width: '100%',
  },
  Image: {
    shadowColor: Colors.dark,
    shadowOffset: {
      width: -10,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
  },
});
