import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, ScrollView, Text, View, Modal, Pressable, StyleSheet, Image } from 'react-native';
import RTNUsageStats from 'rtn-usagestats/js/NativeUsageStats';
import { formatDuration } from '../utils/formatDuration';
import { PermissionModal } from '../components/usagemanager/PermissionModal';
import { PieChart } from 'react-native-gifted-charts';

const UsageManagerScreen: () => JSX.Element = () => {
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [appUsages, setAppUsages] = useState<Array<{
    packageName: string;
    appInfo: {
      packageName: string;
      name: string;
      icon: string;
    };
    totalTimeInForeground: number;
  }>>([])
  const [totalUsage, setTotalUsage] = useState<number>(0)
  const [endDate, setEndDate] = useState<number>(new Date().getTime())
  const [duration, setDuration] = useState<number>(7 * 24 * 60 * 60 * 1000)
  const remainingTime = (24 * 60 * 60 * 1000) - (endDate % (24 * 60 * 60 * 1000)) - 3 * 60 * 60 * 1000

  useEffect(() => {
    // Todo: implement in native
    // RTNUsageStats?.isUsageStatsEnabled().then(res => {
    //   setPermissionGranted(res)
    // })
    RTNUsageStats?.getTodayUsageStats()
  }, [])

  useEffect(() => {
    if (permissionGranted === null || permissionGranted) return
    setModalVisible(true)
  }, [permissionGranted])

  useEffect(() => {
    RTNUsageStats?.getRangeUsageStats((endDate - duration + remainingTime).toString(), endDate.toString())
      .then(res => {
        // console.log(res)
        if (res) {
          setAppUsages(res)
          setTotalUsage(res.reduce((acc, cur) => acc + cur.totalTimeInForeground, 0))
        }
      })
  }, [endDate, duration])

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <PermissionModal modalVisible={modalVisible} setModalVisible={setModalVisible} />

      <View style={{ display: 'flex', alignItems: 'center' }}>
        <PieChart
          data={appUsages
            .sort((a, b) => b.totalTimeInForeground - a.totalTimeInForeground)
            // .filter((appUsage) => appUsage.totalTimeInForeground > 300000)
            .map(appUsage => ({ value: appUsage.totalTimeInForeground, text: appUsage.appInfo.name || appUsage.appInfo.packageName }))
          }
          donut
          centerLabelComponent={() => {
            return <Text style={{ fontSize: 30 }}>{formatDuration(totalUsage)}</Text>;
          }}
          innerRadius={80}
          // showText
        />
      </View>

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
            <Image source={{ uri: `data:image/png;base64,${appUsage.appInfo.icon}` }} style={{ width: 50, height: 50 }} />
            <Text>{appUsage.appInfo.name || appUsage.appInfo.packageName}: </Text>
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