# 🚀 Render.com Deployment - Step-by-Step Checklist

## ✅ Pre-Deployment Setup

### 1. GitHub Setup
- [ ] Create GitHub account (if you don't have one)
- [ ] Install Git on your computer
- [ ] Open terminal in project folder: `c:\Users\gihan\Desktop\PROJECTS\BUSINESS\Tution Project`
- [ ] Run: `git init`
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Initial commit"`
- [ ] Create new repository on GitHub named: `tuition-management-system`
- [ ] Copy repository URL
- [ ] Run: `git remote add origin [YOUR_REPO_URL]`
- [ ] Run: `git branch -M main`
- [ ] Run: `git push -u origin main`

---

## ✅ Render.com Backend Deployment

### 2. Create Render Account
- [ ] Go to https://render.com
- [ ] Click "Get Started for Free"
- [ ] Sign up with GitHub
- [ ] Authorize Render to access your repositories

### 3. Create MySQL Database
- [ ] Click "New +" in Render dashboard
- [ ] Select "MySQL"
- [ ] Enter details:
  - Name: `tuition-sir-db`
  - Database: `tuition_sir_db`
  - User: `tuition_sir_user`
  - Region: Singapore
  - Plan: Free
- [ ] Click "Create Database"
- [ ] **WAIT 2-3 minutes** for database to be ready
- [ ] Copy and save these details:
  - [ ] Internal Database URL
  - [ ] Host
  - [ ] Port (usually 3306)
  - [ ] Database Name
  - [ ] Username
  - [ ] Password

### 4. Create Backend Web Service
- [ ] Click "New +" → "Web Service"
- [ ] Select your repository: `tuition-management-system`
- [ ] Configure:
  - Name: `tuition-sir-backend`
  - Region: Singapore
  - Branch: main
  - Root Directory: `backend`
  - Runtime: Node
  - Build Command: `npm install`
  - Start Command: `npm start`
  - Plan: Free

### 5. Add Environment Variables
Click "Advanced" and add:

- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `5000`
- [ ] `DB_HOST` = [Paste from MySQL Internal Host]
- [ ] `DB_PORT` = `3306`
- [ ] `DB_NAME` = `tuition_sir_db`
- [ ] `DB_USER` = [Paste from MySQL Username]
- [ ] `DB_PASSWORD` = [Paste from MySQL Password]
- [ ] `JWT_SECRET` = `tuition_sir_super_secret_jwt_key_production_2025`
- [ ] `JWT_EXPIRES_IN` = `7d`

- [ ] Click "Create Web Service"
- [ ] **WAIT 5-10 minutes** for deployment

### 6. Setup Database
- [ ] Once backend shows "Live", click "Shell" tab
- [ ] Run: `npm run migrate`
- [ ] Wait for success message
- [ ] Run: `npm run seed`
- [ ] Wait for success message showing sample data created

### 7. Test Backend
- [ ] Copy your backend URL (e.g., `https://tuition-sir-backend.onrender.com`)
- [ ] Open in browser: `https://your-backend-url.onrender.com/api/health`
- [ ] Should see: `{"status":"ok","message":"Server is running"}`

---

## ✅ Frontend Deployment

### 8. Update Frontend Configuration
- [ ] Open `frontend/.env.production`
- [ ] Update: `VITE_API_URL=https://your-actual-backend-url.onrender.com/api`
- [ ] Save file
- [ ] In terminal, run:
  ```bash
  git add .
  git commit -m "Update API URL for production"
  git push
  ```

### 9. Create Frontend Static Site
- [ ] In Render dashboard, click "New +" → "Static Site"
- [ ] Select repository: `tuition-management-system`
- [ ] Configure:
  - Name: `tuition-sir-frontend`
  - Branch: main
  - Root Directory: `frontend`
  - Build Command: `npm install && npm run build`
  - Publish Directory: `dist`

### 10. Add Frontend Environment Variable
- [ ] Click "Advanced"
- [ ] Add: `VITE_API_URL` = `https://your-backend-url.onrender.com/api`
- [ ] Click "Create Static Site"
- [ ] **WAIT 3-5 minutes** for deployment

---

## ✅ Testing & Verification

### 11. Test Complete Application
- [ ] Copy frontend URL (e.g., `https://tuition-sir-frontend.onrender.com`)
- [ ] Open in browser
- [ ] Try logging in with admin account:
  - Email: `admin@tuitionsir.com`
  - Password: `admin123`
- [ ] Should successfully login and see dashboard
- [ ] Try teacher account:
  - Email: `teacher@tuitionsir.com`
  - Password: `teacher123`
- [ ] Try student account:
  - Email: `student1@tuitionsir.com`
  - Password: `student123`

### 12. Test Features
- [ ] Create a new class (as teacher)
- [ ] View classes (as student)
- [ ] Upload a note/video (as teacher)
- [ ] Check if data persists after refresh

---

## ✅ Post-Deployment Security

### 13. Change Default Passwords
- [ ] Login as admin
- [ ] Go to Settings
- [ ] Change password from `admin123` to something secure
- [ ] Repeat for teacher and student accounts

### 14. Update JWT Secret (Optional but Recommended)
- [ ] In Render backend service
- [ ] Go to "Environment" tab
- [ ] Update `JWT_SECRET` to a new random string
- [ ] Click "Save Changes"
- [ ] Service will auto-redeploy

---

## ✅ Share with Client

### 15. Prepare Client Handover
- [ ] Document the URLs:
  - Frontend: `https://tuition-sir-frontend.onrender.com`
  - Backend API: `https://tuition-sir-backend.onrender.com/api`
  
- [ ] Provide admin credentials:
  - Email: `admin@tuitionsir.com`
  - Password: [The new password you set]

- [ ] Explain:
  - [ ] Free tier spins down after 15 min inactivity (first load may be slow)
  - [ ] Can upgrade to paid plan for always-on service
  - [ ] Recommend changing all passwords immediately

### 16. Optional Enhancements
- [ ] Set up custom domain (if client has one)
- [ ] Configure email notifications
- [ ] Set up automated backups
- [ ] Add monitoring/analytics

---

## 🎉 Deployment Complete!

**Your URLs:**
- Frontend: `https://tuition-sir-frontend.onrender.com`
- Backend: `https://tuition-sir-backend.onrender.com`
- Database: Hosted on Render MySQL (Free)

**What's Live:**
- ✅ Teacher & Student Dashboards
- ✅ Class Management
- ✅ Assignments & Submissions
- ✅ Notes & Videos
- ✅ Payment Tracking
- ✅ User Authentication

---

## 📞 Support Info

**Render Status:** https://status.render.com
**Render Docs:** https://render.com/docs
**Community:** https://community.render.com

---

## ⚠️ Important Notes

1. **Free Tier Sleep:** Services sleep after 15 min inactivity. First request may take 30-60 seconds.
2. **Monthly Limits:** 750 hours/month, 100 GB bandwidth (plenty for most use cases)
3. **Database Backups:** Manually backup database monthly
4. **HTTPS:** Automatically enabled on Render
5. **Auto-Deploy:** Pushing to GitHub main branch triggers auto-deployment

---

**Congratulations! 🎊 Your Tuition Management System is now live and production-ready!**
