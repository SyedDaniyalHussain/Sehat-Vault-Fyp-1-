import { pool } from '../config/db.js';

export async function create(data) {
  const [result] = await pool.query(
    `INSERT INTO reports
      (user_id, original_filename, stored_filename, file_path, file_type, mime_type, file_size, report_type)
     VALUES (?,?,?,?,?,?,?,?)`,
    [data.userId, data.originalFilename, data.storedFilename, data.filePath,
     data.fileType, data.mimeType, data.fileSize, data.reportType]
  );
  return findById(result.insertId, data.userId);
}

export async function findById(id, userId = null) {
  const sql = `SELECT id, user_id AS userId, original_filename AS originalFilename,
      stored_filename AS storedFilename, file_path AS filePath, file_type AS fileType,
      mime_type AS mimeType, file_size AS fileSize, report_type AS reportType,
      uploaded_at AS uploadedAt FROM reports WHERE id = ? ${userId !== null ? 'AND user_id = ?' : ''} LIMIT 1`;
  const params = userId !== null ? [id, userId] : [id];
  const [rows] = await pool.query(sql, params);
  return rows[0] || null;
}

export async function findByUser(userId) {
  const [rows] = await pool.query(
    `SELECT id, user_id AS userId, original_filename AS originalFilename,
      stored_filename AS storedFilename, file_path AS filePath, file_type AS fileType,
      mime_type AS mimeType, file_size AS fileSize, report_type AS reportType,
      uploaded_at AS uploadedAt
     FROM reports WHERE user_id = ? ORDER BY uploaded_at DESC`, [userId]
  );
  return rows;
}

export async function findManyOwned(ids, userId) {
  if (!ids.length) return [];
  const placeholders = ids.map(() => '?').join(',');
  const [rows] = await pool.query(
    `SELECT id, user_id AS userId FROM reports
     WHERE user_id = ? AND id IN (${placeholders})`,
    [userId, ...ids]
  );
  return rows;
}

export async function remove(id, userId) {
  const [result] = await pool.query('DELETE FROM reports WHERE id = ? AND user_id = ?', [id, userId]);
  return result.affectedRows > 0;
}
