import { View, Text, Animated, StyleSheet } from "react-native";
import MyButton from "../buttons/Button";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatDurationDetails } from '../../utils/formatDurationDetails';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import { useState } from "react";
import { Pressable } from "react-native";

export default function Charts({ chartData, setFocusedApp }: { chartData: any[], setFocusedApp: any }) {
  const [animateChart] = useState(new Animated.Value(0));
  const [currentChart, setCurrentChart] = useState('pie');
  const totalUsageDur = chartData
    .reduce((acc, cur) => acc + cur.value, 0)

  const onSlideLeft = () => {
    setCurrentChart('pie')
    Animated.spring(animateChart, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }

  const onSlideRight = () => {
    setCurrentChart('bar')
    Animated.spring(animateChart, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  }

  const pie = (
    <PieChart
      data={chartData}
      donut
      centerLabelComponent={() => {
        return <Text style={{ fontSize: 30 }}>{formatDurationDetails(totalUsageDur)}</Text>;
      }}
      innerRadius={90}
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
      data={chartData.filter((item, index) => index < 8)}
      roundedTop
      roundedBottom
      frontColor={'#177AD5'}
      barWidth={10}
      height={240}
    />
  )

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          console.log("pressed")
          onSlideLeft()
        }}
        style={[styles.button]}
      >
        {currentChart != 'pie' ? (
          <MaterialCommunityIcons name="chevron-left" size={24} />
        ) : (
          <View style={{ width: 24 }}/>
        )}
      </Pressable>

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

      <Pressable
        onPress={() => {
          console.log("pressed")
          onSlideRight()
        }}
        style={[styles.button]}
      >
        {currentChart != 'bar' ? (
          <MaterialCommunityIcons name="chevron-right" size={24} />
        ) : (
          <View style={{ width: 24 }}/>
        )}
      </Pressable>
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
  button: {
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textOutline: {
    color: 'blue',
  },
})