import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CalendarScreen from './screens/CalendarScreen';
import { ChatScreen } from './screens/ChatScreen';
// import GoogleCalendarScreen from './screens/GoogleCalendar';
import GoogleFitScreen from './screens/GoogleFitScreen';
import { LocationScreen } from './screens/LocationScreen';
import OverviewScreen from './screens/OverviewScreen';
import UsageManagerScreen from './screens/UsageManagerScreen';
import { Animated, View, TouchableOpacity, Text } from 'react-native';

const Tab = createBottomTabNavigator();

function MyTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;
        const icon = options.tabBarIcon;
        console.log(icon)

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 }}
          >
            <Text style={{ color: isFocused ? '#673ab7' : '#222' }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const App: () => JSX.Element = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#e91e63',
          // tabBarHideOnKeyboard: true,
        }}
        // tabBar={props => <MyTabBar {...props} />}
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
        <Tab.Screen name="Chat" component={ChatScreen} options={{
          tabBarLabel: "Chat",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chat" color={color} size={size} />
          ),
        }} />
        <Tab.Screen name="Location" component={LocationScreen} options={{
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