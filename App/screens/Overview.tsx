import React from 'react';
import { SafeAreaView } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

const data = [{ value: 50 }, { value: 80 }, { value: 90 }, { value: 70 }]

const OverviewScreen: () => JSX.Element = () => {
  return (
    <SafeAreaView style={{ height: '100%' }}>
      <PieChart data={data} donut />

    </SafeAreaView>
  );
};

export default OverviewScreen;