# 🎓 Tuition Sir - Complete Learning Management System

A full-stack tuition management platform built with React, Node.js, Express, and PostgreSQL. Features include class management, assignments, file uploads, video lessons, and integrated payments.

## 📁 Project Structure

```
Tution Project/
├── frontend/          # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── api/              # API integration
│   │   ├── components/       # Reusable components
│   │   │   ├── Auth/
│   │   │   ├── Layout/
│   │   │   └── UI/
│   │   ├── contexts/         # React Context (Auth)
│   │   ├── pages/            # Page components
│   │   │   ├── auth/         # Login, Register
│   │   │   ├── teacher/      # Teacher dashboard
│   │   │   ├── student/      # Student dashboard
│   │   │   └── class/        # Class pages
│   │   ├── services/         # Business logic
│   │   └── App.jsx
│   └── package.json
│
└── backend/           # Node.js + Express (MVC)
    ├── config/               # Database config
    ├── controllers/          # Business logic
    ├── models/               # Data layer
    ├── routes/               # API routes
    ├── middleware/           # Auth, Upload, etc.
    ├── scripts/              # Migration & Seed
    └── server.js
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Setup Database

```bash
# Create PostgreSQL database
createdb tuition_sir_db

# Run migrations
cd backend
npm run migrate

# Seed sample data (optional)
npm run seed
```

### 3. Configure Environment

**Backend** (`backend/.env`):
```env
PORT=5000
DB_HOST=localhost
DB_NAME=tuition_sir_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 👥 Default Users (After Seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@tuitionsir.com | admin123 |
| Teacher | teacher@tuitionsir.com | teacher123 |
| Student | alice@student.com | student123 |

## ✨ Features

### For Teachers
- ✅ Create and manage classes
- ✅ Post announcements
- ✅ Create assignments with file attachments
- ✅ Grade student submissions
- ✅ Upload notes and past papers
- ✅ Add video lessons (YouTube/Vimeo)
- ✅ View enrolled students
- ✅ Track payments
- ✅ Dashboard with analytics

### For Students
- ✅ Enroll in classes
- ✅ View announcements
- ✅ Submit assignments
- ✅ Download notes and papers
- ✅ Watch video lessons
- ✅ Make online payments
- ✅ View payment history
- ✅ Dashboard with deadlines

### For Admins
- ✅ Manage all users
- ✅ Manage all classes
- ✅ View payment reports
- ✅ Full system access

## 🏗️ Architecture

### Frontend (React)
- **State Management**: React Context API
- **Routing**: React Router v6
- **Styling**: TailwindCSS
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Icons**: React Icons

### Backend (Node.js)
- **Framework**: Express.js
- **Architecture**: MVC Pattern
- **Database**: PostgreSQL
- **Authentication**: JWT
- **File Upload**: Multer
- **Security**: Helmet, CORS, Rate Limiting
- **Password Hashing**: Bcrypt

### Database Schema
- Users (students, teachers, admins)
- Classes
- Enrollments
- Announcements
- Assignments & Submissions
- Notes
- Videos
- Payments

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

### Classes
```
GET    /api/classes
GET    /api/classes/:id
POST   /api/classes
PUT    /api/classes/:id
DELETE /api/classes/:id
POST   /api/classes/:id/enroll
GET    /api/classes/:id/students
GET    /api/classes/:id/announcements
POST   /api/classes/:id/announcements
```

### Assignments
```
GET    /api/assignments/class/:classId
GET    /api/assignments/:id
POST   /api/assignments/class/:classId
PUT    /api/assignments/:id
DELETE /api/assignments/:id
POST   /api/assignments/:id/submit
POST   /api/assignments/:id/grade
GET    /api/assignments/:id/submissions
```

### Notes, Videos, Payments
```
GET    /api/notes/class/:classId
POST   /api/notes/class/:classId
GET    /api/videos/class/:classId
POST   /api/videos/class/:classId
POST   /api/payments/init
GET    /api/payments/user/:userId
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Rate limiting on auth endpoints
- CORS protection
- Helmet.js security headers
- Input validation
- SQL injection prevention

## 🎨 UI/UX Features

- Responsive design (mobile-first)
- Clean, modern interface
- Intuitive navigation
- Loading states
- Error handling
- Success/error notifications
- Smooth transitions
- Accessible components

## 📦 Build for Production

### Frontend
```bash
cd frontend
npm run build
```
Output in `frontend/dist/`

### Backend
```bash
cd backend
npm start
```

## 🚀 Deployment

### Frontend Options
- Vercel (recommended)
- Netlify
- AWS S3 + CloudFront

### Backend Options
- Render
- Railway
- Heroku
- AWS EC2/ECS

### Database
- AWS RDS (PostgreSQL)
- Supabase
- ElephantSQL

## 📄 Environment Variables

### Backend Required
```env
PORT
DB_HOST
DB_NAME
DB_USER
DB_PASSWORD
JWT_SECRET
```

### Frontend Required
```env
VITE_API_URL
```

## 🧪 Testing

```bash
# Backend tests (when implemented)
cd backend
npm test

# Frontend tests (when implemented)
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Support

For support, email support@tuitionsir.com or open an issue.

---

**Built with ❤️ for modern education**
