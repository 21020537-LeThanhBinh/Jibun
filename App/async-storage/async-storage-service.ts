import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToastAndroid } from "react-native";

const storeAsyncData = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    ToastAndroid.show("Error saving data", ToastAndroid.SHORT);
  }
};

const getAsyncData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    ToastAndroid.show("Error getting data", ToastAndroid.SHORT);
  }
};

export { storeAsyncData, getAsyncData };