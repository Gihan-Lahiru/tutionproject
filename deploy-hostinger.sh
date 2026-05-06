#!/bin/bash
# Deployment script for Hostinger MySQL setup

echo "🚀 Hostinger MySQL Deployment Setup"
echo "===================================="

# Step 1: Switch to MySQL database
echo ""
echo "📦 Step 1: Switching to MySQL database..."
cd backend/config
if [ -f "database-mysql.js" ]; then
  cp database-mysql.js database.js
  echo "✅ Switched to MySQL database configuration"
else
  echo "❌ database-mysql.js not found!"
  exit 1
fi

cd ../..

# Step 2: Update .env for MySQL
echo ""
echo "📝 Step 2: Update .env file with:"
echo "   DB_HOST=localhost"
echo "   DB_USER=u579059016_maleesha"
echo "   DB_PASSWORD=Mal2001@"
echo "   DB_NAME=tuition_malee"
echo "   DB_PORT=3306"
echo ""
echo "⚠️  IMPORTANT: Edit backend/.env and uncomment MySQL variables"
echo "   Remove SQLite references"

# Step 3: Build frontend
echo ""
echo "🔨 Step 3: Building frontend..."
npm --prefix frontend run build
if [ $? -eq 0 ]; then
  echo "✅ Frontend built successfully"
else
  echo "❌ Frontend build failed!"
  exit 1
fi

# Step 4: Ready for deployment
echo ""
echo "✅ Deployment ready!"
echo ""
echo "📋 Next Steps:"
echo "1. In Hostinger cPanel → MySQL Databases:"
echo "   - Run the SQL script from MYSQL_SETUP_HOSTINGER_COPYPASTE.md"
echo ""
echo "2. Upload files to Hostinger:"
echo "   - Use File Manager or FTP"
echo "   - Upload backend/ and frontend/dist/ folders"
echo ""
echo "3. Point your domain to the public folder"
echo ""
echo "✨ Done!"
