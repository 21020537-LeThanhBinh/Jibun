import groupBy from 'lodash/groupBy';
import filter from 'lodash/filter';
import find from 'lodash/find';
import { useState } from 'react';

import { Alert } from 'react-native';
import {
  ExpandableCalendar,
  TimelineEventProps,
  TimelineList,
  CalendarProvider,
  TimelineProps,
  CalendarUtils
} from 'react-native-calendars';

const EVENT_COLOR = '#e6add8';
const today = new Date();
export const getDate = (offset = 0) => CalendarUtils.getCalendarDateString(new Date().setDate(today.getDate() + offset));

export const timelineEvents: TimelineEventProps[] = [
  {
    start: `${getDate(-1)} 09:20:00`,
    end: `${getDate(-1)} 12:00:00`,
    title: 'Merge Request to React Native Calendars',
    summary: 'Merge Timeline Calendar to React Native Calendars'
  },
  {
    start: `${getDate()} 01:15:00`,
    end: `${getDate()} 02:30:00`,
    title: 'Meeting A',
    summary: 'Summary for meeting A',
    color: EVENT_COLOR
  },
  {
    start: `${getDate()} 01:30:00`,
    end: `${getDate()} 02:30:00`,
    title: 'Meeting B',
    summary: 'Summary for meeting B',
    color: EVENT_COLOR
  },
  {
    start: `${getDate()} 01:45:00`,
    end: `${getDate()} 02:45:00`,
    title: 'Meeting C',
    summary: 'Summary for meeting C',
    color: EVENT_COLOR
  },
  {
    start: `${getDate()} 02:40:00`,
    end: `${getDate()} 03:10:00`,
    title: 'Meeting D',
    summary: 'Summary for meeting D',
    color: EVENT_COLOR
  },
  {
    start: `${getDate()} 02:50:00`,
    end: `${getDate()} 03:20:00`,
    title: 'Meeting E',
    summary: 'Summary for meeting E',
    color: EVENT_COLOR
  },
  {
    start: `${getDate()} 04:30:00`,
    end: `${getDate()} 05:30:00`,
    title: 'Meeting F',
    summary: 'Summary for meeting F',
    color: EVENT_COLOR
  },
  {
    start: `${getDate(1)} 00:30:00`,
    end: `${getDate(1)} 01:30:00`,
    title: 'Visit Grand Mother',
    summary: 'Visit Grand Mother and bring some fruits.',
    color: 'lightblue'
  },
  {
    start: `${getDate(1)} 02:30:00`,
    end: `${getDate(1)} 03:20:00`,
    title: 'Meeting with Prof. Behjet Zuhaira',
    summary: 'Meeting with Prof. Behjet at 130 in her office.',
    color: EVENT_COLOR
  },
  {
    start: `${getDate(1)} 04:10:00`,
    end: `${getDate(1)} 04:40:00`,
    title: 'Tea Time with Dr. Hasan',
    summary: 'Tea Time with Dr. Hasan, Talk about Project'
  },
  {
    start: `${getDate(1)} 01:05:00`,
    end: `${getDate(1)} 01:35:00`,
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032'
  },
  {
    start: `${getDate(1)} 14:30:00`,
    end: `${getDate(1)} 16:30:00`,
    title: 'Meeting Some Friends in ARMED',
    summary: 'Arsalan, Hasnaat, Talha, Waleed, Bilal',
    color: 'pink'
  },
  {
    start: `${getDate(2)} 01:40:00`,
    end: `${getDate(2)} 02:25:00`,
    title: 'Meet Sir Khurram Iqbal',
    summary: 'Computer Science Dept. Comsats Islamabad',
    color: 'orange'
  },
  {
    start: `${getDate(2)} 04:10:00`,
    end: `${getDate(2)} 04:40:00`,
    title: 'Tea Time with Colleagues',
    summary: 'WeRplay'
  },
  {
    start: `${getDate(2)} 00:45:00`,
    end: `${getDate(2)} 01:45:00`,
    title: 'Lets Play Apex Legends',
    summary: 'with Boys at Work'
  },
  {
    start: `${getDate(2)} 11:30:00`,
    end: `${getDate(2)} 12:30:00`,
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032'
  },
  {
    start: `${getDate(4)} 12:10:00`,
    end: `${getDate(4)} 13:45:00`,
    title: 'Merge Request to React Native Calendars',
    summary: 'Merge Timeline Calendar to React Native Calendars'
  }
];

const INITIAL_TIME = { hour: 9, minutes: 0 };
const EVENTS: TimelineEventProps[] = timelineEvents;
export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(getDate());
  const [events, setEvents] = useState(EVENTS);
  const [eventsByDate, setEventsByDate] = useState(
    groupBy(EVENTS, (e: any) => CalendarUtils.getCalendarDateString(e.start))
  );

  const marked = {
    [`${getDate(-1)}`]: { marked: true },
    [`${getDate()}`]: { marked: true },
    [`${getDate(1)}`]: { marked: true },
    [`${getDate(2)}`]: { marked: true },
    [`${getDate(4)}`]: { marked: true }
  };

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
    onBackgroundLongPress: createNewEvent,
    onBackgroundLongPressOut: approveNewEvent,
    // scrollToFirst: true,
    // start: 0,
    // end: 24,
    unavailableHours: [{ start: 0, end: 6 }, { start: 22, end: 24 }],
    overlapEventsSpacing: 8,
    rightEdgeSpacing: 24,
  };

  // const { currentDate, eventsByDate } = this.state;

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
        markedDates={marked}
      />
      <TimelineList
        events={eventsByDate}
        timelineProps={timelineProps}
        showNowIndicator
        // scrollToNow
        scrollToFirst
        initialTime={INITIAL_TIME}
      />
    </CalendarProvider>
  );
}