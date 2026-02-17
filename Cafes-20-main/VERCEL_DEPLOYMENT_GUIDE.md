# 🚀 Vercel Deployment Guide - Complete Setup

## The Himalayan Cafes - Frontend on Vercel + Backend on Render

---

## 📋 Current Setup

**Frontend (Vercel):**
- URL: `https://cafes-20-main-nias.vercel.app`
- Framework: React + Vite
- Environment: `VITE_API_URL`

**Backend (Render):**
- URL: `https://cafes-20-main.onrender.com`
- Framework: Node.js + Express + TypeScript
- CORS: Configured for Vercel

---

## ✅ Backend Configuration (Render)

### 1. Update Environment Variable

Go to Render Dashboard → cafes-20-main → Environment

Update:
```env
CLIENT_URL=https://cafes-20-main-nias.vercel.app
```

**IMPORTANT:** No trailing slash!

### 2. CORS Configuration (Already Updated)

The backend now supports:
- ✅ `http://localhost:5173` (development)
- ✅ `https://cafes-20-main-nias.vercel.app` (production)
- ✅ `https://cafes-20-main-*-nias.vercel.app` (Vercel preview URLs)

### 3. Redeploy Backend

After updating `CLIENT_URL`:
1. Render will auto-redeploy
2. Wait 2-3 minutes
3. Check logs for:
   ```
   CLIENT_URL: https://cafes-20-main-nias.vercel.app
   ✅ Added CLIENT_URL to allowed origins
   ```

---

## 🎯 Frontend Configuration (Vercel)

### 1. Environment Variables

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add:
```
Name:  VITE_API_URL
Value: https://cafes-20-main.onrender.com/api
Scope: Production, Preview, Development
```

**IMPORTANT:** Include `/api` at the end!

### 2. Build Settings

Verify in Vercel Dashboard → Settings → General:

```
Framework Preset:     Vite
Build Command:        npm run build
Output Directory:     dist
Install Command:      npm install
Root Directory:       client (if in subdirectory)
```

### 3. Redeploy Frontend

```bash
git add .
git commit -m "Update CORS for Vercel deployment"
git push origin main
```

Vercel will auto-deploy in 1-2 minutes.

---

## 🔍 Verification

### Test 1: Check Environment Variables

**Backend (Render Logs):**
```
🔧 Environment Variables Loaded (Sanitized):
   CLIENT_URL: https://cafes-20-main-nias.vercel.app
   ✅ Added CLIENT_URL to allowed origins
```

**Frontend (Browser Console):**
```javascript
console.log(import.meta.env.VITE_API_URL);
// Should show: https://cafes-20-main.onrender.com/api
```

### Test 2: CORS Headers

Open DevTools → Network tab → Select any API request:

**Response Headers:**
```
access-control-allow-origin: https://cafes-20-main-nias.vercel.app
access-control-allow-credentials: true
access-control-allow-methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
```

### Test 3: Preflight OPTIONS

Check for OPTIONS requests:
```
Request Method: OPTIONS
Status Code: 204 No Content
access-control-allow-origin: https://cafes-20-main-nias.vercel.app
```

### Test 4: WebSocket Connection

Check Socket.IO connection:
```
✅ Connected to server
Socket.IO URL: https://cafes-20-main.onrender.com
```

---

## 🔧 Troubleshooting

### Issue: CORS Error

**Error:**
```
Access to fetch has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present
```

**Fix:**
1. Check Render environment variable: `CLIENT_URL=https://cafes-20-main-nias.vercel.app`
2. No trailing slash
3. Exact match with Vercel URL
4. Redeploy backend

### Issue: WebSocket Connection Failed

**Error:**
```
WebSocket connection to 'wss://cafes-20-main.onrender.com/socket.io/' failed
```

**Fix:**
1. Check Socket.IO CORS configuration (already updated)
2. Verify `withCredentials: true` in frontend
3. Check Render logs for Socket.IO errors

### Issue: Double Slash in API URL

**Error:**
```
Request URL: https://cafes-20-main.onrender.com/api//settings
```

**Fix:**
Ensure endpoints start with `/` but `VITE_API_URL` ends with `/api` (no trailing slash):

```typescript
// ✅ CORRECT
const API_BASE_URL = 'https://cafes-20-main.onrender.com/api';
apiService.request('/settings'); // → /api/settings ✅

// ❌ WRONG
const API_BASE_URL = 'https://cafes-20-main.onrender.com/api/';
apiService.request('/settings'); // → /api//settings ❌
```

### Issue: 503 Service Unavailable

**Error:**
```
Status: 503 Service Unavailable
```

**Fix:**
1. Check `VITE_API_URL` is set in Vercel
2. Verify API calls use full URL (not relative paths)
3. Check Render backend is running

---

## 📊 Expected Logs

