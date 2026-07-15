# Divine Stack Technologies — Full Stack Web App

Divine Stack Technologies ki official website + admin panel. Frontend React (CRA) mein hai aur backend Node.js/Express + PostgreSQL par bana hua hai, JWT-based authentication ke saath.

---

## 🧱 Tech Stack

**Frontend**
- React 18 (Create React App)
- React Router DOM v6
- Axios (API calls)
- React Helmet Async (SEO)

**Backend**
- Node.js + Express 4
- PostgreSQL (via `pg`)
- JWT (`jsonwebtoken`) — authentication
- Bcrypt (`bcryptjs`) — password hashing
- Helmet, CORS, express-rate-limit — security
- express-validator — request validation

---

## 📁 Project Structure

```
dst-fullstack/
├── backend/
│   ├── server.js          # Express app + all API routes
│   ├── db.js               # PostgreSQL connection pool (DATABASE_URL or DB_* vars)
│   ├── migrate.js          # Auto-applies schema.sql on every boot (idempotent)
│   ├── bootstrap-admin.js  # Auto-creates first admin from ADMIN_* env vars (no-shell hosts)
│   ├── schema.sql          # Database schema
│   ├── setup-admin.js      # Interactive CLI script to create an admin (needs Shell)
│   ├── .env.example        # Sample environment variables
│   └── package.json
│
└── frontend/
    ├── public/              # Static assets, favicon, manifest, robots.txt
    └── src/
        ├── App.jsx
        ├── api.js           # Axios instance + API helper functions
        ├── components/      # Navbar, Footer, FAQ, EnquiryPopup, SEO, CircuitCanvas
        ├── pages/           # Home, About, Services, Portfolio, Contact, Admin
        ├── hooks/           # useReveal (scroll-reveal animation hook)
        └── styles/          # Per-page CSS files
```

---

## ⚙️ Prerequisites

- Node.js v16+ aur npm
- PostgreSQL 13+ (running locally ya kahin bhi accessible / managed provider)

---

## 🚀 Setup Instructions

### 1. Repository clone/extract karo
```bash
cd dst-fullstack
```

### 2. Database setup
Pehle database banao (ek baar):
```bash
createdb divine_stack_db
# ya psql ke andar: CREATE DATABASE divine_stack_db;
```

**Schema apply karne ke 2 tareeke:**

- **Local / Shell access available**: seedha psql se run karo:
  ```bash
  psql -U postgres -d divine_stack_db -f backend/schema.sql
  ```
- **No Shell access (e.g. Render free tier)**: kuch bhi manually run karne ki zaroorat nahi — `server.js` startup pe **khud** `schema.sql` apply kar leta hai (`migrate.js` ke through). Ye safe hai kyunki har statement `IF NOT EXISTS` use karta hai, isliye dobara-dobara run hone se bhi kuch nahi tootega. Bas backend deploy karo, schema apne aap ban jayega.

Dono cases mein 3 tables banti hain: `enquiries`, `admin_users`, `token_blacklist` (saath mein enum types aur `updated_at` auto-update triggers).

### 3. Backend setup
```bash
cd backend
npm install
cp .env.example .env
```
`.env` file open karke apni PostgreSQL credentials aur JWT secret set karo.

**Local development** (individual fields):
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here
DB_NAME=divine_stack_db
DB_SSL=false

PORT=5000
NODE_ENV=development

JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES=8h

FRONTEND_URL=http://localhost:3000
```

**Deployment (Render, Railway, etc.)** — inn providers ek hi connection string dete hain, use `DATABASE_URL` mein daal do (ye individual `DB_*` fields se priority leta hai):
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
PORT=5000
NODE_ENV=production
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES=8h
FRONTEND_URL=https://your-frontend-url.com
```
`JWT_SECRET` generate karne ke liye:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Pehla admin user banao

**Shell access available** (local ya paid Render plan):
```bash
npm run setup-admin
```
(Interactively naam, username, email, password aur role poochega.)

