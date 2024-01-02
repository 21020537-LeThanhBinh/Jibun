import RTNUsageStats from 'rtn-usagestats/js/NativeUsageStats';
import fetchAllSleepItems from './fetchAllSleepItems';

export default async function getAndUpdateYesterdayPossibleSleepTime() {
  const savedSleepItems = await fetchAllSleepItems()
  const lastSleepItem = savedSleepItems[savedSleepItems.length - 1]
  if (lastSleepItem.endTime > new Date().setHours(9, 0, 0, 0)) return lastSleepItem;

  const today = new Date()
  const yesterday = new Date(new Date().setDate(today.getDate() - 1))

  const raw = await RTNUsageStats?.getRangeUsageStats(yesterday.getTime().toString(), today.getTime().toString())
  if (!raw) return;

  const timeStamps = raw
    .map((appUsage) => new Date(parseInt(appUsage.appInfo.lastTimeUsed)).getTime())
    .filter((timeStamp) => timeStamp > new Date(yesterday.setHours(21, 0, 0, 0)).getTime() && timeStamp < new Date(today.setHours(9, 0, 0, 0)).getTime())
    .sort((a, b) => a - b)

  // timeStamps.map((timeStamp) => console.log(new Date(timeStamp).toLocaleString()))

  let longestOffTimeDur = 0
  let longestOffTimeStart = 0
  for (let i = 0; i < timeStamps.length - 1; i++) {
    const offTimeDur = timeStamps[i + 1] - timeStamps[i]
    if (offTimeDur > longestOffTimeDur) {
      longestOffTimeDur = offTimeDur
      longestOffTimeStart = timeStamps[i]
    }
  }

  // console.log('longestOffTimeDur', longestOffTimeDur / 1000 / 60 / 60)
  // console.log('longestOffTimeStart', new Date(longestOffTimeStart).toLocaleString())

  return {
    _id: 0,
    date: yesterday.toDateString(),
    startTime: longestOffTimeStart,
    endTime: longestOffTimeStart + longestOffTimeDur,
    quality: 0,
  }
}
