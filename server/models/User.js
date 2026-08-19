import { pool } from '../config/db.js';

export async function findById(id) {
  const [rows] = await pool.query(
    `SELECT id, name, email, password_hash AS passwordHash, created_at AS createdAt,
            patient_name AS patientName, age, gender, blood_group AS bloodGroup,
            phone, address, relationship
     FROM users WHERE id = ? LIMIT 1`, [id]
  );
  return rows[0] || null;
}

export async function findByEmail(email) {
  const [rows] = await pool.query(
    `SELECT id, name, email, password_hash AS passwordHash, created_at AS createdAt,
            patient_name AS patientName, age, gender, blood_group AS bloodGroup,
            phone, address, relationship
     FROM users WHERE email = ? LIMIT 1`, [email]
  );
  return rows[0] || null;
}

export async function create(data) {
  const [result] = await pool.query(
    `INSERT INTO users
      (name,email,password_hash,patient_name,age,gender,blood_group,phone,address,relationship)
     VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [data.name, data.email, data.passwordHash, data.patient.name, data.patient.age,
     data.patient.gender, data.patient.bloodGroup, data.patient.phone,
     data.patient.address, data.relationship]
  );
  return findById(result.insertId);
}

export async function existsByEmail(email) {
  const [rows] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
  return rows.length > 0;
}
