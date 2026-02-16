# ⚡ Netlify Quick Fix - Deploy Frontend Only

## 🎯 The Problem
Error: "Base directory '/opt/build' does not exist"

## ✅ The Solution

### Netlify Dashboard Settings

Go to: **Site Settings → Build & Deploy → Build Settings**

Set these values:

```
Base directory:        client
Build command:         npm install && npm run build
Publish directory:     client/dist
```

### Environment Variables

Go to: **Site Settings → Environment Variables**

Add:
```
VITE_API_URL = https://your-backend-api.com
```

---

## 📝 Files Already Fixed

I've updated these files for you:

1. ✅ `netlify.toml` - Correct paths and configuration
2. ✅ `client/vite.config.ts` - Builds to `dist` folder
3. ✅ `client/package.json` - All dependencies included

---

## 🚀 Deploy Now

### Option 1: Push to Git (Auto-Deploy)

```cmd
cd Cafes-20-main
git add .
git commit -m "Fix Netlify configuration"
git push
```

Netlify will automatically detect the push and redeploy.

### Option 2: Manual Deploy via Dashboard

1. Go to Netlify Dashboard
2. Click "Deploys" tab
3. Click "Trigger deploy" → "Deploy site"

---

## 🧪 Test Locally First

Before deploying, test the build:

```cmd
cd Cafes-20-main\client
npm install
npm run build
```

If this succeeds, Netlify will work!

---

## 📋 Configuration Summary

Your `netlify.toml` now has:

```toml
[build]
  base = "client"                    # ← Relative to repo root
  command = "npm install && npm run build"
  publish = "dist"                   # ← Relative to base directory

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200                       # ← Fixes React Router 404s
```

---

## ✅ Checklist

Before deploying, verify:

- [x] `netlify.toml` at repository root
- [x] `client/vite.config.ts` exists
- [x] `client/package.json` exists
- [ ] Environment variables set in Netlify dashboard
- [ ] Backend CORS allows your Netlify domain
- [ ] API URLs point to production backend

---

## 🎉 Expected Result

After deployment:
- ✅ Build completes successfully
- ✅ Site loads at `https://your-site.netlify.app`
- ✅ Page refresh works (no 404)
- ✅ React Router navigation works

---

## 🐛 Still Not Working?

Check Netlify build logs for:
1. Node version errors → Set `NODE_VERSION = "18"` in dashboard
2. Missing dependencies → Check `package.json`
3. Build path errors → Verify `base = "client"` and `publish = "dist"`

The logs will show the exact error!
