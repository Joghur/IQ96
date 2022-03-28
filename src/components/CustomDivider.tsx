import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Divider} from 'react-native-elements';

export const CustomDivider: React.FunctionComponent = ({horizontalWidth}) => {
  let spacing = horizontalWidth;
  if (!spacing) spacing = 0.5;

  return (
    <>
      <View style={styles.view}>
        <Divider orientation="horizontal" width={spacing} />
        <Divider orientation="vertical" />
        <Divider orientation="horizontal" width={spacing} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  view: {
    paddingVertical: 10,
  },
});
