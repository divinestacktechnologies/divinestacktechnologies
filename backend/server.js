// backend/server.js — Divine Stack Technologies API v2 (PostgreSQL)
// Auth: bcrypt passwords + JWT tokens
require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db        = require('./db');

const app  = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET  = process.env.JWT_SECRET  || 'dst_jwt_secret_change_in_production';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '8h';

// ── Middleware ─────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS — allow React dev + file:// for standalone admin HTML
app.use((req, res, next) => {
  const allowed = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ];
  const origin = req.headers.origin;
  if (!origin || origin === 'null' || allowed.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// ── Rate Limiters ──────────────────────────────────────────────
const publicLimiter = rateLimit({ windowMs: 15*60*1000, max: 20,
  message: { success:false, message:'Too many requests. Try again in 15 minutes.' } });
const authLimiter   = rateLimit({ windowMs: 15*60*1000, max: 10,
  message: { success:false, message:'Too many login attempts. Try again in 15 minutes.' } });
const adminLimiter  = rateLimit({ windowMs: 15*60*1000, max: 200,
  message: { success:false, message:'Too many requests.' } });

// ── Validation helper ──────────────────────────────────────────
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success:false, errors: errors.array() });
  next();
}

// ── JWT Auth Middleware ────────────────────────────────────────
async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success:false, message:'No token provided' });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // Check blacklist
    try {
      const bl = await db.query(
        'SELECT id FROM token_blacklist WHERE token_jti = $1', [payload.jti]
      );
      if (bl.rows.length) return res.status(401).json({ success:false, message:'Token revoked. Please login again.' });
    } catch(_) {}

    const rows = await db.query(
      'SELECT id, username, email, full_name, phone, role, avatar, is_active FROM admin_users WHERE id = $1',
      [payload.id]
    );
    if (!rows.rows.length || !rows.rows[0].is_active) {
      return res.status(401).json({ success:false, message:'Account not found or disabled' });
    }
    req.admin = rows.rows[0];
    next();
  } catch(err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success:false, message:'Session expired. Please login again.' });
    }
    return res.status(401).json({ success:false, message:'Invalid token' });
  }
}

function requireSuperAdmin(req, res, next) {
  if (req.admin.role !== 'super_admin') {
    return res.status(403).json({ success:false, message:'Super admin access required' });
  }
  next();
}

// ══════════════════════════════════════════════════════════════
//  PUBLIC ROUTES
// ══════════════════════════════════════════════════════════════

app.get('/api/health', (req, res) => {
  res.json({ success:true, message:'Divine Stack API running 🚀', timestamp: new Date() });
});

