import { pool } from '../config/db.js';

export async function create(data) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.query(
      `INSERT INTO shares (owner_id, token_hash, pin_hash, expires_at)
       VALUES (?,?,?,?)`,
      [data.ownerId, data.tokenHash, data.pinHash, data.expiresAt]
    );
    const shareId = result.insertId;
    for (const reportId of data.reportIds) {
      await connection.query(
        'INSERT INTO share_reports (share_id, report_id) VALUES (?,?)',
        [shareId, reportId]
      );
    }
    await connection.commit();
    return findById(shareId);
  } catch (e) {
    await connection.rollback();
    throw e;
  } finally {
    connection.release();
  }
}

export async function findById(id) {
  const [rows] = await pool.query(
    `SELECT id, owner_id AS ownerId, token_hash AS tokenHash, pin_hash AS pinHash,
            expires_at AS expiresAt, revoked_at AS revokedAt, created_at AS createdAt
     FROM shares WHERE id = ? LIMIT 1`, [id]
  );
  const share = rows[0];
  if (!share) return null;
  const [reportRows] = await pool.query(
    'SELECT report_id AS reportId FROM share_reports WHERE share_id = ? ORDER BY report_id',
    [id]
  );
  share.reportIds = reportRows.map(r => Number(r.reportId));
  return share;
}

export async function findByTokenHash(tokenHash) {
  const [rows] = await pool.query(
    `SELECT id, owner_id AS ownerId, token_hash AS tokenHash, pin_hash AS pinHash,
            expires_at AS expiresAt, revoked_at AS revokedAt, created_at AS createdAt
     FROM shares WHERE token_hash = ? LIMIT 1`, [tokenHash]
  );
  if (!rows[0]) return null;
  return findById(rows[0].id);
}

export async function findByOwner(ownerId) {
  const [rows] = await pool.query(
    `SELECT s.id, s.owner_id AS ownerId, s.expires_at AS expiresAt,
            s.revoked_at AS revokedAt, s.created_at AS createdAt,
            COUNT(sr.report_id) AS reportCount
     FROM shares s LEFT JOIN share_reports sr ON sr.share_id = s.id
     WHERE s.owner_id = ? GROUP BY s.id ORDER BY s.created_at DESC`, [ownerId]
  );
  return rows.map(r => ({...r, reportCount: Number(r.reportCount)}));
}

export async function revoke(id, ownerId) {
  const [result] = await pool.query(
    'UPDATE shares SET revoked_at = CURRENT_TIMESTAMP WHERE id = ? AND owner_id = ?',
    [id, ownerId]
  );
  return result.affectedRows > 0;
}

export async function findReportsForShare(shareId) {
  const [rows] = await pool.query(
    `SELECT r.id, r.original_filename AS originalFilename, r.stored_filename AS storedFilename,
      r.file_path AS filePath, r.file_type AS fileType, r.mime_type AS mimeType,
      r.file_size AS fileSize, r.report_type AS reportType, r.uploaded_at AS uploadedAt
     FROM reports r INNER JOIN share_reports sr ON sr.report_id = r.id
     WHERE sr.share_id = ? ORDER BY r.uploaded_at DESC`, [shareId]
  );
  return rows;
}

export async function shareContainsReport(shareId, reportId) {
  const [rows] = await pool.query(
    'SELECT 1 FROM share_reports WHERE share_id = ? AND report_id = ? LIMIT 1',
    [shareId, reportId]
  );
  return rows.length > 0;
}
