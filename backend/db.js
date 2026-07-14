// backend/db.js — PostgreSQL connection pool
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host:               process.env.DB_HOST     || 'localhost',
  port:               process.env.DB_PORT     || 5432,
  user:               process.env.DB_USER     || 'postgres',
  password:           process.env.DB_PASSWORD || '',
  database:           process.env.DB_NAME     || 'divine_stack_db',
  max:                10,
  idleTimeoutMillis:  30000,
  // Most managed Postgres providers (Render, Railway, Aiven, etc.) require SSL.
  // Set DB_SSL=true in .env when connecting to one of those.
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Verify connection on startup
pool.connect()
  .then(client => {
    console.log('✅ PostgreSQL connected successfully');
    client.release();
  })
  .catch(err => {
    console.error('❌ PostgreSQL connection error:', err.message);
    process.exit(1);
  });

module.exports = pool;
