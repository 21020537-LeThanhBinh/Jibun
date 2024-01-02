import { Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { ISleep } from "../../types/SleepItem";
import { useState, useEffect } from "react";
import getAndUpdateYesterdayPossibleSleepTime from "../sleep/getAndUpdateYesterdayPossibleSleepTime";
import saveSleepItem from "../sleep/saveSleepItem";

const Sleep = () => {
  const [sleepData, setSleepData] = useState<ISleep | undefined>();
  const targetSleep = 7 * 60 * 60 * 1000;
  const sleepDuration = sleepData ? sleepData.endTime - sleepData.startTime : 0;

  useEffect(() => {
    getAndUpdateYesterdayPossibleSleepTime()
      .then((sleepData) => {
        if (sleepData) {
          console.log(sleepData);
          saveSleepItem(sleepData);
          setSleepData(sleepData);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <PieChart
      data={[
        { value: sleepDuration, text: 'Sleep', color: '#F29C6E' },
        { value: Math.max(targetSleep - sleepDuration, 2), text: 'Recommended sleep remains', color: '#DDD' }
      ]}
      donut
      centerLabelComponent={() => {
        return (
          <View>
            <Text style={{ fontSize: 16 }}>7h Sleep</Text>
            <Text style={{ fontSize: 16, textAlign: 'center' }}>{Math.round(sleepDuration / targetSleep * 100)}%</Text>
          </View>

        )
      }}
      innerRadius={40}
      radius={60}
    />
  )
}

export default Sleep;