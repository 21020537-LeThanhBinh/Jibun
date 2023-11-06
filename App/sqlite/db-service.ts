import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';

interface IMessage {
  _id: string | number;
  text: string;
  createdAt: number;
  userId: string | number;
  image: string | undefined;
}

const tableName = 'chatData';

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase({ name: 'chat-data.db', location: 'default' });
};

export const createTable = async (db: SQLiteDatabase) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        textContent TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        userId INTEGER NOT NULL,
        image TEXT,
    );`;

  await db.executeSql(query);
};

export const getChatItems = async (db: SQLiteDatabase): Promise<IMessage[]> => {
  try {
    const chatItems: IMessage[] = [];
    const results = await db.executeSql(`SELECT rowid as _id,textContent as text,createdAt,userId,image FROM ${tableName}`);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        chatItems.push(result.rows.item(index))
      }
    });
    return chatItems;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get chatItems !!!');
  }
};

export const saveChatItems = async (db: SQLiteDatabase, chatItems: IMessage[]) => {
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName}(rowid, textContent,createdAt,userId,image) values` +
    chatItems.map(i => `(${i._id}, '${i.text}', '${i.createdAt}', '${i.userId}', '${i.image}')`).join(',');

  return db.executeSql(insertQuery);
};

export const deleteTodoItem = async (db: SQLiteDatabase, _id: number) => {
  const deleteQuery = `DELETE from ${tableName} where rowid = ${_id}`;
  await db.executeSql(deleteQuery);
};

export const deleteTable = async (db: SQLiteDatabase) => {
  const query = `drop table ${tableName}`;

  await db.executeSql(query);
};