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

//second code 

// import mysql from 'mysql2/promise';

// export const pool = mysql.createPool({
//   host: process.env.DB_HOST || '127.0.0.1',
//   port: Number(process.env.DB_PORT || 3306),
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'sehat_vault',
//   ssl: process.env.DB_HOST && process.env.DB_HOST !== '127.0.0.1' ? { rejectUnauthorized: false } : false,
//   waitForConnections: true,
//   connectionLimit: 10,
//   dateStrings: false
// });

// export async function connectDB() {
//   const connection = await pool.getConnection();
//   connection.release();
//   console.log('MySQL connected');
// }

// third code 

import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'defaultdb',
  ssl: process.env.DB_HOST && process.env.DB_HOST !== '127.0.0.1' ? { rejectUnauthorized: false } : false,
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: false
});

export async function connectDB() {
  const connection = await pool.getConnection();

  // Re-create table with both column variations or alter column if missing
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      passwordHash VARCHAR(255),
      password_hash VARCHAR(255),
      relationship VARCHAR(50) NOT NULL,
      patientName VARCHAR(255) NOT NULL,
      age INT NOT NULL,
      gender VARCHAR(20) NOT NULL,
      bloodGroup VARCHAR(10) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      address TEXT NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // If table already existed without password_hash, add it safely
  try {
    await connection.query(`ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);`);
  } catch (err) {
    // Ignore error if column already exists
  }

  connection.release();
  console.log('MySQL connected & schema verified');
}