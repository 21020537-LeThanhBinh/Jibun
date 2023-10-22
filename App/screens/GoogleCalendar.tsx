import React, { SyntheticEvent } from 'react';
import { SafeAreaView } from 'react-native';
import ApiCalendar from "react-google-calendar-api";
import { Button } from 'react-native';

const config = {
  clientId: "361670284650-upvmuj28gcqvdnn83mncqs6i8gmlo04g.apps.googleusercontent.com",
  apiKey: "AIzaSyC8dzvZp4qtZmACnatRCTb_TUFw4-K6_Yk",
  scope: "https://www.googleapis.com/auth/calendar",
  discoveryDocs: [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ],
};

const apiCalendar = new ApiCalendar(config);

const GoogleCalendarScreen: () => JSX.Element = () => {
  function handleItemClick(event: SyntheticEvent<any>, name: string): void {
    if (name === 'sign-in') {
      apiCalendar.handleAuthClick()
    } else if (name === 'sign-out') {
      apiCalendar.handleSignoutClick();
    }
  }

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <Button
        title='sign-in'
        onPress={(e: any) => handleItemClick(e, 'sign-in')}
      />
      <Button
        title='sign-out'
        onPress={(e: any) => handleItemClick(e, 'sign-out')}
      />
    </SafeAreaView>
  );
};

export default GoogleCalendarScreen;