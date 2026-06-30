# 🚀 Divine Stack Technologies — Full Stack Website

React SPA + Node.js/Express Backend + MySQL Database

---

## 📁 Project Structure

```
dst-fullstack/
├── backend/
│   ├── server.js        ← Express API server
│   ├── db.js            ← MySQL connection pool
│   ├── schema.sql       ← Run this first to create DB
│   ├── .env.example     ← Copy to .env and fill values
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html   ← SEO + Schema markup
    └── src/
        ├── App.jsx          ← Router + Popup logic
        ├── api.js           ← Axios API calls
        ├── pages/
        │   ├── Home.jsx
        │   ├── Services.jsx
        │   ├── About.jsx
        │   ├── Portfolio.jsx
        │   ├── Contact.jsx
        │   └── Admin.jsx    ← Admin dashboard
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── CircuitCanvas.jsx
        │   └── EnquiryPopup.jsx
        └── styles/          ← CSS per page
```

---

## ⚙️ Setup Instructions

### Step 1 — MySQL Database

```bash
# Login to MySQL
mysql -u root -p

# Run schema
source /path/to/dst-fullstack/backend/schema.sql
```

### Step 2 — Backend

```bash
cd backend

# Copy env file
cp .env.example .env
# Edit .env with your MySQL credentials and ADMIN_SECRET

# Install dependencies
npm install

# Start dev server
npm run dev

# OR production
npm start
```

API runs on: `http://localhost:5000`

### Step 3 — Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start dev server
npm start
```

Frontend runs on: `http://localhost:3000`

---

## 🌐 Pages

| Route        | Page       | Description                        |
|--------------|------------|------------------------------------|
| `/`          | Home       | Hero, services preview, stats, CTA |
| `/services`  | Services   | All 6 services in detail           |
| `/about`     | About      | Story, team, values                |
| `/portfolio` | Portfolio  | 8 projects with filter tabs        |
| `/contact`   | Contact    | Form (saves to MySQL) + FAQ        |
| `/admin`     | Admin      | Dashboard, enquiry management      |

---

## 📡 API Endpoints

### Public
| Method | Endpoint         | Description            |
|--------|-----------------|------------------------|
| POST   | `/api/enquiries` | Submit enquiry (popup/contact) |
| GET    | `/api/health`    | Health check           |

### Admin (requires `x-admin-key` header)
| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| GET    | `/api/admin/enquiries`            | List + filter enquiries  |
| GET    | `/api/admin/enquiries/:id`        | Single enquiry           |
| PATCH  | `/api/admin/enquiries/:id/status` | Update status            |
| DELETE | `/api/admin/enquiries/:id`        | Delete enquiry           |
| GET    | `/api/admin/stats`                | Dashboard stats          |

---

## 🔐 Admin Panel

Visit `/admin` in the browser.

- Login with username/password (bcrypt + JWT, set up via `node setup-admin.js` first)
- Features:
  - Stats dashboard (total, new, today, by service, 30-day trend)
  - Enquiry table with search + filter + pagination
  - Status management (New → In Progress → Closed)
  - Click any row to see full enquiry details
  - Delete enquiries
  - My Profile — edit name/email/phone, change password
  - **Admin Users (Super Admin only)** — create new admin logins directly from the dashboard, no need to run the setup script again. Enable/disable or delete other admin accounts.

---

## ⏰ Popup Behaviour

- Auto-opens **30 seconds** after page load
- `sessionStorage` ensures it shows only **once per browser session**
- Refresh won't trigger it again in the same tab
- Manually triggered by "Get Free Quote" button in navbar

---

## 🔍 SEO / AEO / GEO

All implemented in `frontend/public/index.html`:
- **SEO**: title, meta description, keywords, canonical, robots
- **AEO**: FAQ JSON-LD schema, speakable meta
- **GEO**: geo.region, geo.placename, geo.position, ICBM tags
- **Open Graph**: og:title, og:description, og:url
- **Twitter Card**: summary_large_image
- **Organization Schema**: full JSON-LD with offer catalog

---

## 🚀 Production Deployment

### Backend (VPS / EC2)
```bash
npm install -g pm2
pm2 start server.js --name "dst-api"
pm2 save
```

### Frontend (Netlify / Vercel)
```bash
npm run build
# Deploy the `build/` folder
# Set REACT_APP_API_URL to your production API URL
```

### Environment Variables (Production)
```
DB_HOST=your-db-host
DB_PASSWORD=strong-password
ADMIN_SECRET=very-strong-secret-key
FRONTEND_URL=https://www.divinestacktechnologies.com
NODE_ENV=production
```
