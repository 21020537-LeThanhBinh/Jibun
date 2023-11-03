import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

export function Location() {
  const [longLat, setLongLat] = useState({
    latitude: 0,
    longitude: 0
  });

  useEffect(() => {
    // navigator.geolocation.watchPosition(
    //   position => {
    //     console.log(position);
    //     const { latitude, longitude } = position.coords;
    //     this.setState({
    //       latitude, longitude
    //     },
    //       error => console.log(error),
    //       {
    //         enableHighAccuracy: true,
    //         timeout: 20000,
    //         maximumAge: 1000,
    //         distanceFilter: 10
    //       }
    //     );
    //   }
    // );
  }, []);

  return (
    <View>

    </View>
  )
}