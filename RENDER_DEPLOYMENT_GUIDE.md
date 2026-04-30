# 🚀 Complete Render.com Deployment Guide

## Step-by-Step Deployment Process

### 📋 Prerequisites
- GitHub account
- Render.com account (free)
- Your project code ready

---

## Part 1: Push Code to GitHub

### 1. Initialize Git Repository

Open terminal in your project root folder and run:

```bash
cd "c:\Users\gihan\Desktop\PROJECTS\BUSINESS\Tution Project"
git init
git add .
git commit -m "Initial commit - Tuition Management System"
```

### 2. Create GitHub Repository

1. Go to https://github.com
2. Click the "+" icon → "New repository"
3. Name it: `tuition-management-system`
4. Keep it Public (or Private if you prefer)
5. Don't initialize with README (we already have code)
6. Click "Create repository"

### 3. Push to GitHub

Copy the commands from GitHub and run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/tuition-management-system.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## Part 2: Deploy Backend to Render

### 1. Sign Up / Login to Render

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with your GitHub account
4. Authorize Render to access your repositories

### 2. Create MySQL Database

1. In Render Dashboard, click **"New +"**
2. Select **"MySQL"**
3. Fill in the details:
   - **Name:** `tuition-sir-db`
   - **Database:** `tuition_sir_db`
   - **User:** `tuition_sir_user`
   - **Region:** Singapore (closest to you)
   - **Plan:** Free
4. Click **"Create Database"**
5. **Wait 2-3 minutes** for database to be ready
6. **⚠️ Important:** Copy the database connection details:
   - Internal Database URL
   - Host
   - Port
   - Database Name
   - Username
   - Password

### 3. Create Backend Web Service

1. Click **"New +"** again
2. Select **"Web Service"**
3. Connect your GitHub repository: `tuition-management-system`
4. Configure the service:

   **Basic Settings:**
   - **Name:** `tuition-sir-backend`
   - **Region:** Singapore
   - **Branch:** main
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

   **Advanced Settings - Environment Variables:**
   
   Click "Advanced" and add these environment variables:

   ```
   NODE_ENV = production
   PORT = 5000
   
   DB_HOST = [Copy from MySQL database - Internal Host]
   DB_PORT = [Copy from MySQL database - usually 3306]
   DB_NAME = tuition_sir_db
   DB_USER = [Copy from MySQL database]
   DB_PASSWORD = [Copy from MySQL database]
   
   JWT_SECRET = tuition_sir_super_secret_jwt_key_production_2025
   JWT_EXPIRES_IN = 7d
   
   AWS_ACCESS_KEY_ID = your_aws_key (optional for now)
   AWS_SECRET_ACCESS_KEY = your_aws_secret (optional for now)
   AWS_REGION = ap-southeast-1
   AWS_S3_BUCKET = tuition-sir-uploads
   ```

5. Click **"Create Web Service"**

6. **Wait for deployment** (5-10 minutes for first deploy)

### 4. Run Database Migration

Once backend is deployed successfully:

1. In your backend service dashboard, click **"Shell"** tab
2. Run these commands one by one:

   ```bash
   npm run migrate
   ```
   
   Wait for tables to be created, then:
   
   ```bash
   npm run seed
   ```

3. You should see success messages with sample data created

### 5. Test Backend

1. Copy your backend URL (e.g., `https://tuition-sir-backend.onrender.com`)
2. Open in browser: `https://tuition-sir-backend.onrender.com/api/health`
3. You should see: `{"status":"ok","message":"Server is running"}`

---

## Part 3: Deploy Frontend to Render

### 1. Update Frontend API URL

Before deploying frontend, update the API URL:

In `frontend/src/api/axios.js`:

