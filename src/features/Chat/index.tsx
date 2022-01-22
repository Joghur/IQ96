import React, {
  memo,
  useState,
  useCallback,
  useLayoutEffect,
  //   useEffect,
} from 'react';
import {StyleSheet, View} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {useRecoilValue} from 'recoil';
import 'dayjs/locale/da';

import Banner from '../../components/Banner';
import Colors from '../../constants/colors';
import {userState} from '../../utils/appState';
import User from '../../types/User';
import {queryDocuments, saveData} from '../../utils/db';
import {convertEpochSecondsToDateString} from '../../utils/dates';

const quickReplies = {
  type: 'radio', // or 'checkbox',
  keepIt: true,
  values: [
    {
      title: '😋 Yes',
      value: 'yes',
    },
    {
      title: '📷 Yes, let me show you with a picture!',
      value: 'yes_picture',
    },
    {
      title: '😞 Nope. What?',
      value: 'no',
    },
  ],
};

function Chat() {
  const user: User = useRecoilValue(userState);
  const [messages, setMessages] = useState([]);
  const [group, setGroup] = useState('general');

  console.log('Chat - user', user);
  console.log('Chat - messages', messages);
  //   console.log('Chat - messages[0].createdAt', messages[0].createdAt);

  useLayoutEffect(() => {
    fetchMessages();
  }, [group]);

  const onSend = useCallback((messages = []) => {
    console.log('onSend messages', messages);
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    const {_id, createdAt, text, user} = messages[0];
    console.log('_id, createdAt, text, user', _id, createdAt, text, user);
    saveData('chats', {
      _id,
      createdAt,
      text,
      user,
      group,
    });
  }, []);

  const fetchMessages = async () => {
    let result = [];
    result = await queryDocuments('chats', 'group', '==', group);
    console.log('result.success', result.success);
    console.log('!!result.success', !!result.success);
    setMessages(() =>
      result.success.map(message => ({
        ...message,
        createdAt: convertEpochSecondsToDateString(
          message.createdAt?.seconds,
          '',
        ),
      })),
    );
  };

  return (
    <View style={styles.container}>
      <Banner label={'Chat'} />
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: user.id,
          name: user.nick,
          avatar: user.avatar,
        }}
        quickReplies={quickReplies}
        locale="da"
        timeFormat="HH:mm"
        dateFormat="dddd D MMM YYYY"
      />
    </View>
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
