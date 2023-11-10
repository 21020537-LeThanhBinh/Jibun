export type AppUsage = {
  appInfo: {
    packageName: string;
    name: string;
    icon: string;
  };
  totalTimeInForeground: number;
  color?: string;
}