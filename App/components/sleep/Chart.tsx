import { StyleSheet, View } from "react-native";
import { BarChart } from 'react-native-gifted-charts';
import { ISleep } from "../../types/SleepItem";
import moment from "moment";

export default function Chart({ sleepItems }: { sleepItems: ISleep[] }) {
  return (
    <View style={styles.container}>
      <BarChart
        data={sleepItems.map((item) => ({
          value: (item.endTime - item.startTime) / (60 * 60 * 1000),
          label: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }).split(',')[0],
          frontColor: '#177AD5',
        }))}
        roundedTop
        roundedBottom
        barWidth={15}
        height={200}
        barBorderRadius={4}
        frontColor="lightgray"
        yAxisThickness={0}
        isAnimated
        stepValue={1}
        showReferenceLine1
        referenceLine1Position={7}
        referenceLine1Config={{
          color: '#177AD5',
          dashWidth: 2,
          dashGap: 3,
        } as any}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 8,
    marginHorizontal: 28,
  },
})