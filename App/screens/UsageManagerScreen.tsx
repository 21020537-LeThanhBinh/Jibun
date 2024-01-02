import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Animated, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DurationChanger from '../components/DurationChanger';
import TimeFooter from '../components/TimeFooter';
import Charts from '../components/usagemanager/Charts';
import { PermissionModal } from '../components/usagemanager/PermissionModal';
import { onScroll } from '../components/usagemanager/animateHideTabOnScroll';
import getUsageStats from '../components/usagemanager/getUsageStats';
import { AppUsage } from '../types/AppUsage';
import { formatDurationDetails } from '../utils/formatDurationDetails';

const UsageManagerScreen: () => JSX.Element = () => {
  const ADAY = 24 * 60 * 60 * 1000;

  const navigation = useNavigation();
  const [offset, setOffset] = useState(0);
  const [animateOffset] = useState(new Animated.Value(0));
  const [animateChart] = useState(new Animated.Value(0));

  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [appUsages, setAppUsages] = useState<Array<AppUsage>>([])
  const [timelyUsage, setTimelyUsage] = useState<Array<{
    totalTimeInForeground: number,
    label: string,
    startTime?: number,
    endTime?: number,
    details: AppUsage[] | undefined
  }>>([])
  const [endDate, setEndDate] = useState<number>(new Date().getTime())
  const [duration, setDuration] = useState<number>(ADAY)
  const remainingTime = (ADAY) - (endDate % (ADAY)) - 3 * 60 * 60 * 1000
  const [focusedApp, setFocusedApp] = useState<string | null>(null)
  const [currentChart, setCurrentChart] = useState<'pie' | 'bar'>('pie');
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  const otherUsageDur = appUsages
    .filter((appUsage) => appUsage.totalTimeInForeground <= 300000 || !appUsage.appInfo.name)
    .reduce((acc, cur) => acc + cur.totalTimeInForeground, 0)
  const pieChartData = [
    ...appUsages
      .filter((appUsage) => appUsage.totalTimeInForeground > 300000 && appUsage.appInfo.name)
      .sort((a, b) => b.totalTimeInForeground - a.totalTimeInForeground)
      .map(appUsage => ({ value: appUsage.totalTimeInForeground, text: appUsage.appInfo.name, icon: appUsage.appInfo.icon, packageName: appUsage.appInfo.packageName, color: appUsage.color })),
    { value: otherUsageDur, text: 'Other', icon: '', packageName: '', color: '#DDD' }
  ]
  const barChartData = timelyUsage.map((item, index) => ({
    value: item.totalTimeInForeground / (60 * 60 * 1000),
    label: item.label,
    frontColor: index == selectedIndex ? '#177AD5' : '#DDD',
    endTime: item.endTime,
  })).reverse()

  useEffect(() => {
    // Check if data is available, if not, request permission
    getUsageStats(endDate - ADAY + remainingTime, endDate).then(res => {
      setPermissionGranted(!!res && res.length > 0)
    })
  }, [])

  useEffect(() => {
    if (permissionGranted === null || permissionGranted) return
    setModalVisible(true)
  }, [permissionGranted])

  const reuseData = () => {
    if (!timelyUsage.length) return false

    const fetched = timelyUsage.find(item => item.startTime == endDate - duration + remainingTime && item.endTime == endDate)
    if (!fetched) return false

    setAppUsages(fetched.details || [])
    if (currentChart == 'bar') {
      setSelectedIndex(timelyUsage.indexOf(fetched))
    }
    return true
  }

  useEffect(() => {
    setLoading(true)

    const reused = reuseData()
    if (reused) {
      setLoading(false)
      return
    }

    setSelectedIndex(0)
    if (currentChart == 'pie') {
      getUsageStats(endDate - duration + remainingTime, endDate).then((res?: AppUsage[]) => {
        if (!res) return;
        // Todo: check if the duration is aligned with native
        setAppUsages(res)
        setLoading(false)
      })
    } else {
      const numberOfBar = 8
      Promise.all([...Array(numberOfBar).keys()].map((_, index) => {
        return getUsageStats(endDate - duration * (index + 1) + remainingTime, endDate - duration * index)
      })).then(res => {
        const usages = res.map((item?: AppUsage[], index?: number) => {
          if (!item || index == undefined) return {
            totalTimeInForeground: 0,
            label: '',
            details: []
          }
          const label = duration == ADAY ? 'D' : duration == ADAY * 7 ? 'W' : duration == ADAY * 30 ? 'M' : duration == ADAY * 365 ? 'Y' : ''
          return {
            totalTimeInForeground: item?.reduce((acc, cur) => acc + cur.totalTimeInForeground, 0) || 0,
            label: label + ' ' + (index ? (- index).toString() : ''),
            startTime: endDate - duration * (index + 1) + remainingTime,
            endTime: endDate - duration * index,
            details: item
          }
        })
        setTimelyUsage(usages)
        setAppUsages(usages[0].details || [])
        setLoading(false)
      })
    }
  }, [endDate, duration, currentChart])

  const onChangeDuration = (newDuration: number) => {
    setDuration(newDuration)
    setEndDate(new Date().getTime())
  }

  const onSlideLeft = () => {
    setCurrentChart('bar')
    Animated.spring(animateChart, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }

  const onSlideRight = () => {
    setCurrentChart('pie')
    Animated.spring(animateChart, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  }

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <PermissionModal modalVisible={modalVisible} setModalVisible={setModalVisible} />

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      )}

      <ScrollView onScroll={(event) => onScroll({ event, offset, setOffset, animateOffset, navigation })} >
        <DurationChanger duration={duration} onChangeDuration={onChangeDuration} />
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 12 }}>
          <Pressable onPress={onSlideRight} style={styles.chartBtn}>
            {currentChart != 'pie' ?
              <MaterialCommunityIcons name="chevron-left" size={24} />
              : <View style={{ width: 24 }} />}
          </Pressable>

          <Charts
            pieChartData={pieChartData}
            barChartData={barChartData}
            setFocusedApp={setFocusedApp}
            animateChart={animateChart}
            setEndDate={setEndDate}
          />

          <Pressable onPress={onSlideLeft} style={styles.chartBtn}>
            {currentChart != 'bar' ?
              <MaterialCommunityIcons name="chevron-right" size={24} />
              : <View style={{ width: 24 }} />}
          </Pressable>
        </View>

        <View style={{ width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {appUsages
            .sort((a, b) => b.totalTimeInForeground - a.totalTimeInForeground)
            .map((appUsage, index) => appUsage.totalTimeInForeground ? (
              <View key={index} style={{ width: '25%', padding: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Image source={appUsage.appInfo.icon ? { uri: `data:image/png;base64,${appUsage.appInfo.icon}` } : require('../img/android_app_icon.png')} style={{ width: 48, height: 48, borderRadius: 8 }} />
                <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#777' }}>{appUsage.appInfo.name || appUsage.appInfo.packageName} </Text>
                <Text>{formatDurationDetails(appUsage.totalTimeInForeground)}</Text>
              </View>
            ) : null)}
        </View>
      </ScrollView>

      <TimeFooter endDate={endDate} setEndDate={setEndDate} duration={duration} animateOffset={animateOffset} />
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  nav: {
    width: '100%',
    display: 'flex',
    gap: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    opacity: 0.7,
    zIndex: 1
  },
  chartBtn: {
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

export default UsageManagerScreen;