import { Animated, Text } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MyButton from "../buttons/Button";

export default function Footer({ endDate, setEndDate, duration, durationText, animateOffset }: { endDate: number, setEndDate: (e: number) => void, duration: number, durationText: string, animateOffset: Animated.Value }) {
  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 8,
        opacity: 0.8,
        transform: [
          {
            translateY: animateOffset,
          },
        ],
      }}>
      <MyButton
        onPress={() => {
          setEndDate(endDate - duration)
        }}
        outline>
        <MaterialCommunityIcons name="chevron-left" size={16} />
      </MyButton>

      <Text>{durationText}</Text>

      <MyButton
        onPress={() => {
          setEndDate(endDate + duration)
        }}
        outline
        disabled={endDate >= new Date().getTime()}>
        <MaterialCommunityIcons name="chevron-right" size={16} />
      </MyButton>
    </Animated.View>
  )
}