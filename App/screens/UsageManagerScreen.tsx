import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { getColors } from 'react-native-image-colors';
import { AndroidImageColors } from 'react-native-image-colors/build/types';
import RTNUsageStats from 'rtn-usagestats/js/NativeUsageStats';
import MyButton from '../components/buttons/Button';
import { PermissionModal } from '../components/usagemanager/PermissionModal';
import { formatDuration } from '../utils/formatDuration';
import { formatDurationDetails } from '../utils/formatDurationDetails';
import ScrollHideBottomTab from './ScrollHideBottomTab';
import { useNavigation } from '@react-navigation/native';

type AppUsage = {
  appInfo: {
    packageName: string;
    name: string;
    icon: string;
  };
  totalTimeInForeground: number;
  color?: string;
}

const UsageManagerScreen: () => JSX.Element = () => {
  const ADAY = 24 * 60 * 60 * 1000;
  const AWEEK = 7 * ADAY;
  const AMONTH = 30 * ADAY;
  const AYEAR = 365 * ADAY;

  const navigation = useNavigation();

  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [appUsages, setAppUsages] = useState<Array<AppUsage>>([])
  const otherUsageDur = appUsages
    .filter((appUsage) => appUsage.totalTimeInForeground <= 300000 || !appUsage.appInfo.name)
    .reduce((acc, cur) => acc + cur.totalTimeInForeground, 0)
  const totalUsageDur = appUsages
    .reduce((acc, cur) => acc + cur.totalTimeInForeground, 0)
  const chartData = [
    ...appUsages
      .filter((appUsage) => appUsage.totalTimeInForeground > 300000 && appUsage.appInfo.name)
      .sort((a, b) => b.totalTimeInForeground - a.totalTimeInForeground)
      .map(appUsage => ({ value: appUsage.totalTimeInForeground, text: appUsage.appInfo.name, icon: appUsage.appInfo.icon, packageName: appUsage.appInfo.packageName, color: appUsage.color })),
    { value: otherUsageDur, text: 'Other', icon: '', packageName: '', color: '#DDD' }
  ]

  const [endDate, setEndDate] = useState<number>(new Date().getTime())
  const [duration, setDuration] = useState<number>(ADAY)
  const remainingTime = (ADAY) - (endDate % (ADAY)) - 3 * 60 * 60 * 1000
  const [durationText, setDurationText] = useState<string>("")
  const [focusedApp, setFocusedApp] = useState<string | null>(null)

  useEffect(() => {
    RTNUsageStats?.getRangeUsageStats((endDate - ADAY + remainingTime).toString(), endDate.toString()).then(res => {
      setPermissionGranted(res.length > 0)
    })
  }, [])

  useEffect(() => {
    if (permissionGranted === null || permissionGranted) return
    setModalVisible(true)
  }, [permissionGranted])

  useEffect(() => {
    setLoading(true)

    RTNUsageStats?.getRangeUsageStats((endDate - duration + remainingTime).toString(), endDate.toString())
      .then(res => {
        if (res) {
          const formattedAppUsages = []
          for (let i = 0; i < res.length; i++) {
            const appUsage = res[i]
            const index = formattedAppUsages.findIndex((formattedAppUsage) => formattedAppUsage.appInfo.packageName == appUsage.appInfo.packageName)
            if (index == -1) {
              formattedAppUsages.push(appUsage)
            } else {
              formattedAppUsages[index].totalTimeInForeground += appUsage.totalTimeInForeground
            }
          }

          Promise.all(formattedAppUsages.map(async (formattedAppUsage) => {
            if (!formattedAppUsage.appInfo.icon) return {
              ...formattedAppUsage,
            }

            const colors = await getColors('data:image/png;base64,' + formattedAppUsage.appInfo.icon, {
              fallback: '#228B22',
              cache: true,
              key: formattedAppUsage.appInfo.packageName,
            }) as AndroidImageColors
            return {
              ...formattedAppUsage,
              color: colors.vibrant
            }
          })).then(finalAppUsages => {
            // Need checking if the duration is correct with native
            if (duration == ADAY) {
              setDurationText(new Date(endDate - duration + remainingTime).toDateString())
            } else {
              setDurationText(new Date(endDate - duration + remainingTime).toDateString() + `\n- ` + new Date(endDate).toDateString())
            }
            setAppUsages(finalAppUsages)
            setLoading(false)
          })
        }
      })
  }, [endDate, duration])

  const onChangeDuration = (newDuration: number) => {
    setDuration(newDuration)
    setEndDate(new Date().getTime())
  }

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <PermissionModal modalVisible={modalVisible} setModalVisible={setModalVisible} />

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      )}

      {/* <View style={styles.nav}>
        <TouchableOpacity onPress={() => { }}>
          <MaterialCommunityIcons name="chart-donut" color={"black"} size={30} />

        </TouchableOpacity>

        <TouchableOpacity onPress={() => { }}>
          <MaterialCommunityIcons name="chart-bar" color={"black"} size={30} />

        </TouchableOpacity>

        <TouchableOpacity onPress={() => { }}>
          <MaterialCommunityIcons name="cellphone-lock" color={"black"} size={30} />

        </TouchableOpacity>
      </View> */}

      <ScrollHideBottomTab navigation={navigation}>
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

        <View style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
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
        </View>

        <View style={{ width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', paddingBottom: 80 }}>
          {chartData.map((appUsage, index) => (
            <View key={index} style={{ width: '25%', padding: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: (appUsage?.packageName == focusedApp ? 1 : 0.8) }}>
              <Image source={{ uri: `data:image/png;base64,${appUsage.icon}` }} style={{ width: 50, height: 50, borderRadius: 8 }} />
              <Text>{appUsage.text} </Text>
              <Text>{formatDuration(appUsage.value)}</Text>
            </View>
          ))}
        </View>
      </ScrollHideBottomTab>

      <View style={styles.footer}>
        <MyButton
          label="<"
          onPress={() => {
            setEndDate(endDate - duration)
          }}
          outline />

        <Text>{durationText}</Text>

        <MyButton
          label=">"
          onPress={() => {
            setEndDate(endDate + duration)
          }}
          outline
          disabled={endDate >= new Date().getTime()} />
      </View>
    </SafeAreaView>
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
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    opacity: 0.8
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
  }
});

export default UsageManagerScreen;