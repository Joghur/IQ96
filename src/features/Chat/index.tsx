import React, {memo, useState, useCallback, useEffect} from 'react';
import {Button, StyleSheet, View} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {useRecoilValue} from 'recoil';
import 'dayjs/locale/da';
import {v4 as uuidv4} from 'uuid';

import Banner from '../../components/Banner';
import Colors from '../../constants/colors';
import {userState} from '../../utils/appState';
import User from '../../types/User';
import Settings from '../../types/Settings';
import {queryDocuments, saveData} from '../../utils/db';
import {convertEpochSecondsToDateString} from '../../utils/dates';
import {getData} from '../../utils/async';

// const quickReplies = {
//   type: 'radio', // or 'checkbox',
//   keepIt: true,
//   values: [
//     {
//       title: '😋 Yes',
//       value: 'yes',
//     },
//     {
//       title: '📷 Yes, let me show you with a picture!',
//       value: 'yes_picture',
//     },
//     {
//       title: '😞 Nope. What?',
//       value: 'no',
//     },
//   ],
// };

function Chat() {
  const iqUser: User = useRecoilValue(userState);
  const [messages, setMessages] = useState([]);
  const [group] = useState('general');
  const [settings, setSettings] = useState<Settings>();

  console.log('Chat - iqUser', iqUser);
  //   console.log('Chat - messages', messages);
  console.log('Chat - settings', settings);
  //   console.log('Chat - messages[0].createdAt', messages[0].createdAt);

  useEffect(() => {
    retrieveSettings();
  }, []);

  const handleRefresh = () => {
    fetchMessages();
  };

  const onSend = useCallback((messages = []) => {
    console.log('onSend messages', messages);
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    const {_id, createdAt, text, user} = messages[0];
    console.log('_id, createdAt, text, user', _id, createdAt, text, user);
    // console.log('uuidv4();', uuidv4());
    saveData('chats', {
      _id,
      createdAt,
      text,
      user: {
        _id: iqUser.uid,
        id: iqUser.uid,
        name: iqUser.nick,
      },
      group,
    });
  }, []);

  const retrieveSettings = async () => {
    const set = await getData('settings');
    setSettings(() => set);
  };

  const fetchMessages = async () => {
    let result = [];
    let sortedResults = [];
    result = await queryDocuments('chats', 'group', '==', group);
    // console.log('!!result.success', !!result.success);

    if (result.success.length > 0) {
      sortedResults = result.success.sort((a, b) => b.createdAt - a.createdAt);
    }

    console.log('sortedResults', sortedResults);
    setMessages(() =>
      sortedResults.map(message => ({
        ...message,
        createdAt: convertEpochSecondsToDateString(
          message.createdAt?.seconds,
          '',
        ),
      })),
    );
  };

  return (
    <>
      {settings?.baseUrl && settings?.media && (
        <View style={styles.container}>
          <Banner label={'Chat'} />
          <Button onPress={handleRefresh} title="Refresh" />
          <GiftedChat
            messages={messages}
            renderUsernameOnMessage
            onSend={messages => onSend(messages)}
            user={{
              _id: iqUser.uid,
              name: iqUser.nick,
            }}
            // quickReplies={quickReplies}
            locale="da"
            timeFormat="HH:mm"
            dateFormat="dddd D MMM YYYY"
            // onQuickReply={this.onQuickReply}
          />
        </View>
      )}
    </>
  );
}

export default memo(Chat);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    backgroundColor: Colors.light,
  },
});
