import { createTable, getDBConnection, insertSleepItem, searchSleepItem, updateSleepItem } from "../../sqlite/sleep-service";
import { ISleep } from "../../types/SleepItem";
import { ToastAndroid } from "react-native";

const saveSleepItem = async (sleepItem: ISleep) => {
  try {
    const db = await getDBConnection();
    // Create table if not exists
    await createTable(db);
    // Check if sleepItem exists
    const sleepItemInDB = await searchSleepItem(db, sleepItem.date);
    if (sleepItemInDB && !!sleepItemInDB.quality) {
      // Update sleepItem
      await updateSleepItem(db, {
        ...sleepItem,
        _id: sleepItemInDB._id,
      });
      return;
    } else if (sleepItemInDB) {
      return;
    }
    // Insert sleepItem
    await insertSleepItem(db, sleepItem);

  } catch (error) {
    ToastAndroid.show("Save sleep item errow", ToastAndroid.SHORT);
  }
}

export default saveSleepItem;
