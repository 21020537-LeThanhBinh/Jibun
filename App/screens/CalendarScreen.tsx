import groupBy from 'lodash/groupBy';
import filter from 'lodash/filter';
import find from 'lodash/find';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  ExpandableCalendar,
  TimelineEventProps,
  TimelineList,
  CalendarProvider,
  TimelineProps,
  CalendarUtils
} from 'react-native-calendars';
import ReminderService from '../components/ReminderService';

const today = new Date();
const getDate = (offset = 0) => CalendarUtils.getCalendarDateString(new Date().setDate(today.getDate() + offset));

const EVENTS: TimelineEventProps[] = [
  {
    start: `${getDate(-1)} 09:20:00`,
    end: `${getDate(-1)} 12:00:00`,
    title: 'Merge Request to React Native Calendars',
    summary: 'Merge Timeline Calendar to React Native Calendars'
  }
];

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(getDate());
  const [events, setEvents] = useState(EVENTS);
  const [eventsByDate, setEventsByDate] = useState(
    groupBy(EVENTS, (e: any) => CalendarUtils.getCalendarDateString(e.start))
  );

  // const marked = {
  //   [`${getDate(-1)}`]: { marked: true },
  //   [`${getDate()}`]: { marked: true },
  //   [`${getDate(1)}`]: { marked: true },
  //   [`${getDate(2)}`]: { marked: true },
  //   [`${getDate(4)}`]: { marked: true }
  // };

  useEffect(() => {
    // Todo: optimize
    const startDate = new Date(getDate(-3)).toISOString();
    const endDate = new Date(getDate(3)).toISOString();
    const Reminder = new ReminderService();
    Reminder.getEvents(startDate, endDate)
      .then((events) => {
        // Todo: add type to calendar
        setEvents(events
          .filter((event: any) => !event.allDay)
          .map((event: any) => ({
            title: event.title,
            summary: event.description,
            start: event.startDate,
            end: event.endDate
          })));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    setEventsByDate(groupBy(events, (e: any) => CalendarUtils.getCalendarDateString(e.start)));
  }, [events]);

  const onDateChanged = (date: string, source: string) => {
    console.log('TimelineCalendarScreen onDateChanged: ', date, source);
    setCurrentDate(date);
  };

  const onMonthChange = (month: any, updateSource: any) => {
    console.log('TimelineCalendarScreen onMonthChange: ', month, updateSource);
  };

  const createNewEvent: TimelineProps['onBackgroundLongPress'] = (timeString, timeObject) => {
    // const {eventsByDate} = this.state;
    const thisEventsByDate = { ...eventsByDate };
    const hourString = `${(timeObject.hour + 1).toString().padStart(2, '0')}`;
    const minutesString = `${timeObject.minutes.toString().padStart(2, '0')}`;

    const newEvent = {
      id: 'draft',
      start: `${timeString}`,
      end: `${timeObject.date} ${hourString}:${minutesString}:00`,
      title: 'New Event',
      color: 'white'
    };

    if (timeObject.date) {
      if (thisEventsByDate[timeObject.date]) {
        thisEventsByDate[timeObject.date] = [...thisEventsByDate[timeObject.date], newEvent];
        setEventsByDate(thisEventsByDate);
      } else {
        eventsByDate[timeObject.date] = [newEvent];
        setEventsByDate(thisEventsByDate);
      }
    }
  };

  const approveNewEvent: TimelineProps['onBackgroundLongPressOut'] = (_timeString, timeObject) => {
    const thisEventsByDate = { ...eventsByDate };

    Alert.prompt('New Event', 'Enter event title', [
      {
        text: 'Cancel',
        onPress: () => {
          if (timeObject.date) {
            thisEventsByDate[timeObject.date] = filter(thisEventsByDate[timeObject.date], (e: any) => e.id !== 'draft');

            setEventsByDate(thisEventsByDate);
          }
        }
      },
      {
        text: 'Create',
        onPress: eventTitle => {
          if (timeObject.date) {
            const draftEvent = find(eventsByDate[timeObject.date], { id: 'draft' });
            if (draftEvent) {
              draftEvent.id = undefined;
              draftEvent.title = eventTitle ?? 'New Event';
              draftEvent.color = 'lightgreen';
              eventsByDate[timeObject.date] = [...eventsByDate[timeObject.date]];

              setEventsByDate(thisEventsByDate);
            }
          }
        }
      }
    ]);
  };

  const timelineProps: Partial<TimelineProps> = {
    format24h: true,
    // onBackgroundLongPress: createNewEvent,
    // onBackgroundLongPressOut: approveNewEvent,
    // scrollToFirst: true,
    // start: 0,
    // end: 24,
    unavailableHours: [{ start: 0, end: 6 }, { start: 22, end: 24 }],
    overlapEventsSpacing: 8,
    rightEdgeSpacing: 24,
  };

  return (
    <CalendarProvider
      date={currentDate}
      onDateChanged={onDateChanged}
      onMonthChange={onMonthChange}
      showTodayButton
      disabledOpacity={0.6}
    // numberOfDays={3}
    >
      <ExpandableCalendar
        firstDay={1}
        leftArrowImageSource={require('../img/previous.png')}
        rightArrowImageSource={require('../img/next.png')}
      // markedDates={marked}
      />
      <TimelineList
        events={eventsByDate}
        timelineProps={timelineProps}
        showNowIndicator
        // scrollToNow
        scrollToFirst
        initialTime={{ hour: 9, minutes: 0 }}
      />
    </CalendarProvider>
  );
}