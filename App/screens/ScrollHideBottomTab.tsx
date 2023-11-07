import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React, { useState } from "react";
import { ScrollView } from "react-native";

export default function ScrollHideBottomTab({ navigation, children }: { navigation: any, children: React.ReactNode }) {
  const [offset, setOffset] = useState(0);
  const bottomTabBarHeight = useBottomTabBarHeight();

  const onScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const dif = currentOffset - offset;

    if (dif < 0) {
      navigation.setOptions({ tabBarStyle: { display: 'flex', animated: true } });
      setOffset(currentOffset);
    } else {
      navigation.setOptions({ tabBarStyle: { display: 'none', animated: true } });
      setOffset(currentOffset - bottomTabBarHeight);
    }
  }

  return (
    <ScrollView
      scrollEventThrottle={16}
      onScroll={(e) => onScroll(e)}
    >
      {children}
    </ScrollView>
  );
}