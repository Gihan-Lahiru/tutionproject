# MySQL Setup Guide for Tuition Management System

## ✅ MySQL Database Conversion Complete!

All code has been successfully converted from PostgreSQL to MySQL:
- ✅ `package.json` - Updated to use mysql2
- ✅ `config/database.js` - MySQL connection pool configured
- ✅ `.env` - MySQL connection settings
- ✅ `scripts/migrate.js` - MySQL schema with proper data types
- ✅ `scripts/seed.js` - MySQL sample data
- ✅ All Model files converted to MySQL syntax

## 📋 Next Steps

### Option 1: Local Development with MySQL

If you want to test locally before deploying to InfinityFree:

1. **Download & Install MySQL:**
   - Download MySQL Installer: https://dev.mysql.com/downloads/installer/
   - Choose "MySQL Installer for Windows"
   - Run the installer and select "Developer Default"
   - During setup, set a password for root user (or leave blank)

2. **Install XAMPP (Easier Alternative):**
   - Download XAMPP: https://www.apachefriends.org/
   - Install XAMPP (includes MySQL)
   - Open XAMPP Control Panel
   - Start MySQL service
   - Click "Admin" to open phpMyAdmin

3. **Update `.env` file:**
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=tuition_sir_db
   DB_USER=root
   DB_PASSWORD=         # Your MySQL password or leave blank
   ```

4. **Create Database:**
   - Open MySQL Workbench or phpMyAdmin
   - Create a new database: `tuition_sir_db`
   - Or run: `CREATE DATABASE tuition_sir_db;`

5. **Run Migration:**
   ```bash
   cd backend
   npm run migrate    # Creates all tables
   npm run seed      # Adds sample data
   ```

### Option 2: Deploy Directly to InfinityFree

Skip local MySQL and deploy directly to production:

1. **Create MySQL Database on InfinityFree:**
   - Login to InfinityFree Control Panel
   - Go to "MySQL Databases"
   - Click "Create Database"
   - Note down:
     * Database Host (e.g., `sql123.epizy.com`)
     * Database Name (e.g., `epiz_12345678_tuition`)
     * Database Username (e.g., `epiz_12345678`)
     * Database Password

2. **Update Production `.env`:**
   ```
   DB_HOST=sql123.epizy.com          # Your InfinityFree host
   DB_PORT=3306
   DB_NAME=epiz_12345678_tuition     # Your database name
   DB_USER=epiz_12345678             # Your username
   DB_PASSWORD=your_password          # Your password
   ```

3. **Run Migration on Production:**
   - Upload backend folder to InfinityFree
   - SSH into your server or use web-based terminal
   - Run migration: `node scripts/migrate.js`
   - Run seed: `node scripts/seed.js`

## 🔑 Default Login Credentials (After Seeding)

### Admin Account
- Email: `admin@tuitionsir.com`
- Password: `admin123`

### Teacher Account
- Email: `teacher@tuitionsir.com`
- Password: `teacher123`

### Student Accounts
- Email: `student1@tuitionsir.com`
- Password: `student123`

- Email: `student2@tuitionsir.com`
- Password: `student123`

## 📊 Database Schema

The following tables will be created:

1. **users** - Store teachers, students, and admins
2. **classes** - Store class information
3. **enrollments** - Student enrollments in classes
4. **announcements** - Class announcements
5. **assignments** - Homework and assignments
6. **submissions** - Student assignment submissions
7. **notes** - PDF notes and study materials
8. **videos** - Video lessons
9. **payments** - Payment records

## 🚀 Testing the Setup

After migration, test the backend:

```bash
cd backend
npm run dev
```

The server should start on `http://localhost:5000`

## ⚠️ Important Notes

1. **InfinityFree Limitations:**
   - Free hosting may have limited database size
   - Connection pooling might be restricted
   - Regular backups recommended

2. **Production Security:**
   - Change all default passwords
   - Update JWT_SECRET in .env
   - Enable HTTPS on InfinityFree
   - Set NODE_ENV=production

3. **File Uploads:**
   - InfinityFree has limited file storage
   - Consider using AWS S3 or Cloudinary for files
   - Update AWS credentials in .env if using S3

## 📞 Support

If you encounter any issues:
1. Check MySQL service is running
2. Verify database credentials in `.env`
3. Check database exists on server
4. Review error logs for specific issues

## ✨ What's Next?

Once database is set up:
1. Test all API endpoints
2. Configure file upload service
3. Set up frontend to connect to backend
4. Deploy frontend to hosting
5. Configure CORS for production domains
