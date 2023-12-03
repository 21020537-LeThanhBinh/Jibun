import { ToastAndroid } from "react-native";
import { createTable, getDBConnection, updateSleepItem } from "../../sqlite/sleep-service";
import { ISleep } from "../../types/SleepItem";

const updateSleep = async (sleepItem: ISleep) => {
  try {
    const db = await getDBConnection();
    // Create table if not exists
    await createTable(db);
    // Update sleepItem
    await updateSleepItem(db, {
      ...sleepItem,
    });
    return;

  } catch (error) {
    ToastAndroid.show("Save sleep item errow", ToastAndroid.SHORT);
  }
}

export default updateSleep;
