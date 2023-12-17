import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Animated, Keyboard, TouchableOpacity, View } from 'react-native';
import { Bubble, GiftedChat, IMessage } from 'react-native-gifted-chat';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomImagesBubble from '../components/chat/CustomImagesBubble';
import { Day } from '../components/chat/Day';
import { createChatTable, createUserTable, deleteChatTable, getChatItems, getDBConnection, saveChatItems, saveUserItems } from '../sqlite/chat-service';

const user = {
  _id: 1,
  name: 'Developer',
}

const otherUser = {
  _id: 2,
  name: 'React Native',
  avatar: 'https://lh3.googleusercontent.com/a/ACg8ocKGGWAnB_71dm5ARX25RJMTDlJBut01eyat2yH6vrLXqZ4=s576-c-no',
}

export function ChatScreen() {
  const navigation = useNavigation();
  const [messages, setMessages] = useState<IMessage[]>([])
  const [offset, setOffset] = useState(0);
  const [animateOffset] = useState(new Animated.Value(0));
  const [animateHeight] = useState(new Animated.Value(0));
  const bottomTabBarHeight = useBottomTabBarHeight();

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      // navigation.setOptions({ tabBarStyle: { display: 'none' } });
      Animated.timing(animateOffset, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }).start();
      Animated.timing(animateHeight, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }).start();
      navigation.setOptions({
        tabBarStyle: {
          display: 'none',
          animated: true,
          transform: [{
            translateY: animateOffset
          }],
        }
      });
      setTimeout(() => {
        Animated.timing(animateHeight, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }, 200);
    });

    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      animateHeight.setValue(50)
      Animated.timing(animateOffset, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        Animated.timing(animateHeight, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }, 0);
      navigation.setOptions({
        tabBarStyle: {
          display: 'flex',
          animated: true,
          transform: [{
            translateY: animateOffset,
          }],
        }
      });
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const loadDataCallback = useCallback(async () => {
    try {
      const db = await getDBConnection();
      // Create table if not exists
      await Promise.all([createChatTable(db), createUserTable(db)]);

      const storedTodoItems = await getChatItems(db);
      if (storedTodoItems.length) {
        setMessages(storedTodoItems.map((item) => {
          return {
            ...item,
            createdAt: new Date(item.createdAt),
          }
        }))
      } else {
        await Promise.all([
          saveChatItems(db, [{
            _id: 1,
            text: 'Hello developer',
            createdAt: new Date().getTime(),
            userId: otherUser._id,
            image: '',
          }]),
          saveUserItems(db, [user, otherUser])
        ])
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Todo: Check if image is stored persistently
  const saveDataCallback = useCallback(async (newMessages: IMessage[]) => {
    try {
      const db = await getDBConnection();
      // Create table if not exists
      await Promise.all([createChatTable(db), createUserTable(db)]);

      saveChatItems(db, newMessages.map((item) => {
        return {
          ...item,
          createdAt: (item.createdAt as Date).getTime(),
          userId: item.user._id,
          image: item.image || '',
        }
      }))
    } catch (error) {
      console.error(error);
    }
  }, []);

  const deleteDataCallback = useCallback(async () => {
    try {
      const db = await getDBConnection();
      await Promise.all([
        deleteChatTable(db),
        deleteChatTable(db)
      ])
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadDataCallback();
    // deleteDataCallback();
  }, [loadDataCallback]);

  const onSend = useCallback(async (messages: IMessage[]) => {
    await saveDataCallback(messages);
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    )
  }, [])

  const renderActions = () => {
    return (
      <View style={{ height: '100%', flexDirection: 'row', gap: 10, marginLeft: 10, alignItems: 'center' }}>
        <TouchableOpacity onPress={onClickCamera}>
          <Icon
            name="camera"
            size={20}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onClickLibrary}>
          <Icon
            name="photo"
            size={20}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const onClickCamera = () => {
    launchCamera({
      mediaType: 'photo',
      includeBase64: false,
      saveToPhotos: true,
    }, (response) => {
      // setImage(response);
      if (response.assets) {
        // setImagePath(response.assets[0].uri || '')
        onSend([{
          _id: messages.length + 1,
          text: '',
          createdAt: new Date(),
          user: user,
          image: response.assets.map((asset) => asset.uri).join(','),
        }])
      }
    });
  }

  const onClickLibrary = () => {
    launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
    }, (response) => {
      // setImage(response);
      if (response.assets) {
        // setImagePath(response.assets[0].uri || '')
        onSend([{
          _id: messages.length + 1,
          text: '',
          createdAt: new Date(),
          user: user,
          image: response.assets.map((asset) => asset.uri).join(','),
        }])
      }
    });
  }

  const renderBubble = (props: any) => {
    const { currentMessage } = props;
    if (currentMessage.image) {
      // Custom Images Bubble
      return <CustomImagesBubble currentMessage={currentMessage} user={user} />
    }
    // Default Bubble
    return (
      <Bubble
        {...props}
      />
    );
  };

  return (
    <Animated.View
      style={{
        height: '100%',
        transform: [{
          translateY: animateHeight
        }],
      }}
    >
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={user}
        renderActions={renderActions}
        renderBubble={renderBubble}
        renderDay={(props) => {
          return (
            <Day
              {...props}
              textStyle={{
                fontWeight: 'bold'
              }}
            />
          );
        }}
        textInputProps={{

        }}
        listViewProps={{
          scrollEventThrottle: 400,
          onScroll: (event: any) => {
            const currentOffset = event.nativeEvent.contentOffset.y;
            const dif = currentOffset - offset;

            if (dif < 0) {
              navigation.setOptions({ tabBarStyle: { display: 'flex', animated: true } });
              setOffset(currentOffset);
            } else {
              navigation.setOptions({ tabBarStyle: { display: 'none', animated: true } });
              setOffset(currentOffset - bottomTabBarHeight);
            }
          }
        }}
      />
    </Animated.View>
  )
}