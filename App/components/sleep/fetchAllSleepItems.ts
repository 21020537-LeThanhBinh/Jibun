import { ToastAndroid } from "react-native";
import { createTable, deleteSleepItem, getDBConnection, getSleepItems } from "../../sqlite/sleep-service";

const fetchAllSleepItems = async () => {
  try {
    const db = await getDBConnection();
    // Create table if not exists
    await createTable(db);
    // Get all sleep items
    const sleepItemInDB = await getSleepItems(db);
    return sleepItemInDB.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  } catch (error) {
    ToastAndroid.show("Fetch sleep item errow", ToastAndroid.SHORT);
    return []
  }
}

export default fetchAllSleepItems;
