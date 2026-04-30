# 🚀 InfinityFree Deployment Guide

## ⚠️ Important Information About InfinityFree

InfinityFree **does NOT allow remote MySQL connections** for security reasons. This means:
- ❌ You cannot connect to the database from your local computer
- ✅ You can ONLY connect from files hosted on their server
- ✅ The database setup must be run on InfinityFree's server

## 📋 Deployment Steps

### Step 1: Upload Backend Files to InfinityFree

1. **Prepare Files for Upload:**
   - Compress the `backend` folder into a ZIP file
   - Or use FTP client (FileZilla recommended)

2. **Upload via File Manager:**
   - Login to InfinityFree Control Panel
   - Go to "File Manager"
   - Navigate to `htdocs` folder
   - Upload your backend files
   - Extract if you uploaded a ZIP

3. **Upload via FTP:**
   - Get FTP credentials from InfinityFree Control Panel
   - Use FileZilla or any FTP client
   - Connect to: `ftpupload.net` (or your specific FTP host)
   - Upload all backend files to `/htdocs/` directory

### Step 2: Install Node.js Dependencies on Server

⚠️ **InfinityFree Problem:** InfinityFree free hosting does NOT support Node.js!

InfinityFree free hosting only supports:
- PHP
- HTML/CSS/JavaScript (static)
- MySQL Database

**You have 3 options:**

#### Option A: Use Different Hosting for Backend (Recommended)

**Free Node.js Hosting Options:**

1. **Render.com** (Recommended - Free Tier)
   - Supports Node.js
   - Free MySQL database
   - Easy deployment
   - Auto-deploy from GitHub

2. **Railway.app**
   - $5 free credit monthly
   - Node.js support
   - PostgreSQL/MySQL support

3. **Fly.io**
   - Free tier available
   - Node.js support
   - Global deployment

**Steps for Render.com:**
1. Sign up at https://render.com
2. Create new "Web Service"
3. Connect your GitHub repository
4. Set Build Command: `npm install`
5. Set Start Command: `npm start`
6. Add environment variables from `.env`
7. Deploy!

#### Option B: Use InfinityFree for Frontend Only

1. **Deploy Backend to Render/Railway/Fly.io** (see Option A)
2. **Deploy Frontend to InfinityFree:**
   - Build frontend: `npm run build` (in frontend folder)
   - Upload `dist` folder contents to InfinityFree htdocs
   - Update API URLs to point to your Render backend

#### Option C: Upgrade to Paid Hosting

InfinityFree has paid plans that support Node.js:
- Check their premium hosting options
- Or use other paid hosts like Hostinger, DigitalOcean, AWS

### Step 3: Database Setup on InfinityFree

Since you already have the database created, you need to run the setup script ON the server:

**If using Render.com (Recommended):**

1. **Create MySQL Database on Render:**
   - Go to Render Dashboard
   - Click "New +" → "MySQL"
   - Get connection details

2. **Update `.env` with Render MySQL:**
   ```
   DB_HOST=your-mysql-host.render.com
   DB_PORT=3306
   DB_NAME=your_database_name
   DB_USER=your_username
   DB_PASSWORD=your_password
   ```

3. **Deploy to Render:**
   - Connect GitHub repo
   - Render will auto-install dependencies
   - Add `.env` variables in Render dashboard
   - Deploy!

4. **Run Migration:**
   - In Render dashboard, go to "Shell"
   - Run: `npm run migrate`
   - Run: `npm run seed`

**If using InfinityFree MySQL with different backend host:**

Update your `.env` file with InfinityFree database credentials:
```
DB_HOST=sql100.infinityfree.com
DB_PORT=3306
DB_NAME=if0_40629576_tution
DB_USER=if0_40629576
DB_PASSWORD=Gihan0754163785
```

Then run migration from your backend hosting platform.

### Step 4: Frontend Deployment

**Build Frontend:**
```bash
cd frontend
npm run build
```

**Upload to InfinityFree:**
1. The `dist` folder will be created
2. Upload all files from `dist` to InfinityFree `htdocs`
3. Your site will be live at `your-site.infinityfreeapp.com`

**Update API Configuration:**

In `frontend/src/api/axios.js`, update the base URL:
```javascript
const API = axios.create({
  baseURL: 'https://your-backend.onrender.com/api', // Your Render backend URL
  headers: {
    'Content-Type': 'application/json',
  },
})
```

## 🎯 Recommended Solution

### For Your Client Deployment:

1. **Backend (Node.js + MySQL):**
   - Deploy to **Render.com** (Free)
   - Create MySQL database on Render
   - Run migrations on Render
   - Get backend URL: `https://tuition-sir-backend.onrender.com`

2. **Frontend (React):**
   - Build the React app
   - Deploy to **Vercel** or **Netlify** (Free, better than InfinityFree for React)
   - Or use InfinityFree for static files
   - Update API URL to point to Render backend

3. **Database:**
   - Use Render's MySQL (included with backend)
   - Or use PlanetScale (Free MySQL hosting)
   - Or keep InfinityFree MySQL (but backend must be able to connect remotely)

## 📝 Quick Start with Render.com

1. **Push code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/tuition-sir.git
   git push -u origin main
   ```

2. **Deploy Backend to Render:**
   - Go to https://render.com
   - Sign up with GitHub
   - Click "New +" → "Web Service"
   - Select your repository
   - Choose `backend` as root directory
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables from `.env`
   - Click "Create Web Service"

3. **Create MySQL on Render:**
   - Click "New +" → "MySQL"
   - Get connection details
   - Update environment variables in your backend service

4. **Run Migration:**
   - Open Shell in Render dashboard
   - Run: `npm run migrate && npm run seed`

5. **Deploy Frontend:**
   - Build: `npm run build`
   - Upload to Vercel/Netlify/InfinityFree
   - Update API URL

## 🔐 Default Credentials

After database setup:

**Admin:**
- Email: admin@tuitionsir.com
- Password: admin123

**Teacher:**
- Email: teacher@tuitionsir.com
- Password: teacher123

**Student:**
- Email: student1@tuitionsir.com
- Password: student123

## ⚠️ Remember to Change:
- All default passwords
- JWT_SECRET in production
- Enable HTTPS
- Set CORS properly
- Update API URLs

## 🆘 Need Help?

If you encounter issues, common problems:
1. ❌ "Cannot connect to database" - Check if host allows remote connections
2. ❌ "Node.js not supported" - Use Render.com instead
3. ❌ "CORS error" - Update CORS settings in backend
4. ❌ "404 on routes" - Configure server to handle React Router

**Best approach: Use Render.com for both backend and database, then deploy frontend anywhere!**