// ── Public Enquiry Submit ──────────────────────────────────────
app.post('/api/enquiries', publicLimiter,
  body('full_name').trim().notEmpty().withMessage('Name required').isLength({ max:120 }),
  body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('phone').optional().trim().isLength({ max:20 }),
  body('service').optional().trim().isLength({ max:80 }),
  body('budget').optional().trim().isLength({ max:60 }),
  body('message').optional().trim().isLength({ max:2000 }),
  body('source').optional().isIn(['popup','contact']),
  validate,
  async (req, res) => {
    const { full_name, email, phone=null, service=null, budget=null, message=null, source='contact' } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    const ua = req.headers['user-agent'] || null;
    try {
      const result = await db.query(
        `INSERT INTO enquiries (source,full_name,email,phone,service,budget,message,ip_address,user_agent)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
        [source, full_name, email, phone, service, budget, message, ip, ua]
      );
      return res.status(201).json({ success:true, message:'Enquiry submitted! We will contact you within 24 hours.', id: result.rows[0].id });
    } catch(err) {
      console.error('POST /enquiries:', err);
      return res.status(500).json({ success:false, message:'Server error. Please try again.' });
    }
  }
);

// ══════════════════════════════════════════════════════════════
//  AUTH ROUTES
// ══════════════════════════════════════════════════════════════

// ── Login ──────────────────────────────────────────────────────
app.post('/api/auth/login', authLimiter,
  body('username').trim().notEmpty().withMessage('Username required'),
  body('password').notEmpty().withMessage('Password required'),
  validate,
  async (req, res) => {
    const { username, password } = req.body;
    try {
      // Find by username OR email
      const rows = await db.query(
        'SELECT * FROM admin_users WHERE (username = $1 OR email = $1) AND is_active = TRUE',
        [username]
      );
      if (!rows.rows.length) {
        return res.status(401).json({ success:false, message:'Invalid username or password' });
      }
      const admin = rows.rows[0];

      // Compare bcrypt
      const valid = await bcrypt.compare(password, admin.password_hash);
      if (!valid) {
        return res.status(401).json({ success:false, message:'Invalid username or password' });
      }

      // Generate JWT with unique jti
      const jti = require('crypto').randomBytes(16).toString('hex');
      const token = jwt.sign(
        { id: admin.id, username: admin.username, role: admin.role, jti },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES }
      );

      // Update last_login
      await db.query('UPDATE admin_users SET last_login = NOW() WHERE id = $1', [admin.id]);

      return res.json({
        success: true,
        token,
        admin: {
          id:        admin.id,
          username:  admin.username,
          email:     admin.email,
          full_name: admin.full_name,
          phone:     admin.phone,
          role:      admin.role,
          avatar:    admin.avatar,
          last_login: admin.last_login,
        },
      });
    } catch(err) {
      console.error('POST /auth/login:', err);
      return res.status(500).json({ success:false, message:'Server error' });
    }
  }
);

// ── Logout (blacklist token) ───────────────────────────────────
app.post('/api/auth/logout', requireAuth, async (req, res) => {
  try {
    const header  = req.headers.authorization;
    const token   = header.slice(7);
    const payload = jwt.decode(token);
    if (payload?.jti) {
      await db.query(
        'INSERT INTO token_blacklist (token_jti, expires_at) VALUES ($1, $2) ON CONFLICT (token_jti) DO NOTHING',
        [payload.jti, new Date(payload.exp * 1000)]
      );
    }
    return res.json({ success:true, message:'Logged out successfully' });
  } catch(err) {
    return res.json({ success:true, message:'Logged out' });
  }
});

// ── Get My Profile ─────────────────────────────────────────────
app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ success:true, data: req.admin });
});

// ── Update My Profile ──────────────────────────────────────────
app.put('/api/auth/profile', requireAuth,
  body('full_name').optional().trim().isLength({ min:1, max:120 }),
  body('email').optional().trim().isEmail().normalizeEmail(),
  body('phone').optional().trim().isLength({ max:20 }),
  validate,
  async (req, res) => {
    const { full_name, email, phone } = req.body;
    const updates = [];
    const params  = [];
    let idx = 1;
    if (full_name !== undefined) { updates.push(`full_name = $${idx++}`); params.push(full_name); }
    if (email     !== undefined) { updates.push(`email = $${idx++}`);     params.push(email); }
    if (phone     !== undefined) { updates.push(`phone = $${idx++}`);     params.push(phone || null); }

    if (!updates.length) return res.status(400).json({ success:false, message:'Nothing to update' });

    params.push(req.admin.id);
    try {
      await db.query(`UPDATE admin_users SET ${updates.join(', ')} WHERE id = $${idx}`, params);
      const rows = await db.query(
        'SELECT id,username,email,full_name,phone,role,avatar,last_login FROM admin_users WHERE id = $1',
        [req.admin.id]
      );
      return res.json({ success:true, message:'Profile updated', data: rows.rows[0] });
    } catch(err) {
      if (err.code === '23505') return res.status(409).json({ success:false, message:'Email already in use' });
      return res.status(500).json({ success:false, message:'Server error' });
    }
  }
);

// ── Change Password ────────────────────────────────────────────
app.put('/api/auth/change-password', requireAuth,
  body('current_password').notEmpty().withMessage('Current password required'),
  body('new_password').isLength({ min:8 }).withMessage('New password min 8 characters'),
  body('confirm_password').notEmpty(),
  validate,
  async (req, res) => {
    const { current_password, new_password, confirm_password } = req.body;

    if (new_password !== confirm_password) {
      return res.status(400).json({ success:false, message:'New passwords do not match' });
    }

    try {
      const rows  = await db.query('SELECT password_hash FROM admin_users WHERE id = $1', [req.admin.id]);
      const valid = await bcrypt.compare(current_password, rows.rows[0].password_hash);
      if (!valid) return res.status(400).json({ success:false, message:'Current password is incorrect' });

      const hash = await bcrypt.hash(new_password, 12);
      await db.query('UPDATE admin_users SET password_hash = $1 WHERE id = $2', [hash, req.admin.id]);

      return res.json({ success:true, message:'Password changed successfully' });
    } catch(err) {
      return res.status(500).json({ success:false, message:'Server error' });
    }
  }
);

// ══════════════════════════════════════════════════════════════
//  ADMIN — ENQUIRY ROUTES (JWT protected)
// ══════════════════════════════════════════════════════════════

// GET all enquiries — paginated, searchable, filterable
app.get('/api/admin/enquiries', adminLimiter, requireAuth, async (req, res) => {
  const { page=1, limit=20, status, source, search, sort='created_at', order='DESC' } = req.query;
  const offset = (parseInt(page)-1) * parseInt(limit);
  const safeSort  = ['id','full_name','email','created_at','status'].includes(sort) ? sort : 'created_at';
  const safeOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  let where = []; let params = []; let idx = 1;
  if (status) { where.push(`status = $${idx++}`); params.push(status); }
  if (source) { where.push(`source = $${idx++}`); params.push(source); }
  if (search) {
    where.push(`(full_name ILIKE $${idx} OR email ILIKE $${idx} OR phone ILIKE $${idx} OR service ILIKE $${idx})`);
    params.push(`%${search}%`);
    idx++;
  }
  const wc = where.length ? 'WHERE ' + where.join(' AND ') : '';

  try {
    const totalResult = await db.query(`SELECT COUNT(*) AS total FROM enquiries ${wc}`, params);
    const total = parseInt(totalResult.rows[0].total, 10);
    const rows = await db.query(
      `SELECT id,source,full_name,email,phone,service,budget,message,status,ip_address,created_at,updated_at
       FROM enquiries ${wc} ORDER BY ${safeSort} ${safeOrder}
       LIMIT ${parseInt(limit)} OFFSET ${offset}`,
      params
    );
    return res.json({ success:true, data:rows.rows, pagination:{ total, page:parseInt(page), limit:parseInt(limit), totalPages: Math.ceil(total/parseInt(limit)) } });
  } catch(err) {
    console.error(err);
    return res.status(500).json({ success:false, message:'Server error' });
  }
});

// GET single enquiry
app.get('/api/admin/enquiries/:id', adminLimiter, requireAuth, async (req, res) => {
  try {
    const rows = await db.query('SELECT * FROM enquiries WHERE id = $1', [req.params.id]);
    if (!rows.rows.length) return res.status(404).json({ success:false, message:'Not found' });
    return res.json({ success:true, data: rows.rows[0] });
  } catch(err) {
    return res.status(500).json({ success:false, message:'Server error' });
  }
});

// PATCH status
app.patch('/api/admin/enquiries/:id/status', adminLimiter, requireAuth,
  body('status').isIn(['new','in_progress','closed']),
  validate,
  async (req, res) => {
    try {
      await db.query('UPDATE enquiries SET status = $1 WHERE id = $2', [req.body.status, req.params.id]);
      return res.json({ success:true, message:'Status updated' });
    } catch(err) {
      return res.status(500).json({ success:false, message:'Server error' });
    }
  }
);

// DELETE
app.delete('/api/admin/enquiries/:id', adminLimiter, requireAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM enquiries WHERE id = $1', [req.params.id]);
    return res.json({ success:true, message:'Deleted' });
  } catch(err) {
    return res.status(500).json({ success:false, message:'Server error' });
  }
});

// ── Dashboard Stats ────────────────────────────────────────────
app.get('/api/admin/stats', adminLimiter, requireAuth, async (req, res) => {
  try {
    const totalsResult = await db.query(`
      SELECT
        COUNT(*)                                                                   AS total,
        COUNT(*) FILTER (WHERE status = 'new')                                     AS new_count,
        COUNT(*) FILTER (WHERE status = 'in_progress')                             AS in_progress,
        COUNT(*) FILTER (WHERE status = 'closed')                                  AS closed,
        COUNT(*) FILTER (WHERE source = 'popup')                                   AS from_popup,
        COUNT(*) FILTER (WHERE source = 'contact')                                 AS from_contact,
        COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE)                    AS today,
        COUNT(*) FILTER (WHERE DATE_TRUNC('week', created_at) = DATE_TRUNC('week', NOW())) AS this_week
      FROM enquiries`);
    const totals = totalsResult.rows[0];

    const byServiceResult = await db.query(`
      SELECT service, COUNT(*) AS count FROM enquiries
      WHERE service IS NOT NULL GROUP BY service ORDER BY count DESC LIMIT 10`);

    const dailyResult = await db.query(`
      SELECT DATE(created_at) AS date, COUNT(*) AS count FROM enquiries
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at) ORDER BY date ASC`);

    return res.json({ success:true, data:{ totals, byService: byServiceResult.rows, daily: dailyResult.rows } });
  } catch(err) {
    console.error(err);
    return res.status(500).json({ success:false, message:'Server error' });
  }
});

// ── Admin User Management (super_admin only) ───────────────────
app.get('/api/admin/users', adminLimiter, requireAuth, requireSuperAdmin, async (req, res) => {
  try {
    const rows = await db.query(
      'SELECT id,username,email,full_name,phone,role,is_active,last_login,created_at FROM admin_users ORDER BY created_at DESC'
    );
    return res.json({ success:true, data: rows.rows });
  } catch(err) {
    return res.status(500).json({ success:false, message:'Server error' });
  }
});

app.patch('/api/admin/users/:id/status', adminLimiter, requireAuth, requireSuperAdmin,
  body('is_active').isBoolean(),
  validate,
  async (req, res) => {
    if (parseInt(req.params.id) === req.admin.id) {
      return res.status(400).json({ success:false, message:'Cannot disable your own account' });
    }
    try {
      await db.query('UPDATE admin_users SET is_active = $1 WHERE id = $2', [!!req.body.is_active, req.params.id]);
      return res.json({ success:true, message:'User status updated' });
    } catch(err) {
      return res.status(500).json({ success:false, message:'Server error' });
    }
  }
);

// ── Create New Admin User (super_admin only) ───────────────────
app.post('/api/admin/users', adminLimiter, requireAuth, requireSuperAdmin,
  body('full_name').trim().notEmpty().withMessage('Full name required').isLength({ max:120 }),
  body('username').trim().notEmpty().withMessage('Username required')
    .matches(/^[a-zA-Z0-9_.]+$/).withMessage('Username can only contain letters, numbers, dots, underscores')
    .isLength({ min:3, max:60 }),
  body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('phone').optional({ checkFalsy:true }).trim().isLength({ max:20 }),
  body('password').isLength({ min:8 }).withMessage('Password must be at least 8 characters'),
  body('role').isIn(['super_admin','admin']).withMessage('Invalid role'),
  validate,
  async (req, res) => {
    const { full_name, username, email, phone, password, role } = req.body;
    try {
      // Check duplicate username/email
      const existing = await db.query(
        'SELECT id FROM admin_users WHERE username = $1 OR email = $2',
        [username.toLowerCase(), email]
      );
      if (existing.rows.length) {
        return res.status(409).json({ success:false, message:'Username or email already exists' });
      }

      const password_hash = await bcrypt.hash(password, 12);
      const result = await db.query(
        `INSERT INTO admin_users (username, email, full_name, phone, password_hash, role)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [username.toLowerCase(), email, full_name, phone || null, password_hash, role]
      );

      const rows = await db.query(
        'SELECT id,username,email,full_name,phone,role,is_active,last_login,created_at FROM admin_users WHERE id = $1',
        [result.rows[0].id]
      );

      return res.status(201).json({ success:true, message:'Admin user created successfully', data: rows.rows[0] });
    } catch(err) {
      if (err.code === '23505') { // unique_violation
        return res.status(409).json({ success:false, message:'Username or email already exists' });
      }
      console.error('POST /admin/users:', err);
      return res.status(500).json({ success:false, message:'Server error' });
    }
  }
);

