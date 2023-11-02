import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { User } from 'react-native-gifted-chat';

export default function CustomFileBubble({ currentMessage, user }: { currentMessage: any, user: User }) {
  console.log('CustomMessageFile', currentMessage)

  if (!currentMessage.file) return null

  return (
    <TouchableOpacity
      style={{
        ...styles.fileContainer,
        backgroundColor: currentMessage.user._id === user._id ? 'white' : '#efefef',
        borderBottomLeftRadius: currentMessage.user._id === user._id ? 15 : 5,
        borderBottomRightRadius: currentMessage.user._id === user._id ? 5 : 15,
      }}
    >
      {currentMessage.text && (
        <View style={{ flexDirection: 'column' }}>
          <Text style={{
            ...styles.fileText,
            color: currentMessage.user._id === 2 ? 'white' : 'black',
          }} >
            {currentMessage.text}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  fileContainer: {
    flex: 1,
    maxWidth: 300,
    marginVertical: 2,
    borderRadius: 15,
  },
  fileText: {
    marginVertical: 5,
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 10,
    marginRight: 5,
  },
});