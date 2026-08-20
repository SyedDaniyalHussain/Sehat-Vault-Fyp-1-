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

// import mysql from 'mysql2/promise';

// export const pool = mysql.createPool({
//   host: process.env.DB_HOST || '127.0.0.1',
//   port: Number(process.env.DB_PORT || 3306),
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'defaultdb',
//   ssl: process.env.DB_HOST && process.env.DB_HOST !== '127.0.0.1' ? { rejectUnauthorized: false } : false,
//   waitForConnections: true,
//   connectionLimit: 10,
//   dateStrings: false
// });

// export async function connectDB() {
//   const connection = await pool.getConnection();

//   // Create table with all required snake_case columns
//   await connection.query(`
//     CREATE TABLE IF NOT EXISTS users (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       name VARCHAR(255) NOT NULL,
//       email VARCHAR(255) NOT NULL UNIQUE,
//       password_hash VARCHAR(255) NOT NULL,
//       relationship VARCHAR(50) NOT NULL,
//       patient_name VARCHAR(255) NOT NULL,
//       age INT NOT NULL,
//       gender VARCHAR(20) NOT NULL,
//       blood_group VARCHAR(10) NOT NULL,
//       phone VARCHAR(50) NOT NULL,
//       address TEXT NOT NULL,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     );
//   `);

//   // Safely add any missing snake_case columns if table was created previously with camelCase
//   const columnsToAdd = [
//     `ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);`,
//     `ALTER TABLE users ADD COLUMN patient_name VARCHAR(255);`,
//     `ALTER TABLE users ADD COLUMN blood_group VARCHAR(10);`,
//     `ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`
//   ];

//   for (const query of columnsToAdd) {
//     try {
//       await connection.query(query);
//     } catch (err) {
//       // Ignore if column already exists
//     }
//   }

//   connection.release();
//   console.log('MySQL connected & schema fully updated');
// }


// fourth code 
// import mysql from 'mysql2/promise';

// export const pool = mysql.createPool({
//   host: process.env.DB_HOST || '127.0.0.1',
//   port: Number(process.env.DB_PORT || 3306),
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'defaultdb',
//   ssl: process.env.DB_HOST && process.env.DB_HOST !== '127.0.0.1' ? { rejectUnauthorized: false } : false,
//   waitForConnections: true,
//   connectionLimit: 10,
//   dateStrings: false
// });

// export async function connectDB() {
//   const connection = await pool.getConnection();

//   try {
//     // 1. Drop old conflicting table to reset structure
//     await connection.query(`DROP TABLE IF EXISTS users;`);

//     // 2. Re-create users table with exact snake_case columns matching your User.js model
//     await connection.query(`
//       CREATE TABLE users (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         email VARCHAR(255) NOT NULL UNIQUE,
//         password_hash VARCHAR(255) NOT NULL,
//         relationship VARCHAR(50) NOT NULL,
//         patient_name VARCHAR(255) NOT NULL,
//         age INT NOT NULL,
//         gender VARCHAR(20) NOT NULL,
//         blood_group VARCHAR(10) NOT NULL,
//         phone VARCHAR(50) NOT NULL,
//         address TEXT NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       );
//     `);
//     console.log('MySQL users table initialized successfully with clean schema');
//   } catch (err) {
//     console.error('Database migration error:', err);
//   } finally {
//     connection.release();
//   }
// }

//fifth code 
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

  try {
    // 1. Ensure users table exists with clean schema
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        relationship VARCHAR(50) NOT NULL,
        patient_name VARCHAR(255) NOT NULL,
        age INT NOT NULL,
        gender VARCHAR(20) NOT NULL,
        blood_group VARCHAR(10) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        address TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Auto-create reports table required for reportController
    await connection.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        original_filename VARCHAR(255) NOT NULL,
        stored_filename VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_type VARCHAR(100),
        mime_type VARCHAR(100),
        file_size INT,
        report_type VARCHAR(100),
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    console.log('MySQL connected: users & reports tables initialized');
  } catch (err) {
    console.error('Database migration error:', err);
  } finally {
    connection.release();
  }
}