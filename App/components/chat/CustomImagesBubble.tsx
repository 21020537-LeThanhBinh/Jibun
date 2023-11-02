import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IMessage, User } from 'react-native-gifted-chat';

export default function CustomImagesBubble({ currentMessage, user }: { currentMessage: IMessage, user: User }) {
  // console.log('CustomMessageImages', currentMessage)

  const imgs = currentMessage?.image?.split(',') || []
  const imgNumb = imgs.length
  const bigImgNumb = imgNumb % 3
  const firstBigImgIndex = imgNumb - bigImgNumb

  return (
    <TouchableOpacity
      style={styles.imageContainer}
      onPress={() =>
        console.log('CustomMessageImages')
      }
    >
      <View style={styles.imageWrapper}>
        {imgs.map((img: string, index: number) => {
          if (index < firstBigImgIndex) {
            return <Image source={{ uri: img }} style={{ minWidth: 80, minHeight: 80 }} key={index} />
          } else {
            return <Image source={{ uri: img }} style={{ minWidth: 80, minHeight: 200 / bigImgNumb, flexGrow: 1 }} key={index} />
          }
        })}
      </View>

      {/* {currentMessage.text && (
        <View style={{ flexDirection: 'column' }}>
          <Text style={{
            ...styles.imageText,
            color: currentMessage.user._id === 2 ? 'white' : 'black',
          }} >
            {currentMessage.text}
          </Text>
        </View>
      )} */}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    maxWidth: 246,
    marginVertical: 5,
    backgroundColor: 'transparent',
  },
  imageWrapper: {
    display: "flex",
    flexDirection: "row",
    flexBasis: '33.33%',
    flexWrap: 'wrap',
    gap: 3,
    borderRadius: 12,
    overflow: 'hidden',
    width: 246
  },
  imageText: {
    marginVertical: 5,
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 10,
    marginRight: 5,
  },
});