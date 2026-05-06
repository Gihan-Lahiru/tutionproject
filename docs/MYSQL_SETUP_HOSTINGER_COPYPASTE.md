# 🚀 MySQL Setup for Hostinger - Copy-Paste Scripts

## Step 1: Create Database & User in MySQL

**Open phpMyAdmin in your Hostinger cPanel** → Click on "SQL" tab at the top → **Copy-paste this entire script:**

```sql
-- Create Database
CREATE DATABASE IF NOT EXISTS tuition_malee;

-- Create User
CREATE USER 'u579059016_maleesha'@'localhost' IDENTIFIED BY 'Mal2001@';

-- Grant All Privileges
GRANT ALL PRIVILEGES ON tuition_malee.* TO 'u579059016_maleesha'@'localhost';

-- Apply Changes
FLUSH PRIVILEGES;

-- Verify (should show 1 row)
SELECT user, host FROM mysql.user WHERE user = 'u579059016_maleesha';
```

**Click "Go"** and you should see success messages ✅

---

## Step 2: Update .env File

Replace the database section in your `.env` file with this:

```env
# Database (MySQL for Production/Hostinger)
DB_HOST=localhost
DB_USER=u579059016_maleesha
DB_PASSWORD=Mal2001@
DB_NAME=tuition_malee
DB_PORT=3306
```

**Complete .env file:**

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

# JWT
JWT_SECRET=tuition_sir_super_secret_jwt_key_2025
JWT_EXPIRES_IN=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=gihanbimsara2001@gmail.com
EMAIL_PASSWORD=jbmxlkdqizlypuok
EMAIL_PROVIDER=phpmailer
EMAIL_TRANSPORT=smtp
EMAIL_SECURE=false

# Frontend URL (Update when deployed)
FRONTEND_URL=https://yourdomain.com

# Cloudinary (File Storage)
CLOUDINARY_CLOUD_NAME=dex1upt93
CLOUDINARY_API_KEY=225157622389831
CLOUDINARY_API_SECRET=UJGjfENbApdfslD3_fCt5tVDef0
```

---

## Step 3: Switch Backend to MySQL

In your project, run this command:

```bash
cd backend/config
# On Windows:
Copy-Item database-mysql.js database.js -Force

# On Mac/Linux:
cp database-mysql.js database.js
```

---

## Step 4: Test Connection (Optional)

Run this to verify MySQL connection:

```bash
cd backend
npm run dev
```

Look for: `✅ Database connected (MySQL)`

---

## ✅ You're Done!

Your application now uses MySQL. Database schema will be created automatically on first run.

**Next:** Deploy to Hostinger using File Manager or your preferred method.

---

## 🔄 Switching Back to SQLite (for local development)

If you want to test locally with SQLite again:

```bash
cd backend/config
# On Windows:
Copy-Item database-sqlite.js database.js -Force

# On Mac/Linux:
cp database-sqlite.js database.js
```

Then use `.env` without MySQL variables.
