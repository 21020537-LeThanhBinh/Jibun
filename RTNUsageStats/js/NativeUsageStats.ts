import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  enableUsageStats(): Promise<string>;
  getTodayUsageStats(): Promise<Array<{
    packageName: string;
    totalTimeInForeground: number;
  }>>;
  getRangeUsageStats(startTimeMiliStr: string, endTimeMiliStr: string): Promise<Array<{
    appInfo: {
      packageName: string;
      name: string;
      icon: string;
      lastTimeUsed: string;
    };
    totalTimeInForeground: number;
  }>>;
}

export default TurboModuleRegistry.get<Spec>(
  'RTNUsageStats',
) as Spec | null;