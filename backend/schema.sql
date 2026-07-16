-- ============================================================
--  Divine Stack Technologies — PostgreSQL Schema v2
--
--  First create the database (one-time, outside this script):
--    createdb divine_stack_db
--    -- or in psql:  CREATE DATABASE divine_stack_db;
--
--  Then run this file against it:
--    psql -U postgres -d divine_stack_db -f schema.sql
-- ============================================================

-- ─── Enum Types ──────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE enquiry_source AS ENUM ('popup', 'contact', 'chatbot');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE enquiry_status AS ENUM ('new', 'in_progress', 'closed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE admin_role AS ENUM ('super_admin', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── Trigger function: auto-update updated_at on row UPDATE ──
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─── Enquiries ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS enquiries (
  id            SERIAL PRIMARY KEY,
  source        enquiry_source NOT NULL DEFAULT 'contact',
  full_name     VARCHAR(120) NOT NULL,
  email         VARCHAR(180) NOT NULL,
  phone         VARCHAR(20),
  service       VARCHAR(80),
  budget        VARCHAR(60),
  message       TEXT,
  status        enquiry_status NOT NULL DEFAULT 'new',
  ip_address    VARCHAR(45),
  user_agent    VARCHAR(255),
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enquiries_email   ON enquiries (email);
CREATE INDEX IF NOT EXISTS idx_enquiries_status  ON enquiries (status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries (created_at);

DROP TRIGGER IF EXISTS trg_enquiries_updated_at ON enquiries;
CREATE TRIGGER trg_enquiries_updated_at
  BEFORE UPDATE ON enquiries
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── Admin Users (bcrypt passwords) ─────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(60)  NOT NULL UNIQUE,
  email         VARCHAR(180) NOT NULL UNIQUE,
  full_name     VARCHAR(120) NOT NULL DEFAULT '',
  phone         VARCHAR(20)  DEFAULT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          admin_role NOT NULL DEFAULT 'admin',
  avatar        VARCHAR(255) DEFAULT NULL,
  last_login    TIMESTAMP DEFAULT NULL,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_admin_users_updated_at ON admin_users;
CREATE TRIGGER trg_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── Admin Sessions / Token Blacklist ────────────────────────
CREATE TABLE IF NOT EXISTS token_blacklist (
  id         SERIAL PRIMARY KEY,
  token_jti  VARCHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blacklist_jti     ON token_blacklist (token_jti);
CREATE INDEX IF NOT EXISTS idx_blacklist_expires ON token_blacklist (expires_at);

-- NOTE: Run `node setup-admin.js` after this to create the first admin user
