import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { ISleep } from "../../types/SleepItem";
import getAndUpdateYesterdayPossibleSleepTime from "../sleep/getAndUpdateYesterdayPossibleSleepTime";
import saveSleepItem from "../sleep/saveSleepItem";

const Warning = () => {
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
    sleepDuration / targetSleep < 0.8 ? (
      <View>
        <Text style={{ textAlign: "center", fontSize: 12 }}>
          Warning
        </Text>
        <Text style={{ textAlign: "center", fontSize: 16 }}>
          You are not getting enough sleep!
        </Text>
      </View>
    ) : sleepDuration / targetSleep < 1 ? (
      <View>
        <Text style={{ textAlign: "center", fontSize: 12 }}>
          Warning
        </Text>
        <Text style={{ textAlign: "center", fontSize: 16 }}>
          You might be a little sleepy...
        </Text>
      </View>
    ) : sleepDuration / targetSleep > 1.2 ? (
      <View>
        <Text style={{ textAlign: "center", fontSize: 12 }}>
          Warning
        </Text>
        <Text style={{ textAlign: "center", fontSize: 16 }}>
          You are sleeping too much!
        </Text>
      </View>
    ) : (
      <View>
        <Text style={{ textAlign: "center", fontSize: 16 }}>
          All good!
        </Text>
      </View>
    )
  )
}

export default Warning;