### Backend (Render) - Startup
```
🔧 Environment Variables Loaded (Sanitized):
   NODE_ENV: production
   PORT: 5000
   CLIENT_URL: https://cafes-20-main-nias.vercel.app
   CLIENT_URL length: 40
   CLIENT_URL (JSON): "https://cafes-20-main-nias.vercel.app"
   ✅ Added CLIENT_URL to allowed origins: https://cafes-20-main-nias.vercel.app
   📋 Final allowed origins: ['https://cafes-20-main-nias.vercel.app']
   📊 Total origins: 1
      [0] "https://cafes-20-main-nias.vercel.app" (length: 40)

╔════════════════════════════════════════════════════════╗
║   🍕 The Himalayan Pizza - Backend API                ║
║   🚀 Server running on port 5000                      ║
║   📊 Environment: production                          ║
║   🌐 Frontend URL: https://cafes-20-main-nias.vercel.app ║
║   📡 Socket.IO enabled                                 ║
║   🔒 CORS configured                                   ║
╚════════════════════════════════════════════════════════╝
```

### Backend (Render) - Request
```
🔍 CORS: Checking origin: "https://cafes-20-main-nias.vercel.app"
   JSON: "https://cafes-20-main-nias.vercel.app"
✅ CORS: Origin allowed: "https://cafes-20-main-nias.vercel.app"

OPTIONS /api/auth/admin/login
   Origin: https://cafes-20-main-nias.vercel.app
   🔍 PREFLIGHT REQUEST

POST /api/auth/admin/login
   Origin: https://cafes-20-main-nias.vercel.app
🔐 Admin login attempt: { email: 'admin@gmail.com' }
✅ Admin login successful
```

### Frontend (Vercel) - Console
```
🔧 API Configuration:
   Base URL: https://cafes-20-main.onrender.com/api
   Mode: production

🔌 Socket.IO Configuration:
   URL: https://cafes-20-main.onrender.com
   Mode: production

✅ Connected to server
```

---

## 🎯 Vercel Preview URLs

Vercel generates preview URLs for each deployment:
```
https://cafes-20-main-abc123-nias.vercel.app
https://cafes-20-main-def456-nias.vercel.app
```

The backend automatically allows these with pattern matching:
```typescript
// Pattern: https://cafes-20-main-*-nias.vercel.app
const vercelPreviewPattern = /^https:\/\/cafes-20-main-[a-z0-9]+-nias\.vercel\.app$/i;
```

**No environment variable updates needed for preview URLs!**

---

## 🔐 Security Best Practices

### ✅ What We Do
- Specific origin validation (no wildcard `*`)
- Pattern matching for preview URLs
- Credentials support (`credentials: true`)
- Preflight OPTIONS handling
- Security headers (helmet)
- Environment-based configuration

### ❌ What We Don't Do
- No wildcard `*` origin
- No `Access-Control-Allow-Origin: *` with credentials
- No hardcoded URLs in code
- No insecure CORS configuration

---

## 📝 Quick Commands

### Check Render Logs
```bash
# Via Render Dashboard
Render Dashboard → cafes-20-main → Logs

# Look for:
CLIENT_URL: https://cafes-20-main-nias.vercel.app
✅ CORS: Origin allowed
```

### Check Vercel Logs
```bash
# Via Vercel Dashboard
Vercel Dashboard → Your Project → Deployments → [Latest] → Logs

# Or via CLI
vercel logs
```

### Test CORS
```bash
curl -X OPTIONS https://cafes-20-main.onrender.com/api/auth/admin/login \
  -H "Origin: https://cafes-20-main-nias.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

Expected:
```
< HTTP/2 204
< access-control-allow-origin: https://cafes-20-main-nias.vercel.app
< access-control-allow-credentials: true
```

---

## ✅ Deployment Checklist

### Backend (Render)
- [ ] `CLIENT_URL` updated to Vercel URL
- [ ] No trailing slash in `CLIENT_URL`
- [ ] Backend redeployed
- [ ] Logs show correct `CLIENT_URL`
- [ ] CORS allows Vercel origin

### Frontend (Vercel)
- [ ] `VITE_API_URL` set in environment variables
- [ ] Value: `https://cafes-20-main.onrender.com/api`
- [ ] Build settings correct
- [ ] Frontend redeployed
- [ ] Console shows correct API URL

### Testing
- [ ] Home page loads
- [ ] Login works (no CORS errors)
- [ ] API calls succeed (200 status)
- [ ] WebSocket connects
- [ ] No 503 errors
- [ ] Preview URLs work

---

## 🚀 Deploy Now

### 1. Update Render
```
Render Dashboard → cafes-20-main → Environment
CLIENT_URL = https://cafes-20-main-nias.vercel.app
Save (auto-redeploys)
```

### 2. Update Vercel
```
Vercel Dashboard → Settings → Environment Variables
VITE_API_URL = https://cafes-20-main.onrender.com/api
Save and redeploy
```

### 3. Test
```
Open: https://cafes-20-main-nias.vercel.app
Login: Should work without CORS errors ✅
```

---

**Status: PRODUCTION READY** 🚀

Your Vercel + Render deployment is configured!
