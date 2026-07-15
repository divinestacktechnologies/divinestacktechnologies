// backend/bootstrap-admin.js
// Auto-creates the FIRST admin user from environment variables, but only if
// the admin_users table is currently empty. This means you never need shell
// access to run `setup-admin.js` interactively — useful on hosts like
// Render's free tier where Shell isn't available.
//
// Set these in your .env / host's environment variables to enable it:
//   ADMIN_USERNAME=admin
//   ADMIN_EMAIL=admin@example.com
//   ADMIN_FULL_NAME=Super Admin
//   ADMIN_PASSWORD=some_strong_password   (min 8 chars)
//
// If ADMIN_USERNAME/ADMIN_EMAIL/ADMIN_PASSWORD aren't all set, this is a no-op.
// If an admin already exists, this is also a no-op (won't touch existing data).
//
// ⚠️  Remove/unset these env vars again after the first successful deploy —
//     leaving a plaintext password in your host's env vars long-term isn't ideal.

const bcrypt = require('bcryptjs');
const pool   = require('./db');

async function bootstrapAdmin() {
  const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_FULL_NAME } = process.env;

  if (!ADMIN_USERNAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return; // not configured — skip silently
  }

  const existing = await pool.query('SELECT COUNT(*) AS c FROM admin_users');
  if (parseInt(existing.rows[0].c, 10) > 0) {
    console.log('ℹ️  Admin bootstrap skipped — admin_users already has data.');
    return;
  }

  if (ADMIN_PASSWORD.length < 8) {
    console.error('⚠️  ADMIN_PASSWORD must be at least 8 characters. Bootstrap skipped.');
    return;
  }

  const password_hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const result = await pool.query(
    `INSERT INTO admin_users (username, email, full_name, password_hash, role)
     VALUES ($1, $2, $3, $4, 'super_admin') RETURNING id`,
    [ADMIN_USERNAME.toLowerCase(), ADMIN_EMAIL.toLowerCase(), ADMIN_FULL_NAME || 'Super Admin', password_hash]
  );

  console.log(`✅ Bootstrap admin created (id=${result.rows[0].id}, username=${ADMIN_USERNAME}). You can log in now.`);
  console.log('👉 For security, remove the ADMIN_* env vars after confirming login works.');
}

module.exports = bootstrapAdmin;

if (require.main === module) {
  bootstrapAdmin()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('❌ Admin bootstrap failed:', err.message);
      process.exit(1);
    });
}