**No Shell access (Render free tier)**: `setup-admin.js` interactive hai, isliye shell ke bina run nahi ho sakta. Iske bajaye, deploy se pehle in 4 env vars ko host ke Environment settings mein daal do:
```env
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_FULL_NAME=Super Admin
ADMIN_PASSWORD=ek_strong_password_yahan
```
Server startup pe khud check karega — agar `admin_users` table khali hai aur ye 4 vars set hain, toh ye admin **automatically** ban jayega. Login confirm hone ke baad in 4 vars ko env settings se **hata dena** (security ke liye, password plaintext env mein permanently rehna theek nahi).

### 5. Backend server start karo
```bash
npm run dev      # nodemon ke saath (development)
# ya
npm start        # production
```
Server `http://localhost:5000` par chalega. Health check: `GET /api/health`.

### 6. Frontend setup
```bash
cd ../frontend
npm install
```
`.env` file already present hai:
```env
REACT_APP_API_URL=http://localhost:5000/api
```
Frontend start karo:
```bash
npm start
```
App `http://localhost:3000` par khulega.

---

## 🔑 Admin Panel

- URL: `http://localhost:3000/admin`
- Login credentials wahi honge jo `npm run setup-admin` (shell wale flow) ya `ADMIN_*` env vars (no-shell/auto-bootstrap flow) se bane the.
- JWT token `localStorage` mein store hota hai (`dst_token`) aur har request ke saath auto-attach hota hai.
- Token expire/revoke hone par app auto-logout kar deta hai.

---

## 📡 API Overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | ❌ | Health check |
| POST | `/api/enquiries` | ❌ | Public enquiry form submit |
| POST | `/api/auth/login` | ❌ | Admin login |
| POST | `/api/auth/logout` | ✅ | Logout (token blacklist) |
| GET | `/api/auth/me` | ✅ | Current admin profile |
| PUT | `/api/auth/profile` | ✅ | Update own profile |
| PUT | `/api/auth/change-password` | ✅ | Change password |
| GET | `/api/admin/enquiries` | ✅ | List enquiries (paginated, filterable, searchable) |
| GET | `/api/admin/enquiries/:id` | ✅ | Single enquiry detail |
| PATCH | `/api/admin/enquiries/:id/status` | ✅ | Update enquiry status |
| DELETE | `/api/admin/enquiries/:id` | ✅ | Delete enquiry |
| GET | `/api/admin/stats` | ✅ | Dashboard stats |
| GET | `/api/admin/users` | ✅ (super_admin) | List admin users |
| POST | `/api/admin/users` | ✅ (super_admin) | Create admin user |
| PATCH | `/api/admin/users/:id/status` | ✅ (super_admin) | Enable/disable admin user |
| DELETE | `/api/admin/users/:id` | ✅ (super_admin) | Delete admin user |

Auth required routes mein header bhejna hota hai:
```
Authorization: Bearer <jwt_token>
```

---

## 🛡️ Security Features

- Bcrypt password hashing (salt rounds = 12)
- JWT with unique `jti` per token + blacklist support on logout
- Rate limiting: public routes (20 req/15min), auth routes (10 req/15min), admin routes (200 req/15min)
- Helmet for HTTP security headers
- Input validation via `express-validator`
- Role-based access control (`super_admin` vs `admin`)

---

## 📦 Build for Production

```bash
cd frontend
npm run build
```
Ye `frontend/build` folder generate karega jise kisi bhi static hosting (Netlify, Vercel, Nginx, etc.) par deploy kiya ja sakta hai. Backend ko Node hosting (Render, Railway, EC2, etc.) par deploy karo aur `FRONTEND_URL` env variable production domain se set karo.

---

## 📝 Notes

- Deployment se pehle `.env` mein `JWT_SECRET` zaroor change karein — production mein default/example secret use na karein.
- `.env` files git mein commit nahi honi chahiye (already `.gitignore`d honi chahiye, verify kar lein).