// ── Delete Admin User (super_admin only) ────────────────────────
app.delete('/api/admin/users/:id', adminLimiter, requireAuth, requireSuperAdmin, async (req, res) => {
  if (parseInt(req.params.id) === req.admin.id) {
    return res.status(400).json({ success:false, message:'Cannot delete your own account' });
  }
  try {
    await db.query('DELETE FROM admin_users WHERE id = $1', [req.params.id]);
    return res.json({ success:true, message:'Admin user deleted' });
  } catch(err) {
    return res.status(500).json({ success:false, message:'Server error' });
  }
});

// ── 404 & Error handlers ───────────────────────────────────────
app.use((req, res) => res.status(404).json({ success:false, message:'Route not found' }));
app.use((err, req, res, next) => {
  console.error('Unhandled:', err);
  res.status(500).json({ success:false, message:'Internal server error' });
});

// ── Auto-migrate then start server ──────────────────────────────
// Applies schema.sql on every boot (safe/idempotent). This means the
// database schema is set up automatically even on hosts with no Shell
// access (e.g. Render's free tier) — no manual `psql -f schema.sql` needed.
const migrate        = require('./migrate');
const bootstrapAdmin  = require('./bootstrap-admin');
migrate()
  .catch(err => console.error('⚠️  Schema migration skipped/failed:', err.message))
  .then(() => bootstrapAdmin())
  .catch(err => console.error('⚠️  Admin bootstrap skipped/failed:', err.message))
  .finally(() => {
    app.listen(PORT, () => console.log(`🚀 Divine Stack API on http://localhost:${PORT}`));
  });
