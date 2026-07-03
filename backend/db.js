require('dotenv').config();
const mysql = require('mysql2/promise');

const sslConfig = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false;

const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  port:               parseInt(process.env.DB_PORT) || 3306,
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || '',
  database:           process.env.DB_NAME     || 'divine_stack_db',
  ssl:                sslConfig,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  connectTimeout:     30000,
  timezone:           '+05:30',
});

async function connectWithRetry(retries = 3) {
  for (let i = 1; i <= retries; i++) {
    try {
      const conn = await pool.getConnection();
      console.log('✅ MySQL connected successfully');
      conn.release();
      return;
    } catch (err) {
      console.error(`❌ MySQL connection attempt ${i}/${retries} failed:`, err.message);
      if (i < retries) {
        await new Promise(r => setTimeout(r, 3000));
      }
    }
  }
}

connectWithRetry();
module.exports = pool;
