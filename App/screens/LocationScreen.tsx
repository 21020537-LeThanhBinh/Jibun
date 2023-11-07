import React from 'react';
import { View } from 'react-native';

// Todo: track location in background using expo's library after requesting permissions from google
export function LocationScreen() {
  // useEffect(() => {
  //   Geolocation.requestAuthorization(() => {
  //     console.log('Authorization requested');
  //   }, (error) => {
  //     console.log(error.code, error.message);
  //   });

  //   // Todo: increase interval to a few minutes
  //   setInterval(() => {
  //     Geolocation.getCurrentPosition(
  //       (position) => {
  //         console.log(new Date().getTime(), position);
  //       },
  //       (error) => {
  //         console.log(error.code, error.message);
  //       },
  //     );
  //   }, 1000);

  // }, []);

  return (
    <View>

    </View>
  )
}