import React from 'react';
import {Divider} from 'react-native-elements';

export const CustomDivider: React.FunctionComponent = ({horizontalWidth}) => {
  console.log('horizontalWidth', horizontalWidth);

  let spacing = horizontalWidth;
  if (!spacing) spacing = 8;

  console.log('spacing', spacing);

  return (
    <>
      <Divider orientation="horizontal" width={spacing} />
      <Divider orientation="vertical" />
      <Divider orientation="horizontal" width={spacing} />
    </>
  );
};
