# ⚡ Vercel CORS - Quick Fix

## Problem
```
❌ Access to fetch has been blocked by CORS policy
❌ WebSocket connection failed
```

## Solution
Update backend to allow Vercel domain.

---

## 🚀 Quick Fix (2 Steps)

### Step 1: Update Render Environment Variable

```
1. Go to: https://dashboard.render.com
2. Select: cafes-20-main
3. Click: Environment
4. Update: CLIENT_URL=https://cafes-20-main-nias.vercel.app
5. Save (auto-redeploys)
```

**IMPORTANT:** No trailing slash!

### Step 2: Update Vercel Environment Variable

```
1. Go to: https://vercel.com/dashboard
2. Select: Your Project
3. Go to: Settings → Environment Variables
4. Add: VITE_API_URL=https://cafes-20-main.onrender.com/api
5. Save and redeploy
```

---

## ✅ Verification

### Check Render Logs
```
CLIENT_URL: https://cafes-20-main-nias.vercel.app
✅ Added CLIENT_URL to allowed origins
✅ CORS: Origin allowed
```

### Check Browser Network Tab
```
✅ access-control-allow-origin: https://cafes-20-main-nias.vercel.app
✅ access-control-allow-credentials: true
✅ Status: 200 OK (not CORS error)
```

### Check WebSocket
```
✅ Connected to server
✅ Socket.IO URL: https://cafes-20-main.onrender.com
```

---

## 🔧 What Was Fixed

### Backend CORS Configuration
```typescript
// ✅ Now supports Vercel
const isOriginAllowed = (origin: string): boolean => {
  // Exact match
  if (allowedOrigins.includes(origin)) return true;
  
  // Vercel preview URLs: https://cafes-20-main-*-nias.vercel.app
  const vercelPreviewPattern = /^https:\/\/cafes-20-main-[a-z0-9]+-nias\.vercel\.app$/i;
  if (vercelPreviewPattern.test(origin)) return true;
  
  // Vercel main domain
  if (origin === 'https://cafes-20-main-nias.vercel.app') return true;
  
  return false;
};
```

### Socket.IO CORS
```typescript
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed'));
      }
    },
    credentials: true,
  }
});
```

---

## 🎯 Supported Origins

### ✅ Allowed
```
http://localhost:5173                              (dev)
https://cafes-20-main-nias.vercel.app              (production)
https://cafes-20-main-abc123-nias.vercel.app       (preview)
https://cafes-20-main-def456-nias.vercel.app       (preview)
```

### ❌ Blocked
```
https://other-site.com                             (not allowed)
https://cafes-20-main-other.vercel.app             (wrong pattern)
```

---

## 🔍 Troubleshooting

### Still Getting CORS Errors?

**Check 1: CLIENT_URL in Render**
```
Should be: https://cafes-20-main-nias.vercel.app
NOT: https://cafes-20-main-nias.vercel.app/
NOT: http://cafes-20-main-nias.vercel.app
```

**Check 2: VITE_API_URL in Vercel**
```
Should be: https://cafes-20-main.onrender.com/api
NOT: https://cafes-20-main.onrender.com/api/
NOT: https://cafes-20-main.onrender.com
```

**Check 3: Redeploy Both**
```
1. Render: Save CLIENT_URL (auto-redeploys)
2. Vercel: Trigger new deployment
3. Clear browser cache
```

---

## 📊 Expected Flow

### Preflight (OPTIONS)
```
Request:
  Method: OPTIONS
  Origin: https://cafes-20-main-nias.vercel.app

Response:
  Status: 204 No Content
  access-control-allow-origin: https://cafes-20-main-nias.vercel.app
  access-control-allow-credentials: true
```

### Actual Request (POST)
```
Request:
  Method: POST
  Origin: https://cafes-20-main-nias.vercel.app
  Body: {"email":"admin@gmail.com","password":"..."}

Response:
  Status: 200 OK
  access-control-allow-origin: https://cafes-20-main-nias.vercel.app
  access-control-allow-credentials: true
  Body: {"success":true,"token":"..."}
```

---

## ✅ Success Indicators

- [ ] No CORS errors in console
- [ ] API calls return 200 status
- [ ] Login works
- [ ] WebSocket connects
- [ ] Render logs show "Origin allowed"

---

**Deploy and test!** 🚀

See `VERCEL_DEPLOYMENT_GUIDE.md` for complete guide.
