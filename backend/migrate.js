// backend/migrate.js
// Applies schema.sql to the database. Safe to run multiple times —
// every statement in schema.sql uses IF NOT EXISTS / OR REPLACE / exception-guards.
//
// Run manually:   node migrate.js
// Also auto-runs once on every server.js startup (see bottom of server.js),
// so it works even on hosts (like Render's free tier) with no Shell access.

const fs   = require('fs');
const path = require('path');
const pool = require('./db');

async function migrate() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');
  console.log('🔧 Applying database schema...');
  await pool.query(sql);
  console.log('✅ Schema applied (tables already existing were left untouched).');

  // For databases created before 'chatbot' was added as a valid enquiry source,
  // add the missing enum value. Must run as its own standalone statement
  // (ALTER TYPE ... ADD VALUE cannot run in the same multi-statement batch above).
  try {
    await pool.query(`ALTER TYPE enquiry_source ADD VALUE IF NOT EXISTS 'chatbot'`);
  } catch (err) {
    console.log('ℹ️  enquiry_source enum already up to date:', err.message);
  }
}

module.exports = migrate;

// Allow `node migrate.js` to run it standalone too
if (require.main === module) {
  migrate()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('❌ Migration failed:', err.message);
      process.exit(1);
    });
}
