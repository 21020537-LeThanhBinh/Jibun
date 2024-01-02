import { Animated, Text } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MyButton from "./buttons/Button";

export default function TimeFooter({ endDate, setEndDate, duration, animateOffset }: { endDate: number, setEndDate: (e: number) => void, duration: number, animateOffset: Animated.Value }) {
  const ADAY = 24 * 60 * 60 * 1000;
  const remainingTime = (ADAY) - (endDate % (ADAY)) - 3 * 60 * 60 * 1000
  let durationText = ""

  if (duration == ADAY) durationText = new Date(endDate - duration + remainingTime).toDateString()
  else durationText = new Date(endDate - duration + remainingTime).toDateString() + `\n- ` + new Date(endDate).toDateString()
  
  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
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