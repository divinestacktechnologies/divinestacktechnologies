-- ============================================================
--  Divine Stack Technologies — MySQL Schema v2
--  Run: mysql -u root -p < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS divine_stack_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE divine_stack_db;

-- ─── Enquiries ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS enquiries (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  source        ENUM('popup','contact') NOT NULL DEFAULT 'contact',
  full_name     VARCHAR(120) NOT NULL,
  email         VARCHAR(180) NOT NULL,
  phone         VARCHAR(20),
  service       VARCHAR(80),
  budget        VARCHAR(60),
  message       TEXT,
  status        ENUM('new','in_progress','closed') NOT NULL DEFAULT 'new',
  ip_address    VARCHAR(45),
  user_agent    VARCHAR(255),
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email   (email),
  INDEX idx_status  (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- ─── Admin Users (bcrypt passwords) ─────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(60)  NOT NULL UNIQUE,
  email         VARCHAR(180) NOT NULL UNIQUE,
  full_name     VARCHAR(120) NOT NULL DEFAULT '',
  phone         VARCHAR(20)  DEFAULT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('super_admin','admin') NOT NULL DEFAULT 'admin',
  avatar        VARCHAR(255) DEFAULT NULL,
  last_login    DATETIME DEFAULT NULL,
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ─── Admin Sessions / Token Blacklist ────────────────────────
CREATE TABLE IF NOT EXISTS token_blacklist (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  token_jti  VARCHAR(64) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_jti     (token_jti),
  INDEX idx_expires (expires_at)
) ENGINE=InnoDB;

-- NOTE: Run `node setup-admin.js` after this to create first admin user