```javascript
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://tuition-sir-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### 2. Create Environment File for Frontend

Create `frontend/.env.production`:

```
VITE_API_URL=https://tuition-sir-backend.onrender.com/api
```

Replace with your actual backend URL from Render.

### 3. Commit and Push Changes

```bash
git add .
git commit -m "Update API URL for production"
git push
```

### 4. Create Frontend Static Site on Render

1. In Render Dashboard, click **"New +"**
2. Select **"Static Site"**
3. Connect your repository: `tuition-management-system`
4. Configure:

   **Basic Settings:**
   - **Name:** `tuition-sir-frontend`
   - **Branch:** main
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

   **Environment Variables:**
   ```
   VITE_API_URL = https://tuition-sir-backend.onrender.com/api
   ```

5. Click **"Create Static Site"**

6. **Wait for deployment** (3-5 minutes)

### 5. Test Your Application

1. Copy your frontend URL (e.g., `https://tuition-sir-frontend.onrender.com`)
2. Open it in browser
3. Try logging in with default credentials:

   **Admin:**
   - Email: `admin@tuitionsir.com`
   - Password: `admin123`

   **Teacher:**
   - Email: `teacher@tuitionsir.com`
   - Password: `teacher123`

   **Student:**
   - Email: `student1@tuitionsir.com`
   - Password: `student123`

---

## Part 4: Configure CORS (If Needed)

If you get CORS errors, update backend CORS settings:

In `backend/server.js`, update CORS configuration:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://tuition-sir-frontend.onrender.com', // Your frontend URL
    'https://your-custom-domain.com' // If you have custom domain
  ],
  credentials: true
}))
```

Commit and push changes - Render will auto-deploy.

---

## 🎉 Your Application is Now Live!

**Backend URL:** `https://tuition-sir-backend.onrender.com`
**Frontend URL:** `https://tuition-sir-frontend.onrender.com`
**Database:** Hosted on Render MySQL (Free)

---

## 📝 Important Notes

### Render Free Tier Limitations:

1. **Services spin down after 15 minutes of inactivity**
   - First request after inactivity may take 30-60 seconds
   - This is normal for free tier
   - Upgrade to paid plan for always-on service

2. **750 hours/month free** - More than enough for one service

3. **Monthly limits:**
   - 100 GB bandwidth
   - Build minutes included

### Next Steps:

1. **Change all default passwords** in production
2. **Set up custom domain** (optional):
   - Go to your service settings
   - Add custom domain
   - Update DNS records

3. **Enable HTTPS** (automatic on Render)

4. **Set up monitoring:**
   - Render provides basic monitoring
   - Check logs regularly

5. **Backup database regularly:**
   - Export from Render MySQL dashboard
   - Schedule regular backups

---

## 🔧 Troubleshooting

### Backend won't start:
- Check environment variables are set correctly
- Check build logs for errors
- Ensure database is running

### Database connection errors:
- Verify DB credentials match exactly
- Use Internal Database URL from Render
- Check database is in same region

### Frontend can't connect to backend:
- Verify VITE_API_URL is correct
- Check CORS settings in backend
- Check browser console for errors

### "Service Unavailable" after deployment:
- Wait 1-2 minutes for service to fully start
- Check if service is "Live" in Render dashboard
- Review deployment logs

---

## 💡 Pro Tips

1. **Use Render's Internal URLs** for database connections (faster, free)
2. **Enable auto-deploy** - Render automatically deploys on git push
3. **Monitor logs** - Check logs regularly for errors
4. **Use environment variables** - Never hardcode secrets
5. **Test locally first** - Always test before pushing to production

---

## 🆘 Need Help?

- **Render Docs:** https://render.com/docs
- **Community Forum:** https://community.render.com
- **Status Page:** https://status.render.com

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] MySQL database created on Render
- [ ] Backend service deployed
- [ ] Database migrated and seeded
- [ ] Backend health check working
- [ ] Frontend API URL updated
- [ ] Frontend deployed
- [ ] Can login to application
- [ ] CORS configured
- [ ] Default passwords changed
- [ ] Custom domain configured (optional)

---

**🎊 Congratulations! Your Tuition Management System is now live and ready for your client!**
