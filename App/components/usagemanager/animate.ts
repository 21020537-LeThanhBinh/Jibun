import { Animated } from "react-native";

function onScroll({
  event,
  offset,
  setOffset,
  animateOffset,
  navigation
}: {
  event: any,
  offset: number,
  setOffset: (offset: number) => void,
  animateOffset: Animated.Value,
  navigation: any
}) {
  const currentOffset = event.nativeEvent.contentOffset.y;
  const dif = currentOffset - offset;

  if (dif < 0 || currentOffset < 50) {
    Animated.timing(animateOffset, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    navigation.setOptions({
      tabBarStyle: {
        display: 'flex',
        animated: true,
        transform: [{
          translateY: animateOffset
        }],
      }
    });
    setOffset(currentOffset);
  } else {
    Animated.timing(animateOffset, { toValue: 50, duration: 200, useNativeDriver: true }).start();
    navigation.setOptions({
      tabBarStyle: {
        display: 'none',
        animated: true,
        transform: [{
          translateY: animateOffset
        }],
      }
    });
    setOffset(currentOffset - 50);
  }
}

export { onScroll }