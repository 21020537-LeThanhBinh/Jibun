import notifee, { RepeatFrequency, TimestampTrigger, TriggerType } from '@notifee/react-native';

export async function onCreateTriggerNotification() {
  const channelId = await notifee.createChannel({
    id: 'jibun',
    name: 'Jibun Channel',
  });

  // get next sunday 9pm
  const date = new Date(Date.now());
  date.setDate(date.getDate() + (7 - date.getDay()) % 7);
  date.setHours(21);
  date.setMinutes(0);

  // Create a time-based trigger
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(), 
    repeatFrequency: RepeatFrequency.WEEKLY
  };

  // Create a trigger notification
  await notifee.createTriggerNotification(
    {
      id: 'jibun-weekly-report',
      title: 'Jibun Weekly Report',
      body: 'Check your app usage, sleep duration, and other in the week here.',
      android: {
        // smallIcon: './img/avatar.jpg',
        channelId: 'jibun',
      },
    },
    trigger,
  );
}