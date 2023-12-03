import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CalendarScreen from './screens/CalendarScreen';
import { ChatScreen } from './screens/ChatScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import { LocationScreen } from './screens/LocationScreen';
import OverviewScreen from './screens/OverviewScreen';
import SleepScreen from './screens/SleepScreen';
import UsageManagerScreen from './screens/UsageManagerScreen';

const Tab = createBottomTabNavigator();

const App: () => JSX.Element = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#177AD5',
          // tabBarHideOnKeyboard: true,
          tabBarStyle: {
            height: 50,
          },
        }}
      >
        <Tab.Screen name="Overview" component={OverviewScreen} options={{
          tabBarLabel: "Overview",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }} />
        <Tab.Screen name="Usage" component={UsageManagerScreen} options={{
          tabBarLabel: "Usage",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="application-brackets" color={color} size={size} />
          ),
        }} />
        <Tab.Screen name="Calendar" component={CalendarScreen} options={{
          tabBarLabel: "Calendar",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-account" color={color} size={size} />
          ),
        }} />
        <Tab.Screen name="Sleep" component={SleepScreen} options={{
          tabBarLabel: "Sleep",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bed" color={color} size={size} />
          ),
        }} />
        <Tab.Screen name="Chat" component={ChatScreen} options={{
          tabBarLabel: "Chat",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chat" color={color} size={size} />
          ),
        }} />
        {/* <Tab.Screen name="Location" component={LocationScreen} options={{
          tabBarLabel: "Location",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map-marker" color={color} size={size} />
          ),
        }} /> */}
        {/* <Tab.Screen name="Profile" component={OverviewScreen} options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Image source={require('./img/avatar.jpg')} style={{ borderRadius: 100, width: size, height: size }} />
          ),
        }} /> */}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;