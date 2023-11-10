import { View } from "react-native";
import MyButton from "../buttons/Button";

export default function DurationChanger({ duration, onChangeDuration }: { duration: number, onChangeDuration: (d: number) => void }) {
  const ADAY = 24 * 60 * 60 * 1000;
  const AWEEK = 7 * ADAY;
  const AMONTH = 30 * ADAY;
  const AYEAR = 365 * ADAY;
  
  return (
    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginVertical: 20 }}>
      <MyButton
        label="Yearly"
        onPress={() => onChangeDuration(AYEAR)}
        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
        outline={duration != AYEAR} />
      <MyButton
        label="Monthly"
        onPress={() => onChangeDuration(AMONTH)}
        style={{ borderRadius: 0 }}
        outline={duration != AMONTH} />
      <MyButton
        label="Weekly"
        onPress={() => onChangeDuration(AWEEK)}
        style={{ borderRadius: 0 }}
        outline={duration != AWEEK} />
      <MyButton
        label="Daily"
        onPress={() => onChangeDuration(ADAY)}
        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
        outline={duration != ADAY} />
    </View>
  )
}