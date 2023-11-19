import Geolocation from '@react-native-community/geolocation';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Circle, Defs, G, Line, Marker, Path, Svg } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { formatDuration } from '../utils/formatDuration';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';

interface LocationInfo {
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number;
    altitudeAccuracy: number | null;
    // heading: number | null;
    speed: number | null;
  };
  timestamp: number;
  type: string;
  name: string | null;
  description?: string;
  radius: number | null;
  images?: string[];
}

// Todo: track location in background using expo's library after requesting permissions from google
export function LocationScreen() {
  const [locationHistory, setLocationHistory] = useState<LocationInfo[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationInfo | null>(null);
  const [points, setPoints] = useState<any>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const screenWidth = Dimensions.get('window').width;

  const storeLocation = async (data: LocationInfo) => {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem('location', jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  const addCurrentLocation = () => {
    Geolocation.requestAuthorization()
    Geolocation.getCurrentPosition(
      (position) => {
        const newLocation: LocationInfo = {
          ...position,
          type: "Visited",
          name: null,
          radius: null,
          timestamp: new Date().getTime(),
        }
        console.log(newLocation);
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
    if (!currentLocation || currentLocation.timestamp === locationHistory.at(-1)?.timestamp) return;

    const positions = [];
    for (let item of [...locationHistory, currentLocation]) {
      if (item?.coords.latitude && item?.coords.longitude && !isNaN(item?.coords.latitude) && !isNaN(item?.coords.longitude) && item?.coords.latitude !== Infinity && item?.coords.longitude !== Infinity)
        positions.push([item.coords.latitude, item.coords.longitude]);
    }

    //calculate coordinate range for a scale factor
    let xArr = positions.map((val: any) => { return val[0] });
    let xMin = Math.min(...xArr);
    let xMax = Math.max(...xArr);
    let yArr = positions.map((val: any) => { return val[1] });
    let yMin = Math.min(...yArr);
    let yMax = Math.max(...yArr);

    let xRange = xMax - xMin;
    let yRange = yMax - yMin;
    let scale = 180 / Math.max(...[xRange, yRange]);

    //scale coordinates
    for (let i = 0; i < positions.length; i++) {
      let [x, y] = [positions[i][0], positions[i][1]];
      positions[i][0] = 10 + (x - xMin) * scale;
      positions[i][1] = 10 + (y - yMin) * scale;
    }

    setPoints(positions);
    setLocationHistory([...locationHistory, currentLocation]);
  }, [currentLocation]);

  return (
    <View style={{ minHeight: '100%', flex: 1 }}>
      <View style={{ marginHorizontal: 10 }}>
        <Text >
          Your Map
        </Text>
      </View>
      <View style={styles.container}>
        <Svg height={200} width={200} rotation={-90} style={{ margin: 20 }}>
          {points
            .filter((item: any) => item.length === 2 && item[0] && item[1] && !isNaN(item[0]) && !isNaN(item[1]) && item[0] !== Infinity && item[1] !== Infinity)
            .map((item: any, index: number) => {
              return (
                <Circle cx={item[0]} cy={item[1]} r="2" key={index} onPress={() => console.log("pressing a location")} />
              )
            })
          }
        </Svg>
      </View>

      <ScrollView>
        {locationHistory.reverse().map((location: LocationInfo, index: number) => {
          return (
            <Pressable
              key={location.timestamp}
              style={styles.locationItem}
            // onPress={() => setSelected(location.timestamp)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.locationItemTitle}>{location.name || "Visited location"}</Text>
                <Text>{formatDuration(new Date().getTime() - location.timestamp)} ago</Text>
                <Text>[{location.coords.latitude}, {location.coords.longitude}]</Text>
              </View>

              <Pressable style={styles.locationItemEdit}>
                <Icon name="edit" size={20} />
              </Pressable>
            </Pressable>
          )
        })}
      </ScrollView>

      <View>
        <Pressable style={[styles.addBtn, { left: screenWidth / 2 - 30 }]} onPress={() => addCurrentLocation()}>
          <Icon name="plus" size={24} color="white" />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  locationItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 10,
  },
  selectedLocationItem: {
    color: 'red',
    borderColor: 'red',
  },
  locationItemEdit: {
    width: 20,
    marginHorizontal: 20,
  },
  locationItemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addBtn: {
    position: 'relative',
    bottom: 70,
    backgroundColor: '#177AD5',
    borderRadius: 60,
    width: 60,
    height: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});