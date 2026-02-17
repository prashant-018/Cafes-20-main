# 🔧 Fix 503 Error - Quick Guide

## Problem
After login, getting 503 errors on API calls.

## Root Cause
API calls using relative paths like `/api/settings` instead of full URLs.

---

## ✅ Quick Fix

### 1. Verify Environment Variable

Check `.env.production`:
```env
VITE_API_URL=https://cafes-20-main-6.onrender.com/api
```

### 2. Verify API Service

Check `services/api.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://cafes-20-main-6.onrender.com/api';
```

### 3. Check All API Calls

**❌ Wrong:**
```typescript
fetch("/api/settings")
```

**✅ Correct:**
```typescript
apiService.request("/settings")
```

### 4. Rebuild and Redeploy

```bash
cd client
npm run build
git add .
git commit -m "Fix API base URL configuration"
git push origin main
```

---

## 🔍 Verify Fix

### Check Network Tab

Open DevTools → Network tab:

**Before (503 Error):**
```
Request URL: https://cafee2015.netlify.app/api/settings
Status: 503 Service Unavailable
```

**After (Success):**
```
Request URL: https://cafes-20-main-6.onrender.com/api/settings
Status: 200 OK
```

---

## 🎯 Your Current Setup

### ✅ Already Configured

Your project already has:
- ✅ `.env.production` with correct URL
- ✅ `services/api.ts` using `VITE_API_URL`
- ✅ `services/socket.ts` using `VITE_API_URL`
- ✅ All hooks using `apiService`

### 🔍 What to Check

1. **Netlify Environment Variable**
   ```
   Go to: Site settings → Environment variables
   Check: VITE_API_URL is set (optional, .env.production is enough)
   ```

2. **Build Logs**
   ```
   Check Netlify build logs for:
   VITE_API_URL: https://cafes-20-main-6.onrender.com/api
   ```

3. **Browser Console**
   ```javascript
   // Run in browser console
   console.log(import.meta.env.VITE_API_URL);
   // Should show: https://cafes-20-main-6.onrender.com/api
   ```

---

## 🚀 Deploy

```bash
cd client
git add .
git commit -m "Verify API configuration"
git push origin main
```

Netlify will auto-deploy in 2-3 minutes.

---

## ✅ Success Indicators

- [ ] Network tab shows Render URLs (not Netlify URLs)
- [ ] Status codes are 200 (not 503)
- [ ] Login works
- [ ] Settings load
- [ ] No CORS errors

---

**Your configuration is already correct!**

Just redeploy to Netlify and the 503 errors should be gone.
