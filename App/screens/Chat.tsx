import React, { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Bubble, GiftedChat, IMessage } from 'react-native-gifted-chat';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomFileBubble from '../components/chat/CustomFileBubble';
import CustomImagesBubble from '../components/chat/CustomImagesBubble';
import { Day } from '../components/chat/Day';

const user = {
  _id: 1,
  name: 'Developer',
}

const otherUser = {
  _id: 2,
  name: 'React Native',
  avatar: 'https://lh3.googleusercontent.com/a/ACg8ocKGGWAnB_71dm5ARX25RJMTDlJBut01eyat2yH6vrLXqZ4=s576-c-no',
}

export function Chat() {
  const [messages, setMessages] = useState<IMessage[]>([])

  useEffect(() => {
    setMessages([
      {
        _id: 7,
        text: '',
        createdAt: new Date(),
        user: otherUser,
        image: 'https://lh3.googleusercontent.com/a/ACg8ocKGGWAnB_71dm5ARX25RJMTDlJBut01eyat2yH6vrLXqZ4=s576-c-no,https://lh3.googleusercontent.com/a/ACg8ocKGGWAnB_71dm5ARX25RJMTDlJBut01eyat2yH6vrLXqZ4=s576-c-no,https://lh3.googleusercontent.com/a/ACg8ocKGGWAnB_71dm5ARX25RJMTDlJBut01eyat2yH6vrLXqZ4=s576-c-no,https://lh3.googleusercontent.com/a/ACg8ocKGGWAnB_71dm5ARX25RJMTDlJBut01eyat2yH6vrLXqZ4=s576-c-no,https://lh3.googleusercontent.com/a/ACg8ocKGGWAnB_71dm5ARX25RJMTDlJBut01eyat2yH6vrLXqZ4=s576-c-no,https://lh3.googleusercontent.com/a/ACg8ocKGGWAnB_71dm5ARX25RJMTDlJBut01eyat2yH6vrLXqZ4=s576-c-no',
      },
      {
        _id: 6,
        text: '',
        createdAt: new Date(),
        user: user,
        image: 'https://lh3.googleusercontent.com/a/ACg8ocKGGWAnB_71dm5ARX25RJMTDlJBut01eyat2yH6vrLXqZ4=s576-c-no,https://lh3.googleusercontent.com/a/ACg8ocKGGWAnB_71dm5ARX25RJMTDlJBut01eyat2yH6vrLXqZ4=s576-c-no,https://lh3.googleusercontent.com/a/ACg8ocKGGWAnB_71dm5ARX25RJMTDlJBut01eyat2yH6vrLXqZ4=s576-c-no,https://lh3.googleusercontent.com/a/ACg8ocKGGWAnB_71dm5ARX25RJMTDlJBut01eyat2yH6vrLXqZ4=s576-c-no,https://lh3.googleusercontent.com/a/ACg8ocKGGWAnB_71dm5ARX25RJMTDlJBut01eyat2yH6vrLXqZ4=s576-c-no',
      },
      {
        _id: 5,
        text: '',
        createdAt: new Date(),
        user: otherUser,
        image: 'https://lh3.googleusercontent.com/a/ACg8ocKGGWAnB_71dm5ARX25RJMTDlJBut01eyat2yH6vrLXqZ4=s576-c-no,https://lh3.googleusercontent.com/a/ACg8ocKGGWAnB_71dm5ARX25RJMTDlJBut01eyat2yH6vrLXqZ4=s576-c-no,https://lh3.googleusercontent.com/a/ACg8ocKGGWAnB_71dm5ARX25RJMTDlJBut01eyat2yH6vrLXqZ4=s576-c-no,https://lh3.googleusercontent.com/a/ACg8ocKGGWAnB_71dm5ARX25RJMTDlJBut01eyat2yH6vrLXqZ4=s576-c-no',
      },
      {
        _id: 4,
        text: '',
        createdAt: new Date(),
        user: user,
        image: 'https://lh3.googleusercontent.com/a/ACg8ocKGGWAnB_71dm5ARX25RJMTDlJBut01eyat2yH6vrLXqZ4=s576-c-no,https://lh3.googleusercontent.com/a/ACg8ocKGGWAnB_71dm5ARX25RJMTDlJBut01eyat2yH6vrLXqZ4=s576-c-no,https://lh3.googleusercontent.com/a/ACg8ocKGGWAnB_71dm5ARX25RJMTDlJBut01eyat2yH6vrLXqZ4=s576-c-no',
      },
      {
        _id: 3,
        text: '',
        createdAt: new Date(),
        user: otherUser,
        image: 'https://lh3.googleusercontent.com/a/ACg8ocKGGWAnB_71dm5ARX25RJMTDlJBut01eyat2yH6vrLXqZ4=s576-c-no,https://lh3.googleusercontent.com/a/ACg8ocKGGWAnB_71dm5ARX25RJMTDlJBut01eyat2yH6vrLXqZ4=s576-c-no',
      },
      {
        _id: 2,
        text: '',
        createdAt: new Date(),
        user: user,
        image: 'https://lh3.googleusercontent.com/a/ACg8ocKGGWAnB_71dm5ARX25RJMTDlJBut01eyat2yH6vrLXqZ4=s576-c-no',
      },
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: otherUser,
      },

    ])
  }, [])

  const onSend = useCallback((messages: IMessage[]) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    )
  }, [])

  const renderActions = () => {
    return (
      <View style={{ height: '100%', flexDirection: 'row', gap: 10, marginLeft: 10, alignItems: 'center' }}>
        {/* <TouchableOpacity onPress={onPickDocument}>
          <Icon
            name="paperclip"
            size={20}
          />
        </TouchableOpacity> */}
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
    } else if (currentMessage.file && currentMessage.file.url) {
      // Custom File Bubble
      return <CustomFileBubble currentMessage={currentMessage} user={user} />
    } 
    // Default Bubble
    return (
      <Bubble
        {...props}
      />
    );
  };

  return (
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
    />
  )
}