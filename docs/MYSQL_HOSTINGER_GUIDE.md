# 🚀 MySQL Migration Guide for Hostinger

## Step 1: Database & User Created ✅

Your MySQL credentials are configured:
```
Host: localhost
Username: u579059016_maleesha
Database: tuition_malee
Port: 3306
```

## Step 2: Update Backend Configuration

Your `.env` file has been updated with MySQL credentials:
```
DB_HOST=localhost
DB_USER=u579059016_maleesha
DB_PASSWORD=Mal2001@
DB_NAME=tuition_malee
DB_PORT=3306
```

## Step 3: Test MySQL Connection

Run this command to test if backend connects to MySQL:

```bash
cd backend
npm install
node -e "const db = require('./config/database'); setTimeout(() => process.exit(0), 2000)"
```

You should see: `✅ Database connected (MySQL)`

## Step 4: Run the Backend

```bash
npm run dev
```

The database schema will be created automatically on first run. You should see:
```
✅ Database schema initialized successfully
✅ Database connected (MySQL)
```

## Step 5: Migrate Data from SQLite (Optional)

If you want to migrate your existing SQLite data to MySQL:

```bash
node scripts/migrate-sqlite-to-mysql.js
```

This will:
- Read data from `tuition_sir.db` (SQLite)
- Insert into `tuition_malee` (MySQL)
- Preserve all relationships and data

## ✅ You're Done!

Your application now uses MySQL instead of SQLite. 

**Next Steps:**
1. ✅ Backend running on `http://localhost:5000`
2. ✅ Frontend running on `http://localhost:3002`
3. Ready to deploy to Hostinger!

## 🔧 Troubleshooting

### "Access Denied" Error
- Verify credentials in Hostinger cPanel → MySQL Databases
- Check if user has all required privileges
- Password might need special character escaping

### "Cannot connect to host"
- Ensure MySQL is running in Hostinger
- Try connecting via Hostinger's phpMyAdmin to verify

### Tables not created
- Delete all tables in MySQL and restart backend
- Backend will recreate them automatically

