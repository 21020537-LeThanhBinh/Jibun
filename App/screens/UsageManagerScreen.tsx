import React, { useEffect } from 'react';
import { Button, SafeAreaView, ScrollView, Text, View } from 'react-native';
import RTNUsageStats from 'rtn-usagestats/js/NativeUsageStats';
import { formatDuration } from '../utils/formatDuration';

const UsageManagerScreen: () => JSX.Element = () => {
  const [appUsages, setAppUsages] = React.useState<Array<{
    packageName: string;
    totalTimeInForeground: number;
  }>>([])
  const [endDate, setEndDate] = React.useState<number>(new Date().getTime())
  const [duration, setDuration] = React.useState<number>(7 * 24 * 60 * 60 * 1000)
  const remainingTime = (24 * 60 * 60 * 1000) - (endDate % (24 * 60 * 60 * 1000)) - 3 * 60 * 60 * 1000

  useEffect(() => {
    RTNUsageStats?.getRangeUsageStats((endDate - duration + remainingTime).toString(), endDate.toString())
      .then(res => {
        // console.log(res)
        res && setAppUsages(res)
      })
  }, [endDate, duration])

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <Button title="enableUsageStats" onPress={() => {
        RTNUsageStats?.enableUsageStats()
      }} />

      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
        <Button
          title="Weekly"
          onPress={() => {
            setDuration(7 * 24 * 60 * 60 * 1000)
            setEndDate(new Date().getTime())
          }}
          color={duration === 7 * 24 * 60 * 60 * 1000 ? 'red' : undefined}
        />
        <Button
          title="Daily"
          onPress={() => {
            setDuration(24 * 60 * 60 * 1000)
            setEndDate(new Date().getTime())
          }}
          color={duration === 24 * 60 * 60 * 1000 ? 'red' : undefined}
        />
      </View>

      <ScrollView style={{}}>
        <Text>Time: {new Date(endDate - duration + remainingTime).toLocaleString()} - {new Date(endDate).toLocaleString()}</Text>

        {appUsages.sort((a, b) => b.totalTimeInForeground - a.totalTimeInForeground).map((appUsage, index) => (
          <View key={index} style={{ display: 'flex', flexDirection: 'row' }}>
            <Text>{appUsage.packageName}: </Text>
            <Text>{formatDuration(appUsage.totalTimeInForeground)}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', position: 'absolute', bottom: 0, width: '100%' }}>
        <Button title="Previous" onPress={() => {
          setEndDate(endDate - duration)
        }} />
        <Button title="Next" onPress={() => {
          setEndDate(endDate + duration)
        }} disabled={endDate >= new Date().getTime()} />
      </View>
    </SafeAreaView>
  );
};

export default UsageManagerScreen;