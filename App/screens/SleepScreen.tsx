import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Animated, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TimeFooter from '../components/TimeFooter';
import Chart from '../components/sleep/Chart';
import { onScroll } from '../components/sleep/animateHideTabOnScroll';
import fetchAllSleepItems from '../components/sleep/fetchAllSleepItems';
import { ISleep } from '../types/SleepItem';
import { formatDurationDetails } from '../utils/formatDurationDetails';

const SleepScreen: () => JSX.Element = () => {
  const ADAY = 24 * 60 * 60 * 1000;

  const navigation = useNavigation();
  const [offset, setOffset] = useState(0);
  const [animateOffset] = useState(new Animated.Value(0));
  const [loading, setLoading] = useState(false);

  const [sleepItems, setSleepItems] = useState<Array<ISleep>>([])
  const [endDate, setEndDate] = useState<number>(new Date().getTime())
  const [duration, setDuration] = useState<number>(ADAY)

  useEffect(() => {
    fetchAllSleepItems()
      .then((sleepItems) => {
        console.log(sleepItems)
        setSleepItems(sleepItems)
      })
  }, [])

  useEffect(() => {
    // setLoading(true)

  }, [endDate, duration])

  const onChangeDuration = (newDuration: number) => {
    setDuration(newDuration)
    setEndDate(new Date().getTime())
  }

  const onEditSleepItem = (date: string) => {
    console.log('edit', date)
  }

  return (
    <SafeAreaView style={{ height: '100%' }}>
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      )}

      <ScrollView onScroll={(event) => onScroll({ event, offset, setOffset, animateOffset, navigation })} >
        {/* <DurationChanger duration={duration} onChangeDuration={onChangeDuration} /> */}
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginVertical: 12 }}>
          <Chart
            sleepItems={sleepItems}
          />
        </View>

        <View style={{ width: '100%', display: 'flex', gap: 20, paddingHorizontal: 24, flexDirection: 'column-reverse' }}>
          {/* Sleep history */}
          {sleepItems.map((item) => (
            <View key={item._id} style={{}}>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                  <MaterialCommunityIcons name="sleep" size={20} style={{ width: 30 }} />
                  <Text style={{ fontSize: 14 }}>{new Date(item.date).toLocaleDateString('en-GB', { weekday: 'long' })}</Text>
                </View>

                <TouchableOpacity onPress={() => onEditSleepItem(item.date)} style={{ width: 30, height: 30 }} >
                  <MaterialCommunityIcons name="pencil-outline" size={25} />
                </TouchableOpacity>
              </View>

              <View>
                <Text style={{ fontSize: 18 }}>
                  You slept for {' '}
                  <Text style={{ fontWeight: '700' }}>{formatDurationDetails(item.endTime - item.startTime)}</Text>
                  .
                </Text>
              </View>

              <Text style={{ fontSize: 18 }}>
                <Text>From {' '}</Text>
                <Text style={{ fontWeight: '700', paddingHorizontal: 2 }} >
                  {new Date(item.startTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <Text>
                  {' '} to {' '}
                </Text>
                <Text style={{ fontWeight: '700' }} >
                  {new Date(item.endTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <Text>
                  . Quality {' '}
                </Text>
                <Text style={{ fontWeight: '700' }} >
                  {item?.quality || 'N/A'}
                </Text>
                <Text>
                  .
                </Text>
              </Text>
            </View>
          ))}
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

export default SleepScreen;