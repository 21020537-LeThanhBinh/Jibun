import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';
import { ISleep } from '../types/SleepItem';

const tableName = 'sleepData';

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase({ name: 'jibun.db', location: 'default' });
};

export const createTable = async (db: SQLiteDatabase) => {
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        date TEXT NOT NULL,
        startTime INTEGER NOT NULL,
        endTime INTEGER NOT NULL,
        quality INTEGER NOT NULL
    );`;

  await db.executeSql(query);
};

export const getSleepItems = async (db: SQLiteDatabase): Promise<ISleep[]> => {
  try {
    const sleepItems: ISleep[] = [];
    const query = `SELECT ${tableName}.rowid as _id,date,startTime,endTime,quality
          FROM ${tableName}
          ORDER BY _id DESC;
      `;
    const results = await db.executeSql(query);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        sleepItems.push({
          ...result.rows.item(index),
        })
      }
    });
    return sleepItems;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const searchSleepItem = async (db: SQLiteDatabase, date: string): Promise<ISleep | null> => {
  try {
    const query = `SELECT ${tableName}.rowid as _id,date,startTime,endTime,quality
          FROM ${tableName}
          WHERE date = ?
          ORDER BY _id DESC;
      `;
    const results = await db.executeSql(query, [date]);
    if (results[0].rows.length > 0) {
      return results[0].rows.item(0);
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const insertSleepItem = async (db: SQLiteDatabase, sleepItem: ISleep) => {
  try {
    const query = `INSERT INTO ${tableName}(date,startTime,endTime,quality) VALUES(?,?,?,?);`;
    await db.executeSql(query, [sleepItem.date, sleepItem.startTime, sleepItem.endTime, sleepItem.quality]);
  } catch (error) {
    console.log(error);
  }
};

export const deleteSleepItem = async (db: SQLiteDatabase, sleepItem: ISleep) => {
  try {
    const query = `DELETE FROM ${tableName} WHERE rowid = ?;`;
    await db.executeSql(query, [sleepItem._id]);
  } catch (error) {
    console.log(error);
  }
};

export const updateSleepItem = async (db: SQLiteDatabase, sleepItem: ISleep) => {
  try {
    const query = `UPDATE ${tableName} SET date = ?, startTime = ?, endTime = ?, quality = ? WHERE rowid = ?;`;
    await db.executeSql(query, [sleepItem.date, sleepItem.startTime, sleepItem.endTime, sleepItem.quality, sleepItem._id]);
  } catch (error) {
    console.log(error);
  }
};

export const deleteTable = async (db: SQLiteDatabase) => {
  const query = `drop table if exists ${tableName}`;

  await db.executeSql(query);
};