import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  add(a: number, b: number): Promise<number>;
  checkEquals(a: number, b: number): Promise<boolean>;
  fibonacci(n: number, callback: (error: string | null, fibs: Array<number>) => void): void;
}

export default TurboModuleRegistry.get<Spec>(
  'RTNCalculator',
) as Spec | null;