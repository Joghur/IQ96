import React from 'react';
import {Divider} from 'react-native-elements';

export const CustomDivider: React.FunctionComponent = () => {
  return (
    <>
      <Divider orientation="horizontal" width={8} />
      <Divider orientation="vertical" />
      <Divider orientation="horizontal" width={8} />
    </>
  );
};
