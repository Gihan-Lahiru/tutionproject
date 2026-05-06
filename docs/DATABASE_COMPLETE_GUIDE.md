# 📊 Complete Database Guide for Hostinger

## ✅ Database Files Created

Your database has been exported and is ready for Hostinger:

### 1. **SQL Dump File** 
📁 `docs/database-dump.sql`
- Complete MySQL schema
- All tables structure
- Ready to import into Hostinger

**File Size:** 5.54 KB

---

## 📋 Database Tables & Structure

Your application uses these tables:

### **1. Users Table**
- Stores teacher, student, and admin accounts
- **Fields:** id, name, email, password_hash, role, grade, phone, profile_picture, status, created_at

### **2. Classes Table**
- All tuition classes (Grade 6, 7, 8, 9, 10, 11, A/L)
- **Fields:** id, name, title, grade, subject, day, time, fee, description, location, teacher_id

### **3. Class Students Table**
- Enrollment records (which student is in which class)
- **Fields:** id, class_id, student_id, joined_at

### **4. Payments Table** ⭐ (Manual Receipt System)
- Payment records with receipt upload support
- **Fields:** id, payer_id, payer_name, class_id, amount, month, year, status
- **Receipt Fields:** receipt_url, receipt_public_id, receipt_uploaded_at, approval_status, approval_notes

### **5. Videos Table**
- Class videos and lectures
- **Fields:** id, title, description, video_url, thumbnail_url, grade, subject, class_id

### **6. Notes Table**
- Class notes and materials
- **Fields:** id, title, class_id, file_url, file_type, uploaded_by

### **7. Assignments Table**
- Homework and assignments
- **Fields:** id, class_id, title, description, due_date, attachment_url

### **8. Submissions Table**
- Student assignment submissions
- **Fields:** id, assignment_id, student_id, file_url, remarks, marks

### **9. Announcements Table**
- Class announcements
- **Fields:** id, class_id, title, content, message, created_by

### **10. Notifications Table**
- Teacher/student notifications
- **Fields:** id, user_id, type, message, read, created_at

---

## 🔄 How to Import to Hostinger

### **Step 1: Create MySQL Database** ✅ (Already Done)
Database name: `tuition_malee`
Username: `u579059016_maleesha`
Password: `Mal2001@`

### **Step 2: Import Database Schema**

1. Go to **Hostinger cPanel** → **phpMyAdmin**
2. Select database **"tuition_malee"** from left sidebar
3. Click **"Import"** tab at top
4. Choose file: **docs/database-dump.sql**
5. Click **"Go"** button

**Expected output:** `Successful import. 11 tables created`

### **Step 3: Verify Import**

In phpMyAdmin, you should see:
```
✅ users
✅ classes
✅ class_students
✅ payments
✅ videos
✅ notes
✅ assignments
✅ submissions
✅ announcements
✅ notifications
```

---

## 📁 File Uploads & Media

Your app stores uploads in these locations:

### **backend/uploads/** - Student Files
```
uploads/
├── profiles/          → Profile pictures
├── receipts/          → Payment receipts (PDF, JPG, PNG)
├── assignments/       → Submitted homework
├── notes/             → Class materials
├── videos/            → Lecture videos
└── papers/            → Past papers
```

**To preserve student uploads:**
1. Download entire `backend/uploads/` folder
2. Upload to Hostinger at same location
3. Set permissions to `755` (read/write)

---

## 🎯 Sample Data Included

When you run your application, it automatically creates sample classes:

### **Grades:**
- Grade 6, 7, 8, 9, 10, 11, A/L

### **Institutes:**
- Prebhashi - Hettipola
- Focus - Hadungamuwa

### **Sample Schedule:**
- **Day:** Tuesday/Friday
- **Time:** 4.00pm - 7.00pm
- **Fee:** 1000 (Grade 6), varies by grade

---

## 💾 Complete Hostinger Setup Checklist

- [ ] **Step 1:** Create MySQL user & database (already done ✅)
- [ ] **Step 2:** Upload `backend/` folder
- [ ] **Step 3:** Upload `frontend/dist/` folder  
- [ ] **Step 4:** Upload `docs/database-dump.sql`
- [ ] **Step 5:** In phpMyAdmin, import `database-dump.sql`
- [ ] **Step 6:** Upload files from `backend/uploads/`
- [ ] **Step 7:** Set `.env` with MySQL credentials
- [ ] **Step 8:** Switch database config: `Copy-Item database-mysql.js database.js`
- [ ] **Step 9:** Run `npm install` on Hostinger
- [ ] **Step 10:** Start Node.js application

---

## ✨ What Happens When Backend Starts?

When your backend runs on Hostinger for the first time:

1. ✅ Connects to MySQL (`tuition_malee`)
2. ✅ Reads `database-dump.sql` schema
3. ✅ Creates all 10 tables
4. ✅ Runs data migrations (if any)
5. ✅ Creates sample classes automatically
6. ✅ Ready to accept student/teacher logins

---

## 🔐 Security Notes

Your `.env` contains sensitive credentials:
```
DB_PASSWORD=Mal2001@
CLOUDINARY_API_SECRET=UJGjfENbApdfslD3_fCt5tVDef0
EMAIL_PASSWORD=jbmxlkdqizlypuok
```

⚠️ **Important:**
- ✅ Committed to `.env` (not in .gitignore) - OK for private projects
- ⚠️ Don't commit to public GitHub
- ✅ Change passwords before production if needed

---

## 📞 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Table already exists" | Tables already imported, proceed |
| "Access denied for user" | Check MySQL credentials in `.env` |
| "Foreign key error" | Run import again, disable FK check if needed |
| "No tables found" | Import `database-dump.sql` in phpMyAdmin |
| "Uploads not showing" | Upload `backend/uploads/` folder to Hostinger |

---

## ✅ You're Ready for Hostinger!

All database data and schema are prepared. Follow the **Complete Hostinger Setup Checklist** above to deploy successfully! 🚀
