# 🚀 Hostinger Deployment Guide

## **Phase 1: Import Database Schema**

Your `database-dump.sql` file has all 10 tables ready to import!

### **Step 1: Access phpMyAdmin on Hostinger**

1. Log in to [Hostinger Control Panel](https://hpanel.hostinger.com)
2. Go to **Databases** → **phpMyAdmin**
3. You'll see login screen - credentials:
   - **Username:** `u579059016_maleesha`
   - **Password:** `Mal2001@`

### **Step 2: Select Database**

1. Click on database **`tuition_malee`** (left sidebar)
2. It should be empty (no tables yet)

### **Step 3: Import Schema**

1. Click **Import** tab
2. Choose file: **`database-dump.sql`** from your laptop
3. Click **"Go"** or **"Import"**
4. ✅ Wait for success message

### **Step 4: Verify Tables**

After import, you should see these 10 tables:
- ✅ users
- ✅ classes
- ✅ class_students
- ✅ payments
- ✅ videos
- ✅ notes
- ✅ assignments
- ✅ submissions
- ✅ announcements
- ✅ notifications

---

## **Phase 2: Prepare Backend Files**

### **Step 1: Update `.env`**

Your `.env` currently has MySQL credentials for local testing. For Hostinger, change:

```bash
# COMMENT OUT for Hostinger:
# NODE_ENV=development

# USE instead:
NODE_ENV=production
```

### **Step 2: Switch Database Config**

In `backend/server.js`, change:
```javascript
// FROM:
const db = require('./config/database')  // SQLite

// TO:
const db = require('./config/database-mysql')  // MySQL
```

Or create a dynamic loader:
```javascript
const db = process.env.NODE_ENV === 'production' 
  ? require('./config/database-mysql')
  : require('./config/database')
```

### **Step 3: Build Frontend**

```bash
cd frontend
npm run build
```

This creates `frontend/dist/` folder (ready to upload)

---

## **Phase 3: Upload to Hostinger**

### **Via FTP (Recommended)**

1. **Get FTP credentials** from Hostinger Control Panel:
   - Host, Username, Password
   
2. **Use FTP client** (FileZilla, WinSCP):
   - Connect to Hostinger
   - Navigate to public root folder
   - Upload:
     ```
     backend/
       ├── config/
       ├── controllers/
       ├── middleware/
       ├── models/
       ├── routes/
       ├── utils/
       ├── package.json
       ├── server.js
       └── .env (with MySQL credentials)
     
     frontend/dist/  → upload entire dist folder
     package.json (root)
     ```

3. **Install dependencies on Hostinger:**
   ```bash
   cd backend
   npm install
   ```

### **Via SSH (Advanced)**

```bash
ssh u579059016@your-hostinger-domain.com

# Clone from Git or upload files
cd public_html
npm install
NODE_ENV=production npm start
```

---

## **Phase 4: Start Application**

### **Option A: Use Render (Recommended)**

Update `backend/render.yaml`:
```yaml
services:
  - type: web
    name: tuition-backend
    env: node
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DB_HOST
        value: localhost
      - key: DB_USER
        value: u579059016_maleesha
      - key: DB_PASSWORD
        value: Mal2001@
      - key: DB_NAME
        value: tuition_malee
```

Push to GitHub → Render auto-deploys

### **Option B: Use Hostinger Node.js Hosting**

1. Enable Node.js from Hostinger Control Panel
2. Set entry point: `backend/server.js`
3. Set Node version: v22+
4. Start application

---

## **Phase 5: Frontend Setup**

### **Option A: Hostinger Static Hosting**

1. Upload `frontend/dist/` contents to public folder
2. Create `.htaccess` for React Router:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### **Option B: CDN (Cloudflare, Netlify)**

1. Push frontend to GitHub
2. Deploy to Netlify:
   - Connect GitHub repo
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
   - Set backend API URL in environment

---

## **Phase 6: Verify Deployment**

After deploying:

```bash
# Test API
curl https://your-domain.com/api/health

# Test admin endpoint
curl -H "Authorization: Bearer <TOKEN>" \
  https://your-domain.com/api/admin/stats

# Check database
curl https://your-domain.com/api/admin/users
```

---

## **Checklist Before Going Live**

- [ ] Database imported (10 tables visible in phpMyAdmin)
- [ ] `.env` has MySQL credentials
- [ ] `NODE_ENV=production`
- [ ] Backend files uploaded to Hostinger
- [ ] Frontend built (`npm run build`)
- [ ] Frontend deployed
- [ ] Both .env files match across environments
- [ ] Database connection working (test with admin API)
- [ ] Cloudinary still working (check video/file uploads)
- [ ] Email service working (check password reset)
- [ ] SSL certificate installed (https://...)

---

## **Troubleshooting**

| Problem | Solution |
|---------|----------|
| Database connection error | Check MySQL credentials in `.env` |
| Tables not found | Import database-dump.sql again |
| File uploads not working | Check Cloudinary credentials |
| Emails not sending | Check Gmail SMTP credentials |
| CORS errors | Update `FRONTEND_URL` in backend `.env` |
| React Router 404s | Add `.htaccess` rules for SPA routing |

---

## **Quick Start (TL;DR)**

1. ✅ Import `database-dump.sql` via phpMyAdmin
2. ✅ Change `.env` to `NODE_ENV=production`
3. ✅ Switch to MySQL config: `require('./config/database-mysql')`
4. ✅ Upload `backend/` and `frontend/dist/` to Hostinger
5. ✅ Run `npm install` on server
6. ✅ Start Node.js app
7. ✅ Test with API calls

**Done!** 🎉 Your app is live on Hostinger!

