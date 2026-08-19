CREATE DATABASE IF NOT EXISTS sehat_vault
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sehat_vault;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  patient_name VARCHAR(150) NOT NULL,
  age INT UNSIGNED NOT NULL,
  gender VARCHAR(50) NOT NULL,
  blood_group VARCHAR(20) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address VARCHAR(500) NOT NULL,
  relationship ENUM('Myself','Child','Parent','Sibling','Spouse','Other') NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  CONSTRAINT chk_users_age CHECK (age <= 130)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS reports (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  stored_filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(1000) NOT NULL,
  file_type VARCHAR(30) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size BIGINT UNSIGNED NOT NULL,
  report_type VARCHAR(100) NULL,
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_reports_stored_filename (stored_filename),
  KEY idx_reports_user_id (user_id),
  CONSTRAINT fk_reports_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS shares (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  owner_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  pin_hash VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  revoked_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_shares_token_hash (token_hash),
  KEY idx_shares_owner_id (owner_id),
  KEY idx_shares_expires_at (expires_at),
  CONSTRAINT fk_shares_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS share_reports (
  share_id BIGINT UNSIGNED NOT NULL,
  report_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (share_id, report_id),
  KEY idx_share_reports_report_id (report_id),
  CONSTRAINT fk_share_reports_share FOREIGN KEY (share_id) REFERENCES shares(id) ON DELETE CASCADE,
  CONSTRAINT fk_share_reports_report FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
) ENGINE=InnoDB;
