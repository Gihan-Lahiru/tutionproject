# Quick Start Commands for Render Deployment

## Step 1: Initialize Git (if not already done)
```bash
cd "c:\Users\gihan\Desktop\PROJECTS\BUSINESS\Tution Project"
git init
git add .
git commit -m "Initial commit - Tuition Management System"
```

## Step 2: Create GitHub Repository
1. Go to https://github.com/new
2. Name: `tuition-management-system`
3. Create repository
4. Copy the repository URL

## Step 3: Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/tuition-management-system.git
git branch -M main
git push -u origin main
```

## Step 4: Deploy on Render.com
Follow the complete guide in: **RENDER_DEPLOYMENT_GUIDE.md**

---

## Environment Variables for Render Backend

When creating the backend service on Render, add these environment variables:

```
NODE_ENV=production
PORT=5000

# Database (will be auto-filled from Render MySQL)
DB_HOST=[From Render MySQL Internal Host]
DB_PORT=3306
DB_NAME=tuition_sir_db
DB_USER=[From Render MySQL]
DB_PASSWORD=[From Render MySQL]

# JWT
JWT_SECRET=tuition_sir_super_secret_jwt_key_production_2025_change_this
JWT_EXPIRES_IN=7d

# AWS (Optional - for file uploads)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-southeast-1
AWS_S3_BUCKET=tuition-sir-uploads
```

---

## Frontend Environment Variable

In Render Static Site settings, add:

```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

---

## After Deployment - Run Database Setup

In Render Backend Shell:

```bash
npm run setup
```

Or run separately:
```bash
npm run migrate
npm run seed
```

---

## Default Login Credentials

**Admin:**
- Email: admin@tuitionsir.com
- Password: admin123

**Teacher:**
- Email: teacher@tuitionsir.com
- Password: teacher123

**Student:**
- Email: student1@tuitionsir.com
- Password: student123

⚠️ **Change these passwords after first login!**
