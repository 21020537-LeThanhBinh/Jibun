import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DurationChanger from '../components/DurationChanger';
import EventsDuration from '../components/overview/EventsDuration';
import Sleep from '../components/overview/Sleep';
import UsageManager from '../components/overview/UsageManager';
import SmileyFace from '../icons/SmileyFace';
import { formatDurationDetails } from '../utils/formatDurationDetails';
import Warning from '../components/overview/Warning';

const OverviewScreen: () => JSX.Element = () => {
  const ADAY = 24 * 60 * 60 * 1000;
  const today = new Date()

  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState<number>(ADAY)

  // Location data
  const [currentLocation, setCurrentLocation] = useState<any>(null);

  // Calendar data
  const [nextEvent, setNextEvent] = useState<{ title: string, startDate: string, endDate: string } | null>(null)

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

  return (
    <SafeAreaView style={{ height: '100%' }}>
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      )}
      <DurationChanger duration={duration} onChangeDuration={(newDuration) => setDuration(newDuration)} />

      <TouchableOpacity
        onPress={() => navigation.navigate('Usage' as never)}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}
      >
        <UsageManager duration={duration} setLoading={setLoading} />
      </TouchableOpacity>

      <View style={{ paddingHorizontal: 60, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 20, alignItems: 'center', marginBottom: 20 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Calendar' as never)}>
          <EventsDuration
            duration={duration}
            setNextEvent={setNextEvent}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Sleep' as never)}>
          <Sleep />
        </TouchableOpacity>

        {/* <View style={{ height: 110, width: 110 }}>
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
        </View> */}

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

        <View style={{ height: 120, width: 120 }}>
          <Text style={{
            fontSize: 12,
            textAlign: 'center',
          }}>
            <Warning />
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
    </SafeAreaView >
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