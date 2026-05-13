# Quick Start: Vercel Local Development

## Prerequisites

1. Node.js 16+ installed
2. Vercel CLI installed:
   ```bash
   npm install -g vercel
   ```

## Run Locally (Development)

From project root:

```bash
# 1. Install backend dependencies
cd backend
npm install
cd ..

# 2. Install Vercel CLI (if not already done)
npm install -g vercel

# 3. Start local dev server
vercel dev
```

**Output:**
```
> Using Node.js 18.x
> Ready! Available at http://localhost:3000
```

## Test an Endpoint

Open a new terminal:

```bash
# Test auth endpoint (without token - should fail or return public route)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Test users endpoint (requires auth token)
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Common Issues

| Error | Solution |
|-------|----------|
| `Cannot find module '../backend/...'` | Verify paths in `api/*.js` match your file structure |
| `ENOENT: no such file or directory, open 'tuition_sir.db'` | Run from project root; or update `backend/config/database.js` path |
| `PORT already in use` | Run `lsof -i :3000` and kill process, or use `vercel dev --port 3001` |
| `Module not found: auth.js` | Check `backend/middleware/auth.js` exists & exports correctly |

## Deploy to Production

Once tested locally:

```bash
# 1. Login to Vercel
vercel login

# 2. Deploy to production
vercel --prod

# 3. Set environment variables in Vercel dashboard
# (or use vercel env add JWT_SECRET, etc.)

# 4. View logs
vercel logs <your-project-name>
```

## What's Running?

- **Frontend**: `frontend/` → served at `/`
- **API**: `api/*.js` → serverless functions at `/api/<route>`
- **Backend**: `backend/` → controllers/models imported by API handlers

**No Express server running anymore** — everything is serverless! 🎉

---

Need help? See `VERCEL_CONVERSION_GUIDE.md`
