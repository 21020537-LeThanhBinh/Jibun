import { PieChart } from "react-native-gifted-charts";
import { useState, useEffect } from "react";
import { Text, ToastAndroid } from "react-native";
import { CalendarUtils } from "react-native-calendars";
import ReminderService from "../ReminderService";
import { getAsyncData, storeAsyncData } from "../../async-storage/async-storage-service";

const Reminder = new ReminderService();

const EventsDuration = ({ duration, setNextEvent }: { duration: number, setNextEvent: (e: any) => void }) => {
  const ADAY = 24 * 60 * 60 * 1000;
  const today = new Date()

  const [events, setEvents] = useState<any[]>([])
  const [eventsPieData, setEventsPieData] = useState<Array<{ value: number, text: string, color: string }>>([])

  const getNextEvent = (events: any[]) => {
    let closestTime = 24 * 60 * 60 * 1000;
    let nextEvent = null;
    for (let event of events) {
      const time = new Date(event.startDate).getTime() - today.getTime();
      if (time > 0 && time < closestTime) {
        closestTime = time;
        nextEvent = event;
      }
    }

    return {
      title: nextEvent?.title || '',
      startDate: nextEvent?.startDate || '',
      endDate: nextEvent?.endDate || ''
    }
  }

  const getEventsPieData = (events: any[]) => {
    const eventsDuration = events
      .map((event: any) => {
        return {
          text: event.title,
          value: new Date(event.endDate).getTime() - new Date(event.startDate).getTime(),
          color: event.calendar.color
        }
      });

    for (let i = 0; i < eventsDuration.length; i++) {
      for (let j = i + 1; j < eventsDuration.length; j++) {
        if (eventsDuration[i].text === eventsDuration[j].text) {
          eventsDuration[i].value += eventsDuration[j].value;
          eventsDuration.splice(j, 1);
          j--;
        }
      }
    }

    return [
      ...eventsDuration.sort((a, b) => b.value - a.value),
      // {
      //   value: duration - eventsDuration.reduce((acc, cur) => acc + cur.value, 0),
      //   text: 'Other',
      //   color: '#DDD'
      // }
    ]
  }

  const fetchEvents = async (startDate: string, endDate: string) => {
    let nextEvent = await getAsyncData('next-event')
    nextEvent && setNextEvent(nextEvent)
    let eventsDuration = await getAsyncData('events-duration')
    eventsDuration && setEventsPieData(eventsDuration)

    try {
      const events = await Reminder.getEvents(startDate, endDate)
      setEvents(events)
      const filteredAllDayEvents = events.filter((event: any) => !event.allDay);

      nextEvent = getNextEvent(filteredAllDayEvents)
      storeAsyncData('next-event', nextEvent)
      setNextEvent(nextEvent);

      eventsDuration = getEventsPieData(filteredAllDayEvents)
      storeAsyncData('events-duration', eventsDuration) 
      setEventsPieData(eventsDuration)

    } catch (error) {
      ToastAndroid.show("Error fetching events", ToastAndroid.SHORT);
    }
  }

  useEffect(() => {
    const getDate = (offset = 0) => CalendarUtils.getCalendarDateString(new Date().setDate(today.getDate() + offset));

    // 0h - 24h today
    const startDate = new Date(getDate(2 - duration / ADAY)).toISOString();
    const endDate = new Date(getDate(2)).toISOString();

    fetchEvents(startDate, endDate)
  }, [duration]);

  return (
    <PieChart
      data={eventsPieData}
      donut
      centerLabelComponent={() => {
        return <Text style={{ fontSize: 16 }}>Events duration</Text>;
      }}
      innerRadius={40}
      radius={60}
    />
  )
}

export default EventsDuration;