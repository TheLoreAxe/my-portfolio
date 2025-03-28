import mysql from 'mysql2/promise';

export default async function getDbConnection() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  return connection;
}
