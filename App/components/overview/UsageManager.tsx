import { useEffect, useState } from "react"
import { Text, View } from "react-native"
import { PieChart } from "react-native-gifted-charts"
import { getAsyncData, storeAsyncData } from "../../async-storage/async-storage-service"
import { AppUsage } from "../../types/AppUsage"
import { formatDurationDetails } from "../../utils/formatDurationDetails"
import getUsageStats from "../usagemanager/getUsageStats"

const UsageManager = ({ duration, setLoading }: { duration: number, setLoading: (l: boolean) => void }) => {
  const ADAY = 24 * 60 * 60 * 1000;
  const today = new Date()

  const [appUsages, setAppUsages] = useState<Array<AppUsage>>([])
  const otherUsageDur = appUsages
    .filter((appUsage) => appUsage.totalTimeInForeground <= 300000 || !appUsage.appInfo.name)
    .reduce((acc, cur) => acc + cur.totalTimeInForeground, 0)
  const pieChartData = [
    ...appUsages
      .filter((appUsage) => appUsage.totalTimeInForeground > 300000 && appUsage.appInfo.name)
      .sort((a, b) => b.totalTimeInForeground - a.totalTimeInForeground)
      .map(appUsage => ({ value: appUsage.totalTimeInForeground, text: appUsage.appInfo.name, icon: appUsage.appInfo.icon, packageName: appUsage.appInfo.packageName, color: appUsage.color })),
    { value: otherUsageDur, text: 'Other', icon: '', packageName: '', color: '#DDD' }
  ]
  const totalUsageDur = pieChartData.reduce((acc, cur) => acc + cur.value, 0)

  useEffect(() => {
    setLoading(true)

    getAsyncData('usage-manager').then((res?: AppUsage[]) => {
      if (res) {
        setAppUsages(res)
        setLoading(false)
      }
    })

    const remainingTime = (ADAY) - (today.getTime() % (ADAY)) - 3 * 60 * 60 * 1000
    getUsageStats(today.getTime() - duration + remainingTime, today.getTime()).then((res?: AppUsage[]) => {
      if (res) {
        setAppUsages(res)
        storeAsyncData('usage-manager', res)
      }
      setLoading(false)
    })
  }, [duration])

  return (
    <PieChart
      data={pieChartData}
      donut
      centerLabelComponent={() => {
        return (
          <View>
            <Text numberOfLines={1} style={{ fontSize: 16, }}>App usage duration</Text>
            <Text style={{ fontSize: 24, textAlign: 'center' }}>{formatDurationDetails(totalUsageDur)}</Text>
          </View>
        )
      }}
      innerRadius={80}
      radius={110}
    />
  )
}

export default UsageManager