import { Animated, StyleSheet, Text, View } from "react-native";
import { BarChart, PieChart } from 'react-native-gifted-charts';
import { formatDurationDetails } from '../../utils/formatDurationDetails';
import { useEffect } from "react";

export default function Charts({ pieChartData, barChartData, setFocusedApp, animateChart, setEndDate }: { pieChartData: any[], barChartData?: any[], setFocusedApp?: any, animateChart: Animated.Value, setEndDate?: (e: number) => void }) {
  const totalUsageDur = pieChartData.reduce((acc, cur) => acc + cur.value, 0)

  const pie = (
    <PieChart
      data={pieChartData}
      donut
      centerLabelComponent={() => {
        return <Text style={{ fontSize: 24 }}>{formatDurationDetails(totalUsageDur)}</Text>;
      }}
      innerRadius={80}
      radius={110}
      // showText
      labelsPosition={'onBorder'}
      textColor={'#000'}
      fontWeight={'bold'}
      focusOnPress
      onPress={(item: any, index: number) => {
        setFocusedApp(item.packageName)
      }}
    />
  )

  const bar = (
    <BarChart
      data={barChartData?.length ? barChartData : Array(8).fill({ value: 0, label: '', frontColor: '#DDD', endTime: 0 })}
      roundedTop
      roundedBottom
      barWidth={15}
      height={240}
      noOfSections={10}
      barBorderRadius={4}
      frontColor="lightgray"
      yAxisThickness={0}
      // xAxisThickness={0}
      initialSpacing={12}
      // showLine
      // lineConfig={{
      //   color: '#F29C6E',
      //   thickness: 3,
      //   curved: true,
      //   hideDataPoints: true,
      //   shiftY: 20,
      // }}
      onPress={(item: any, index: number) => {
        setEndDate && setEndDate(item.endTime)
      }}
      isAnimated
      showFractionalValues
    />
  )

  return (
    <View style={styles.container}>
      <Animated.View style={
        {
          transform: [
            {
              translateX: animateChart.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -400],
              })
            },
          ],
          opacity: animateChart.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
          }),
        }
      }>
        {pie}
      </Animated.View>

      <Animated.View style={
        {
          transform: [
            {
              translateX: animateChart.interpolate({
                inputRange: [0, 1],
                outputRange: [400, 0],
              })
            },
          ],
          opacity: animateChart.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
          position: 'absolute',
        }
      }>
        {bar}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
})