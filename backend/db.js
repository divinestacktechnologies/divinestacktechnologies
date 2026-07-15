// backend/db.js — PostgreSQL connection pool
require('dotenv').config();
const { Pool } = require('pg');

// Two ways to configure the connection:
//  1. DATABASE_URL — a single connection string (what Render/Railway/etc. give you)
//     e.g. postgresql://user:password@host:5432/dbname
//  2. Individual DB_HOST / DB_PORT / DB_USER / DB_PASSWORD / DB_NAME vars (local dev)
// DATABASE_URL takes priority if both are set.

const useConnectionString = !!process.env.DATABASE_URL;

const pool = new Pool(
  useConnectionString
    ? {
        connectionString: process.env.DATABASE_URL,
        max: 10,
        idleTimeoutMillis: 30000,
        // Managed Postgres providers (Render, Railway, Aiven, etc.) require SSL.
        // Set DB_SSL=false to disable (e.g. local Docker Postgres without SSL).
        ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
      }
    : {
        host:               process.env.DB_HOST     || 'localhost',
        port:               process.env.DB_PORT     || 5432,
        user:               process.env.DB_USER     || 'postgres',
        password:           process.env.DB_PASSWORD || '',
        database:           process.env.DB_NAME     || 'divine_stack_db',
        max:                10,
        idleTimeoutMillis:  30000,
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      }
);

// Verify connection on startup
pool.connect()
  .then(client => {
    console.log(`✅ PostgreSQL connected successfully (${useConnectionString ? 'via DATABASE_URL' : 'via DB_* vars'})`);
    client.release();
  })
  .catch(err => {
    console.error('❌ PostgreSQL connection error:', err.message);
    process.exit(1);
  });

module.exports = pool;
