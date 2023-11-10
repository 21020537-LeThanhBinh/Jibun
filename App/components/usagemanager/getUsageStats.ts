import { getColors } from 'react-native-image-colors';
import { AndroidImageColors } from 'react-native-image-colors/build/types';
import RTNUsageStats from 'rtn-usagestats/js/NativeUsageStats';

export default async function getUsageStats(startDate: number, endDate: number) {
  const raw = await RTNUsageStats?.getRangeUsageStats((startDate).toString(), endDate.toString())
  if (!raw) return;

  const formattedAppUsages = []
  for (let i = 0; i < raw.length; i++) {
    const appUsage = raw[i]
    const index = formattedAppUsages.findIndex((formattedAppUsage) => formattedAppUsage.appInfo.packageName == appUsage.appInfo.packageName)
    if (index == -1) formattedAppUsages.push(appUsage)
    else formattedAppUsages[index].totalTimeInForeground += appUsage.totalTimeInForeground
  }

  return await Promise.all(formattedAppUsages.map(async (formattedAppUsage) => {
    if (!formattedAppUsage.appInfo.icon) return formattedAppUsage

    const colors = await getColors('data:image/png;base64,' + formattedAppUsage.appInfo.icon, {
      fallback: '#228B22',
      cache: true,
      key: formattedAppUsage.appInfo.packageName,
    }) as AndroidImageColors

    return {
      ...formattedAppUsage,
      color: colors.vibrant
    }
  }))
}
