import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { CalendarUtils } from 'react-native-calendars';
import { PieChart } from 'react-native-gifted-charts';
import DurationChanger from '../components/DurationChanger';
import ReminderService from '../components/ReminderService';
import getUsageStats from '../components/usagemanager/getUsageStats';
import { AppUsage } from '../types/AppUsage';
import { formatDurationDetails } from '../utils/formatDurationDetails';
import { Image } from 'react-native';
import SmileyFace from '../icons/SmileyFace';
import Geolocation from '@react-native-community/geolocation';

const OverviewScreen: () => JSX.Element = () => {
  const ADAY = 24 * 60 * 60 * 1000;
  const today = new Date()

  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState<number>(ADAY)

  // Location data
  const [currentLocation, setCurrentLocation] = useState<any>(null);

  // Calendar data
  const [eventsPieData, setEventsPieData] = useState<Array<{ value: number, text: string, color: string }>>([])
  const [nextEvent, setNextEvent] = useState<{ title: string, startDate: string, endDate: string } | null>(null)

  // App usage data
  const [appUsages, setAppUsages] = useState<Array<AppUsage>>([])
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
  const totalUsageDur = pieChartData.reduce((acc, cur) => acc + cur.value, 0)

  const onChangeDuration = (newDuration: number) => {
    setDuration(newDuration)
  }

  const addCurrentLocation = () => {
    Geolocation.requestAuthorization()
    Geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          ...position,
          type: "Visited",
          name: null,
          radius: null,
          timestamp: new Date().getTime(),
        }
        setCurrentLocation(newLocation);
      },
      (error) => {
        console.log(error.code, error.message);
      },
    );
  }

  useEffect(() => {
    addCurrentLocation();
  }, []);

  useEffect(() => {
    const getDate = (offset = 0) => CalendarUtils.getCalendarDateString(new Date().setDate(today.getDate() + offset));

    const startDate = new Date(getDate(2 - duration / ADAY)).toISOString();
    const endDate = new Date(getDate(2)).toISOString();
    const Reminder = new ReminderService();
    Reminder.getEvents(startDate, endDate)
      .then((events) => {
        const filteredAllDayEvents = events.filter((event: any) => !event.allDay);

        let closestTime = 24 * 60 * 60 * 1000;
        let nextEvent = null;
        for (let event of filteredAllDayEvents) {
          const time = new Date(event.startDate).getTime() - today.getTime();
          if (time > 0 && time < closestTime) {
            closestTime = time;
            nextEvent = event;
          }
        }
        setNextEvent({
          title: nextEvent?.title || '',
          startDate: nextEvent?.startDate || '',
          endDate: nextEvent?.endDate || ''
        });

        const eventsDuration = filteredAllDayEvents
          .map((event: any) => {
            return {
              text: event.title,
              value: new Date(event.endDate).getTime() - new Date(event.startDate).getTime(),
              color: event.calendar.color
            }
          });
        for (let i = 0; i < eventsDuration.length; i++) {
          for (let j = i + 1; j < eventsDuration.length; j++) {
            if (eventsDuration[i].text === eventsDuration[j].text) {
              eventsDuration[i].value += eventsDuration[j].value;
              eventsDuration.splice(j, 1);
              j--;
            }
          }
        }

        setEventsPieData([
          ...eventsDuration.sort((a, b) => b.value - a.value),
          {
            value: duration - eventsDuration.reduce((acc, cur) => acc + cur.value, 0),
            text: 'Other',
            color: '#DDD'
          }
        ]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [duration]);

  useEffect(() => {
    setLoading(true)

    const remainingTime = (ADAY) - (today.getTime() % (ADAY)) - 3 * 60 * 60 * 1000
    getUsageStats(today.getTime() - duration + remainingTime, today.getTime()).then((res?: AppUsage[]) => {
      if (res) {
        setAppUsages(res)
        setLoading(false)
      }
    })
  }, [duration])

  return (
    <SafeAreaView style={{ height: '100%' }}>
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      )}

      <DurationChanger duration={duration} onChangeDuration={onChangeDuration} />

      <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
        <PieChart
          data={pieChartData}
          donut
          centerLabelComponent={() => {
            return (
              <View>
                <Text style={{ fontSize: 16 }}>App usage duration</Text>
                <Text style={{ fontSize: 24, textAlign: 'center' }}>{formatDurationDetails(totalUsageDur)}</Text>
              </View>
            )
          }}
          innerRadius={80}
          radius={110}
        />
      </View>

      <View style={{ paddingHorizontal: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 20, alignItems: 'center', marginBottom: 20 }}>
        <PieChart
          data={eventsPieData}
          donut
          centerLabelComponent={() => {
            return <Text style={{ fontSize: 16 }}>Events duration</Text>;
          }}
          innerRadius={40}
          radius={60}
        />

        <PieChart
          data={[
            { value: 5 * 60 * 60 * 1000, text: 'Sleep', color: '#F29C6E' },
            { value: 2 * 60 * 60 * 1000, text: 'Recommended sleep remains', color: '#DDD' }
          ]}
          donut
          centerLabelComponent={() => {
            return (
              <View>
                <Text style={{ fontSize: 16 }}>7h Sleep</Text>
                <Text style={{ fontSize: 16, textAlign: 'center' }}>{Math.round(5 / 7 * 100)}%</Text>
              </View>

            )
          }}
          innerRadius={40}
          radius={60}
        />

        <View style={{ height: 120, width: 120 }}>
          <Text style={{
            fontSize: 12,
            textAlign: 'center',
          }}>
            Warning...
          </Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ height: 110, width: 110 }}>
          <Text style={{
            fontSize: 12,
            textAlign: 'center',
          }}>
            Next event:
          </Text>
          {nextEvent && (
            <>
              <Text style={{
                fontSize: 16,
                textAlign: 'center',
              }}>
                {nextEvent?.title}
              </Text>
              <Text style={{
                fontSize: 12,
                textAlign: 'center',
              }}>
                in {formatDurationDetails(new Date(nextEvent?.startDate).getTime() - today.getTime())}
              </Text>
            </>
          )}

        </View>

        <View style={{ height: 110, width: 110 }}>
          <Text style={{
            fontSize: 12,
            textAlign: 'center',
          }}>
            Your location is
          </Text>
          <Text style={{
            fontSize: 16,
            textAlign: 'center',
          }}>
            {currentLocation?.coords.latitude}, {currentLocation?.coords.longitude}
          </Text>
        </View>

        <View style={{ position: 'relative' }}>
          <View style={{ position: 'absolute', top: 0, left: -5, zIndex: 1, padding: 8, borderRadius: 16, borderWidth: 1, borderColor: '#c0c0c0', backgroundColor: "#f2f2f2", display: 'flex', flexDirection: 'row', gap: 6 }}>
            <SmileyFace height={18} width={18} />
            <SmileyFace height={18} width={18} />
            <SmileyFace height={18} width={18} />
          </View>

          <View style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 1, padding: 4, borderRadius: 100, backgroundColor: '#f2f2f2' }}>
            <View style={{ backgroundColor: "#3ac508", padding: 10, borderRadius: 100 }} />
          </View>

          <Image
            source={require('../img/avatar.jpg')}
            style={{ width: 100, height: 100, borderRadius: 100, marginTop: 10, marginLeft: 5 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    zIndex: 2
  },
});

export default OverviewScreen;