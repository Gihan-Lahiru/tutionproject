@echo off
REM Deployment script for Hostinger MySQL setup (Windows)

echo.
echo ========================================
echo 🚀 Hostinger MySQL Deployment Setup
echo ========================================
echo.

REM Step 1: Switch to MySQL database
echo 📦 Step 1: Switching to MySQL database...
cd backend\config
if exist "database-mysql.js" (
  copy database-mysql.js database.js /Y >nul
  echo ✅ Switched to MySQL database configuration
) else (
  echo ❌ database-mysql.js not found!
  exit /b 1
)

cd ..\..

REM Step 2: Show MySQL env variables
echo.
echo 📝 Step 2: Your MySQL credentials:
echo    DB_HOST=localhost
echo    DB_USER=u579059016_maleesha
echo    DB_PASSWORD=Mal2001@
echo    DB_NAME=tuition_malee
echo    DB_PORT=3306
echo.
echo ⚠️  IMPORTANT: These are already in backend\.env
echo    (MySQL variables are commented for local SQLite)
echo.

REM Step 3: Build frontend
echo 🔨 Step 3: Building frontend...
call npm --prefix frontend run build
if %ERRORLEVEL% EQU 0 (
  echo ✅ Frontend built successfully
) else (
  echo ❌ Frontend build failed!
  exit /b 1
)

REM Step 4: Show next steps
echo.
echo ========================================
echo ✅ Deployment ready!
echo ========================================
echo.
echo 📋 Next Steps:
echo.
echo 1. In Hostinger cPanel ^> MySQL Databases:
echo    - Copy-paste SQL script from:
echo      docs/MYSQL_SETUP_HOSTINGER_COPYPASTE.md
echo.
echo 2. Edit backend\.env:
echo    - Uncomment MySQL variables
echo    - Set NODE_ENV=production
echo.
echo 3. Upload to Hostinger File Manager:
echo    - backend/ folder (entire)
echo    - frontend/dist/ folder
echo    - package.json files
echo.
echo 4. Configure domain pointing
echo.
echo 5. Start Node.js from Hostinger cPanel
echo.
echo ✨ Your app is ready for deployment!
echo.
pause
