// import mysql from 'mysql2/promise';

// export const pool = mysql.createPool({
//   host: process.env.DB_HOST || '127.0.0.1',
//   port: Number(process.env.DB_PORT || 3306),
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'sehat_vault',
//   waitForConnections: true,
//   connectionLimit: 10,
//   dateStrings: false
// });

// export async function connectDB() {
//   const connection = await pool.getConnection();
//   connection.release();
//   console.log('MySQL connected');
// }


import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sehat_vault',
  ssl: process.env.DB_HOST && process.env.DB_HOST !== '127.0.0.1' ? { rejectUnauthorized: false } : false,
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: false
});

export async function connectDB() {
  const connection = await pool.getConnection();
  connection.release();
  console.log('MySQL connected');
}