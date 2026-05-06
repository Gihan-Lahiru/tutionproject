# 📦 Hostinger Deployment - Complete Folder Structure

## 📋 Project Folders Overview

```
tutionprogectgit/
├── backend/                    ✅ UPLOAD (Node.js server)
│   ├── config/                 ✅ Database config
│   ├── controllers/            ✅ API logic
│   ├── middleware/             ✅ Authentication, file upload
│   ├── models/                 ✅ Database models
│   ├── routes/                 ✅ API endpoints
│   ├── scripts/                ✅ Database migrations
│   ├── utils/                  ✅ Helper functions
│   ├── uploads/                ⚠️  IMPORTANT - Existing student uploads
│   ├── vendor/                 ✅ PHP dependencies
│   ├── package.json            ✅ Node.js dependencies
│   ├── server.js               ✅ Main server file
│   ├── .env                    ✅ Environment variables
│   └── tuition_sir.db          ⚠️  DATABASE BACKUP (optional)
│
├── frontend/                   ⚠️  UPLOAD ONLY dist/ folder
│   ├── dist/                   ✅ UPLOAD - Built React app
│   ├── src/                    ❌ Don't upload (only dist needed)
│   ├── public/                 ❌ Don't upload
│   ├── package.json            ✅ REFERENCE ONLY
│   └── ...
│
├── docs/                       ❌ Optional (for reference only)
│
└── package.json               ✅ Root package.json (for npm install)
```

---

## 🎯 Quick Deployment Checklist

### ✅ **Must Upload to Hostinger:**

- [ ] **backend/** (entire folder including:)
  - [ ] config/ (with database.js switched to MySQL)
  - [ ] controllers/
  - [ ] middleware/
  - [ ] models/
  - [ ] routes/
  - [ ] scripts/
  - [ ] utils/
  - [ ] uploads/ (your existing receipts/files)
  - [ ] .env (with MySQL credentials)
  - [ ] package.json
  - [ ] server.js

- [ ] **frontend/dist/** (only this folder, not entire frontend/)
  - [ ] This contains the built React app

- [ ] **package.json** (root level)

---

## 📊 Data Folders & Files

### **1. Backend - uploads/** 📁
```
backend/uploads/
├── profiles/          → Student profile pictures
├── receipts/          → Payment receipt uploads
├── assignments/       → Assignment submissions
└── ...                → Other file uploads
```
✅ **Status:** Upload all files (preserves student data)

---

### **2. Backend - Database** 💾

**File:** `tuition_sir.db` (SQLite backup)

✅ **Option 1 - Keep existing data:**
- Upload `tuition_sir.db` to create initial MySQL database
- Backend will auto-migrate on first run

❌ **Option 2 - Start fresh:**
- Don't upload, backend creates empty schema
- Users re-register

**RECOMMENDED:** Upload the backup to keep all student data!

---

### **3. Frontend - dist/** 🎨

Built React app - **ONLY upload this folder**

```
frontend/dist/
├── index.html         → Main HTML
├── assets/            → CSS/JS bundles
└── ...                → Static files
```

---

## 📝 Environment Variables to Set

**In Hostinger cPanel, set these in your `.env`:**

```env
# Server
PORT=5000
NODE_ENV=production

# Database (MySQL)
DB_HOST=localhost
DB_USER=u579059016_maleesha
DB_PASSWORD=Mal2001@
DB_NAME=tuition_malee
DB_PORT=3306

# URLs
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://yourdomain.com/api

# Cloudinary
CLOUDINARY_CLOUD_NAME=dex1upt93
CLOUDINARY_API_KEY=225157622389831
CLOUDINARY_API_SECRET=UJGjfENbApdfslD3_fCt5tVDef0

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=gihanbimsara2001@gmail.com
EMAIL_PASSWORD=jbmxlkdqizlypuok
EMAIL_PROVIDER=phpmailer
EMAIL_TRANSPORT=smtp
EMAIL_SECURE=false
```

---

## 🚀 Step-by-Step Deployment

### **Step 1: Prepare Files**
```bash
# Switch to MySQL
cd backend/config
Copy-Item database-mysql.js database.js -Force

# Build frontend
npm --prefix frontend run build
```

### **Step 2: Create MySQL Database**
In Hostinger cPanel → phpMyAdmin → SQL tab:
```sql
CREATE DATABASE IF NOT EXISTS tuition_malee;
CREATE USER 'u579059016_maleesha'@'localhost' IDENTIFIED BY 'Mal2001@';
GRANT ALL PRIVILEGES ON tuition_malee.* TO 'u579059016_maleesha'@'localhost';
FLUSH PRIVILEGES;
```

### **Step 3: Upload to Hostinger**

**Using File Manager:**
1. Create folder structure:
   ```
   public_html/
   ├── backend/        (upload entire backend/)
   ├── dist/           (upload frontend/dist/ here)
   └── ...
   ```

2. Upload these files:
   - ✅ `backend/` (entire folder)
   - ✅ `frontend/dist/` contents
   - ✅ `package.json` (root)

3. **Do NOT upload:**
   - ❌ node_modules/ (will be installed via npm install)
   - ❌ .git/ (not needed)
   - ❌ src/ files (only dist needed)

### **Step 4: Install Dependencies**

In Hostinger terminal/SSH:
```bash
cd public_html/backend
npm install

cd ../
npm install
```

### **Step 5: Start Node.js**

In Hostinger cPanel → Application Manager:
- Create Node.js app
- Point to `backend/server.js`
- Set startup command: `node server.js` or `npm start`

### **Step 6: Configure Domain**

Point your domain to:
- Frontend: `public_html/dist/`
- API: `public_html/backend/` (on separate port/subdomain)

---

## ✅ Verify Deployment

After deployment, check:

1. **Database connected:** `SELECT * FROM users;` (in phpMyAdmin)
2. **Files uploaded:** Check file manager shows all folders
3. **Node.js running:** Check Application Manager shows status: Running
4. **Frontend loads:** Visit `yourdomain.com`
5. **API responds:** Visit `yourdomain.com/api/health` or similar

---

## 🔄 Data Backup Plan

**Before deployment, backup:**
1. Download `backend/uploads/` (all student files)
2. Download `backend/tuition_sir.db` (SQLite backup)
3. Keep local copy on your computer

---

## 📞 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot find database" | Check MySQL created in cPanel |
| "File upload fails" | Check `backend/uploads/` permissions (755) |
| "Frontend blank page" | Check `frontend/dist/` uploaded correctly |
| "API errors" | Check `.env` has MySQL credentials |
| "No Node.js app running" | Check Application Manager → start app |

---

## ✨ You're Ready!

All folders and data are documented. Follow the deployment steps above to go live! 🚀
