// backend/setup-admin.js
// Run: node setup-admin.js
// Creates the first super_admin user interactively

require('dotenv').config();
const bcrypt   = require('bcryptjs');
const mysql    = require('mysql2/promise');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(resolve => rl.question(q, resolve));

async function main() {
  console.log('\n🚀 Divine Stack Technologies — Admin Setup\n');
  console.log('━'.repeat(45));

  let db;
  try {
    db = await mysql.createConnection({
      host:     process.env.DB_HOST     || 'localhost',
      port:     process.env.DB_PORT     || 3306,
      user:     process.env.DB_USER     || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME     || 'divine_stack_db',
    });
    console.log('✅ MySQL connected\n');
  } catch (err) {
    console.error('❌ MySQL connect failed:', err.message);
    console.error('   → Make sure MySQL is running and .env is configured');
    process.exit(1);
  }

  // Check existing admins
  const [existing] = await db.execute('SELECT COUNT(*) AS c FROM admin_users');
  if (existing[0].c > 0) {
    const cont = await ask(`⚠️  ${existing[0].c} admin(s) already exist. Add another? (y/n): `);
    if (cont.trim().toLowerCase() !== 'y') {
      console.log('\nCancelled. Existing admins untouched.\n');
      rl.close(); db.end(); return;
    }
  }

  console.log('\nEnter details for the new admin:\n');

  const full_name = (await ask('Full Name     : ')).trim();
  const username  = (await ask('Username      : ')).trim().toLowerCase();
  const email     = (await ask('Email         : ')).trim().toLowerCase();
  const phone     = (await ask('Phone (opt.)  : ')).trim() || null;

  // Role
  const roleInput = (await ask('Role (1=super_admin, 2=admin) [1]: ')).trim();
  const role = roleInput === '2' ? 'admin' : 'super_admin';

  // Password
  let password = '';
  while (true) {
    password = (await ask('Password      : ')).trim();
    if (password.length < 8) { console.log('  ⚠️  Min 8 characters'); continue; }
    const confirm = (await ask('Confirm Pass  : ')).trim();
    if (password !== confirm) { console.log('  ⚠️  Passwords do not match'); continue; }
    break;
  }

  // Validate
  if (!full_name || !username || !email) {
    console.error('\n❌ Name, username and email are required.\n');
    rl.close(); db.end(); return;
  }

  // Hash password with bcrypt (salt rounds: 12)
  console.log('\n⏳ Hashing password with bcrypt (salt=12)...');
  const password_hash = await bcrypt.hash(password, 12);

  try {
    const [result] = await db.execute(
      `INSERT INTO admin_users (username, email, full_name, phone, password_hash, role)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [username, email, full_name, phone, password_hash, role]
    );

    console.log('\n' + '━'.repeat(45));
    console.log('✅ Admin created successfully!\n');
    console.log(`   ID       : ${result.insertId}`);
    console.log(`   Name     : ${full_name}`);
    console.log(`   Username : ${username}`);
    console.log(`   Email    : ${email}`);
    console.log(`   Role     : ${role}`);
    console.log(`   Password : bcrypt hashed (salt=12)`);
    console.log('\n' + '━'.repeat(45));
    console.log('👉 Now login at: http://localhost:3000/admin\n');
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      console.error('\n❌ Username or email already exists.\n');
    } else {
      console.error('\n❌ Error:', err.message, '\n');
    }
  }

  rl.close();
  await db.end();
}

main();
