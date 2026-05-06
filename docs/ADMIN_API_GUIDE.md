# 📡 Admin API Guide - Database Management via Backend

Your backend now has **admin API endpoints** to manage the database without direct MySQL access!

---

## 🚀 Quick Start

### **Base URL:**
```
http://localhost:5000/api/admin
```

### **Authentication:**
All endpoints require a JWT token in the header:
```
Authorization: Bearer <YOUR_JWT_TOKEN>
```

### **Role Requirements:**
- ✅ Admin users
- ✅ Teachers (limited access)

---

## 📋 Available Endpoints

### **1. USERS MANAGEMENT**

#### Get all users
```bash
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:5000/api/admin/users
```

**Response:**
```json
{
  "success": true,
  "count": 15,
  "users": [
    {
      "id": "user-123",
      "name": "John Teacher",
      "email": "john@gmail.com",
      "role": "teacher",
      "grade": null,
      "status": "active",
      "created_at": "2026-05-05T10:00:00"
    }
  ]
}
```

#### Get specific user
```bash
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:5000/api/admin/users/user-123
```

#### Update user status
```bash
curl -X PATCH \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status": "active"}' \
  http://localhost:5000/api/admin/users/user-123/status
```

**Status options:** `active`, `inactive`, `suspended`

#### Update user role
```bash
curl -X PATCH \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"role": "teacher"}' \
  http://localhost:5000/api/admin/users/user-123/role
```

**Role options:** `student`, `teacher`, `admin`

---

### **2. PAYMENTS MANAGEMENT**

#### Get all payments
```bash
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:5000/api/admin/payments
```

#### Get pending receipt approvals
```bash
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:5000/api/admin/payments/receipts/pending
```

**Shows:**
- Student name
- Receipt URL
- Month/Year
- Amount
- Status

#### Approve a receipt
```bash
curl -X PATCH \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"approval_status": "approved", "approval_notes": "Receipt verified"}' \
  http://localhost:5000/api/admin/payments/payment-123/approval
```

#### Reject a receipt
```bash
curl -X PATCH \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"approval_status": "rejected", "approval_notes": "Receipt image unclear"}' \
  http://localhost:5000/api/admin/payments/payment-123/approval
```

#### Reset payment (for testing)
```bash
curl -X POST \
  -H "Authorization: Bearer <TOKEN>" \
  http://localhost:5000/api/admin/payments/payment-123/reset
```

**This will:**
- Set status back to `pending`
- Clear approval status
- Remove receipt URL
- Allow student to re-upload

---

### **3. CLASSES MANAGEMENT**

#### Get all classes
```bash
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:5000/api/admin/classes
```

#### Update class fee
```bash
curl -X PATCH \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"fee": 1500}' \
  http://localhost:5000/api/admin/classes/class-123/fee
```

---

### **4. STATISTICS & EXPORT**

#### Get dashboard stats
```bash
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:5000/api/admin/stats
```

**Returns:**
```json
{
  "success": true,
  "stats": {
    "users": {
      "student": 45,
      "teacher": 5,
      "admin": 1
    },
    "payments": {
      "pending": 12,
      "completed": 35,
      "rejected": 2
    },
    "pendingReceiptsCount": 5,
    "totalRevenue": 125000
  }
}
```

#### Export table data to CSV
```bash
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:5000/api/admin/export?table=users \
  -o users.csv
```

**Available tables:**
- `users`
- `classes`
- `payments`
- `videos`
- `notes`
- `assignments`
- `announcements`

---

## 🔗 Using with Postman

1. **Import collection** (copy-paste below)
2. **Set JWT token** in Postman environment
3. **Send requests**

### **Postman Collection JSON:**

```json
{
  "info": {
    "name": "Tuition Admin API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Users",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}",
            "type": "text"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/admin/users",
          "host": ["localhost:5000"],
          "path": ["api", "admin", "users"]
        }
      }
    },
    {
      "name": "Get Pending Receipts",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}",
            "type": "text"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/admin/payments/receipts/pending",
          "host": ["localhost:5000"],
          "path": ["api", "admin", "payments", "receipts", "pending"]
        }
      }
    },
    {
      "name": "Approve Receipt",
      "request": {
        "method": "PATCH",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}",
            "type": "text"
          },
          {
            "key": "Content-Type",
            "value": "application/json",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"approval_status\": \"approved\", \"approval_notes\": \"Receipt verified\"}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/admin/payments/{{paymentId}}/approval",
          "host": ["localhost:5000"],
          "path": ["api", "admin", "payments", "{{paymentId}}", "approval"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

---

## 🔑 Getting JWT Token

### **Step 1: Login via Frontend**
Go to `http://localhost:3002` and login as admin/teacher

### **Step 2: Get Token from Browser**
```
1. Press F12 (DevTools)
2. Go to Application → Local Storage
3. Find key: `auth_token`
4. Copy the token value
```

### **Step 3: Use in API**
```bash
export TOKEN="your-token-here"

curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/admin/users
```

---

## 📝 Example Workflows

### **Approve All Pending Receipts**

```bash
#!/bin/bash
TOKEN="your-token"

# Get pending receipts
receipts=$(curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/admin/payments/receipts/pending | jq '.receipts[].id')

# Approve each one
for id in $receipts; do
  curl -X PATCH \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"approval_status": "approved", "approval_notes": "Auto-approved"}' \
    http://localhost:5000/api/admin/payments/$id/approval
  
  echo "Approved: $id"
done
```

### **Get Monthly Revenue**

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/admin/stats | jq '.stats.totalRevenue'
```

### **Export All Users**

```bash
curl -H "Authorization: Bearer $TOKEN" \
  'http://localhost:5000/api/admin/export?table=users' \
  -o students-list.csv
```

---

## ✅ You're Ready!

Your backend now has a complete admin API for managing your database via HTTP endpoints instead of direct MySQL access!

**Benefits:**
- ✅ Works locally with SQLite
- ✅ Same code works on Hostinger MySQL
- ✅ More secure than direct DB access
- ✅ Easy to use with Postman/curl
- ✅ Can build admin UI on top

