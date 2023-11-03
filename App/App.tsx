import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CalendarScreen from './screens/CalendarScreen';
import { Chat } from './screens/Chat';
// import GoogleCalendarScreen from './screens/GoogleCalendar';
import GoogleFitScreen from './screens/GoogleFitScreen';
import OverviewScreen from './screens/Overview';
import UsageManagerScreen from './screens/UsageManagerScreen';
import { Location } from './screens/Location';

const Tab = createBottomTabNavigator();

const App: () => JSX.Element = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#e91e63',
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
        {/* <Tab.Screen name="GCalendar" component={GoogleCalendarScreen} options={{
          tabBarLabel: "Calendar",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-account" color={color} size={size} />
          ),
        }} /> */}
        <Tab.Screen name="Google Fit" component={GoogleFitScreen} options={{
          tabBarLabel: "Google Fit",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="google-fit" color={color} size={size} />
          ),
        }} />
        <Tab.Screen name="Chat" component={Chat} options={{
          tabBarLabel: "Chat",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chat" color={color} size={size} />
          ),
        }} />
        <Tab.Screen name="Location" component={Location} options={{
          tabBarLabel: "Location",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map-marker" color={color} size={size} />
          ),
        }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;