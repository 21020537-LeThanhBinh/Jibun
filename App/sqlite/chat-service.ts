import { IMessage, User } from 'react-native-gifted-chat';
import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';

interface MyIMessage {
  _id: string | number;
  text: string;
  createdAt: number;
  userId: string | number;
  image: string;
}

const chatTableName = 'chatData';
const userTableName = 'userData';

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase({ name: 'jibun.db', location: 'default' });
};

export const createChatTable = async (db: SQLiteDatabase) => {
  const query = `CREATE TABLE IF NOT EXISTS ${chatTableName}(
        textContent TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        userId INTEGER NOT NULL,
        image TEXT
    );`;

  await db.executeSql(query);
};

export const createUserTable = async (db: SQLiteDatabase) => {
  const query = `CREATE TABLE IF NOT EXISTS ${userTableName}(
        name TEXT NOT NULL,
        avatar TEXT
    );`;

  await db.executeSql(query);
};

export const getChatItems = async (db: SQLiteDatabase): Promise<IMessage[]> => {
  try {
    const chatItems: IMessage[] = [];
    const query = `SELECT ${chatTableName}.rowid as _id,textContent as text,createdAt,userId,image,name,avatar
          FROM ${chatTableName}
          INNER JOIN ${userTableName} ON ${chatTableName}.userId = ${userTableName}.rowid
          ORDER BY _id DESC;
      `;
    const results = await db.executeSql(query);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        chatItems.push({
          ...result.rows.item(index),
          user: {
            _id: result.rows.item(index).userId,
            name: result.rows.item(index).name,
            avatar: result.rows.item(index).avatar,
          }
        })
      }
    });
    return chatItems;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get chatItems !!!');
  }
};

export const saveChatItems = async (db: SQLiteDatabase, chatItems: MyIMessage[]) => {
  const insertQuery =
    `INSERT OR REPLACE INTO ${chatTableName}(textContent,createdAt,userId,image) values` +
    chatItems.map(i => `('${i.text}', '${i.createdAt}', '${i.userId}', '${i.image}')`).join(',');

  return db.executeSql(insertQuery);
};

export const saveUserItems = async (db: SQLiteDatabase, user: User[]) => {
  const insertQuery =
    `INSERT OR REPLACE INTO ${userTableName}(rowid,name,avatar) values` +
    user.map(i => `(${i._id}, '${i.name}', '${i.avatar}')`).join(',');

  return db.executeSql(insertQuery);
};

export const deleteChatItem = async (db: SQLiteDatabase, _id: number) => {
  const deleteQuery = `DELETE from ${chatTableName} where rowid = ${_id}`;
  await db.executeSql(deleteQuery);
};

export const deleteChatTable = async (db: SQLiteDatabase) => {
  const query = `drop table if exists ${chatTableName}`;

  await db.executeSql(query);
};

export const deleteUserTable = async (db: SQLiteDatabase) => {
  const query = `drop table if exists ${userTableName}`;

  await db.executeSql(query);
};