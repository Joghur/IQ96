import React from 'react';
import {SpeedDial} from 'react-native-elements';
import Colors from '../constants/colors';

export default ({onDelete, onEdit, onAdd}) => {
  const [open, setOpen] = React.useState(false);

  const handlePress = fn => {
    fn();
    setOpen(false);
  };

  return (
    <SpeedDial
      isOpen={open}
      icon={{
        name: 'edit',
        color: Colors.white,
      }}
      openIcon={{name: 'close', color: Colors.white}}
      onOpen={() => setOpen(!open)}
      onClose={() => setOpen(!open)}>
      {onAdd && (
        <SpeedDial.Action
          icon={{name: 'add', color: Colors.white}}
          title="Tilføj"
          onPress={() => handlePress(onAdd)}
        />
      )}
      {onDelete && (
        <SpeedDial.Action
          icon={{name: 'delete', color: Colors.white}}
          title="Fjern"
          onPress={() => handlePress(onDelete)}
        />
      )}
      {onEdit && (
        <SpeedDial.Action
          icon={{name: 'edit', color: Colors.white}}
          title="Redigér"
          onPress={() => handlePress(onEdit)}
        />
      )}
    </SpeedDial>
  );
};
