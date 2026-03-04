# 🏛️ Greenfield Academy — School Management System

A full-stack school management website built with React, Node.js, Express, MySQL, and Sequelize.

## ✨ Features

### 🌐 Public Website
- Beautiful animated landing page with notice ticker
- About, Programs, Facilities sections
- Contact form
- Mobile responsive design

### 📋 Admission Portal
- Multi-step admission application form
- Real-time form validation
- Application reference number
- Admin can approve/reject applications

### 👨‍🎓 Student Portal
- View attendance with charts
- Attendance rate tracking (75% warning)
- Exam results with grades and progress bars
- View school notices

### 👨‍🏫 Teacher Portal
- Visual attendance marking (click-to-toggle cards)
- Upload exam results for students
- Post notices and announcements
- Today's attendance summary

### ⚙️ Admin Panel
- Full dashboard with live stats and charts
- Create/manage all users (students, teachers, admins)
- Review & approve/reject admission applications
- Post and manage notices
- Activate/deactivate user accounts

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Step 1: Clone and Setup
```bash
git clone https://github.com/YOUR_USERNAME/greenfield-academy.git
cd greenfield-academy
```

### Step 2: Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
npm install
npm run dev
```

### Step 3: Frontend Setup (new terminal)
```bash
cd frontend
npm install
npm start
```

### Step 4: Access the App
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 🔑 Default Login Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.com | admin123 |
| Teacher | teacher@school.com | teacher123 |
| Student | student@school.com | student123 |

> Create teacher and student accounts from the Admin Panel first, then they can login.

## 🗄️ Database Setup
The app auto-creates all tables on first run using Sequelize sync.

Create the MySQL database first:
```sql
CREATE DATABASE school_db;
```

Then configure `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=school_db
JWT_SECRET=your_secret_key
```

## 📁 Project Structure
```
greenfield-academy/
├── backend/
│   ├── config/
│   │   ├── database.js      # Sequelize config
│   │   └── models.js        # All database models
│   ├── middleware/
│   │   └── auth.js          # JWT auth middleware
│   ├── routes/
│   │   ├── auth.js          # Login, profile
│   │   ├── admissions.js    # Admission applications
│   │   ├── attendance.js    # Attendance tracking
│   │   ├── academic.js      # Results & notices
│   │   └── admin.js         # Admin management
│   ├── server.js            # Express app
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── AdmissionPage.js
│   │   │   ├── StudentDashboard.js
│   │   │   ├── TeacherDashboard.js
│   │   │   └── AdminDashboard.js
│   │   ├── components/
│   │   │   └── Navbar.js
│   │   ├── App.js
│   │   └── index.css        # Full design system
│   └── public/
└── vercel.json
```

## 🔒 Security Features
- JWT authentication with 24h expiration
- Password hashing with bcrypt (12 rounds)
- Rate limiting (100 req/15min, 10 login/15min)
- Helmet.js HTTP security headers
- Role-based access control (RBAC)
- Input validation with express-validator
- CORS protection

## 🚀 Deploy to Vercel

### Frontend (Recommended - separate deployment)
```bash
cd frontend
npm run build
# Upload to Vercel
```

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Set root directory to `frontend`
5. Build command: `npm run build`
6. Set environment variables (REACT_APP_API_URL)
7. Deploy!

### Backend (Railway/Render - free tier)
1. Go to [railway.app](https://railway.app) or [render.com](https://render.com)
2. Create new web service from GitHub
3. Set root directory to `backend`
4. Add MySQL database plugin
5. Set all environment variables
6. Deploy!

### Free Hosting Options
| Service | Type | Free Tier |
|---------|------|-----------|
| Vercel | Frontend | ✅ Unlimited |
| Railway | Backend + DB | ✅ $5/month credit |
| Render | Backend | ✅ 750 hours/month |
| PlanetScale | MySQL | ✅ 5GB storage |
| Supabase | MySQL/PostgreSQL | ✅ 500MB |

## 📝 API Endpoints

### Auth
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get current user

### Admissions (Public)
- `POST /api/admissions/apply` — Submit application

### Admissions (Admin)
- `GET /api/admissions` — List all
- `PUT /api/admissions/:id/status` — Update status

### Attendance
- `POST /api/attendance/mark` — Mark attendance (teacher)
- `GET /api/attendance/today-summary` — Today's stats
- `GET /api/attendance/my` — My attendance (student)

### Academic
- `POST /api/results` — Add result (teacher)
- `GET /api/results/my` — My results (student)
- `GET /api/notices` — All notices (public)
- `POST /api/notices` — Post notice (admin)

### Admin
- `GET /api/admin/dashboard` — Stats
- `GET /api/admin/users` — All users
- `POST /api/admin/users` — Create user
- `PATCH /api/admin/users/:id/toggle` — Toggle active

## 🛠️ Tech Stack
- **Frontend**: React 18, React Router v6, Recharts, Framer Motion, React Hot Toast
- **Backend**: Node.js, Express.js, Sequelize ORM
- **Database**: MySQL 8
- **Auth**: JWT + bcrypt
- **Security**: Helmet, express-rate-limit, CORS, express-validator
- **Deployment**: Vercel (frontend) + Railway/Render (backend)

## 📜 License
MIT — Free to use and modify for educational purposes.
