import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import UsageManagerScreen from './screens/UsageManagerScreen';
import CalendarScreen from './screens/CalendarScreen';
import OverviewScreen from './screens/Overview';
import GoogleCalendarScreen from './screens/GoogleCalendar';
import GoogleFitScreen from './screens/GoogleFitScreen';

const Tab = createBottomTabNavigator();

const App: () => JSX.Element = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Overview" component={OverviewScreen} />
        <Tab.Screen name="Usage" component={UsageManagerScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Google Calendar" component={GoogleCalendarScreen} />
        <Tab.Screen name="Google Fit" component={GoogleFitScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;