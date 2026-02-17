# 🚀 Complete Netlify Deployment Guide

## The Himalayan Cafes - Frontend Deployment

This guide covers the complete deployment of your React + Vite frontend to Netlify.

---

## ✅ Pre-Deployment Checklist

### Files Configured
- [x] `netlify.toml` - Build and deployment configuration
- [x] `public/_redirects` - SPA routing rules
- [x] `.env.production` - Production environment variables
- [x] `vercel.json` - REMOVED (Netlify only)

### Backend Configuration
- [x] Render backend supports Netlify preview URLs
- [x] CORS configured for: `https://cafee2015.netlify.app`
- [x] CORS supports preview URLs: `https://*--cafee2015.netlify.app`

---

## 📋 Netlify Configuration

### 1. netlify.toml
**Location:** `client/netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**What it does:**
- Builds with `npm run build`
- Publishes from `dist/` folder
- Uses Node.js 18
- Redirects all routes to `index.html` (SPA routing)
- Adds security headers
- Configures asset caching

### 2. _redirects
**Location:** `client/public/_redirects`

```
/*  /index.html  200
```

**What it does:**
- Serves `index.html` for all routes
- Lets React Router handle routing client-side
- Status 200 = rewrite (URL stays same)

### 3. Environment Variables
**Location:** Set in Netlify Dashboard

```
VITE_API_URL=https://cafes-20-main-6.onrender.com/api
```

---

## 🚀 Deployment Steps

### Step 1: Connect to Netlify

#### Option A: Deploy from GitHub (Recommended)

1. Go to: https://app.netlify.com
2. Click: "Add new site" → "Import an existing project"
3. Choose: GitHub
4. Authorize Netlify to access your repository
5. Select repository: `Cafes-20-main`
6. Configure build settings:

```
Base directory:       client
Build command:        npm run build
Publish directory:    client/dist
```

7. Click: "Deploy site"

#### Option B: Deploy from CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from client folder
cd client
netlify deploy --prod
```

### Step 2: Configure Environment Variables

1. Go to: Site settings → Environment variables
2. Click: "Add a variable"
3. Add:
   ```
   Key:   VITE_API_URL
   Value: https://cafes-20-main-6.onrender.com/api
   ```
4. Click: "Save"

### Step 3: Configure Build Settings (Verify)

Go to: Site settings → Build & deploy → Build settings

Ensure:
```
Base directory:       client
Build command:        npm run build
Publish directory:    client/dist
```

If wrong, click "Edit settings" and update.

### Step 4: Set Custom Domain (Optional)

1. Go to: Site settings → Domain management
2. Click: "Add custom domain"
3. Enter: `cafee2015.netlify.app` (or your custom domain)
4. Follow DNS configuration steps

### Step 5: Trigger Deploy

If auto-deploy is enabled:
```bash
git add .
git commit -m "Configure Netlify deployment"
git push origin main
```

Or manually:
1. Go to: Deploys
2. Click: "Trigger deploy" → "Deploy site"

---

## 🔍 Verification

### Test 1: Build Success
Check deploy logs for:
```
✓ Build succeeded
✓ Site is live
```

### Test 2: Environment Variables
```bash
# Check if VITE_API_URL is set
curl https://your-site.netlify.app/_redirects
```

### Test 3: SPA Routing
Open these URLs directly:
```
✅ https://cafee2015.netlify.app/
✅ https://cafee2015.netlify.app/login
✅ https://cafee2015.netlify.app/admin/login
✅ https://cafee2015.netlify.app/menu
```

All should load (no 404).

### Test 4: API Connection
1. Open: https://cafee2015.netlify.app/admin/login
2. Open DevTools → Network tab
3. Login with admin credentials
4. Check:
   - OPTIONS request to backend → 204
   - POST request to backend → 200
   - No CORS errors

### Test 5: Page Refresh
1. Navigate to: /login
2. Press F5 (refresh)
3. Should stay on /login (not 404)

---

## 🔧 Troubleshooting

### Issue: Build Fails

#### Check 1: Base Directory
```
Error: Cannot find package.json

Fix:
Site settings → Build & deploy → Build settings
Base directory: client
```

#### Check 2: Node Version
```
Error: Node version mismatch

Fix:
netlify.toml should have:
[build.environment]
  NODE_VERSION = "18"
```

#### Check 3: Dependencies
```
Error: Module not found

Fix:
Ensure package.json has all dependencies
Run locally: npm install && npm run build
```

### Issue: 404 on Routes

#### Check 1: _redirects File
```bash
# Check if _redirects is in dist
cd client
npm run build
ls dist/_redirects  # Should exist
```

#### Check 2: Publish Directory
```
Site settings → Build & deploy
Publish directory: client/dist (not just "dist")
```

#### Check 3: Clear Cache
```
Deploys → Trigger deploy → Clear cache and deploy site
```

### Issue: CORS Errors

#### Check 1: Environment Variable
```
Site settings → Environment variables
VITE_API_URL should be set
```

#### Check 2: Backend CORS
```
Render logs should show:
✅ Netlify preview URL matched: https://...--cafee2015.netlify.app
```

#### Check 3: Frontend API Calls
```typescript
// Should use VITE_API_URL
const API_BASE_URL = import.meta.env.VITE_API_URL;
```

### Issue: Environment Variables Not Working

#### Check 1: Prefix
```
❌ API_URL=...           (wrong)
✅ VITE_API_URL=...      (correct)
```

Vite requires `VITE_` prefix!

#### Check 2: Rebuild
```
After adding env vars, trigger new deploy:
Deploys → Trigger deploy → Deploy site
```

#### Check 3: Check in Build Logs
```
Build logs should show:
VITE_API_URL: https://cafes-20-main-6.onrender.com/api
```

---

## 📊 Build Configuration Summary

### Local Development
```bash
cd client
npm install
npm run dev
# Uses .env.development
# VITE_API_URL=http://localhost:5000/api
```

### Production Build
```bash
cd client
npm install
npm run build
# Uses .env.production or Netlify env vars
# VITE_API_URL=https://cafes-20-main-6.onrender.com/api
```

### Netlify Build
```bash
# Netlify runs:
cd client
npm install
npm run build
# Uses Netlify environment variables
```

---

## 🎯 Environment Variables

### Development (.env.development)
```env
VITE_API_URL=http://localhost:5000/api
```

### Production (.env.production)
```env
VITE_API_URL=https://cafes-20-main-6.onrender.com/api
```

### Netlify Dashboard
```
VITE_API_URL=https://cafes-20-main-6.onrender.com/api
```

**Priority:**
```
Netlify Dashboard > .env.production > .env
```

---

## 🔄 Deployment Workflow

### Development
```
1. Developer works locally
2. Uses: http://localhost:5173
3. API: http://localhost:5000/api
```

### Preview Deploy (Branch)
```
1. Push to feature branch
2. Netlify creates: https://abc123--cafee2015.netlify.app
3. API: https://cafes-20-main-6.onrender.com/api
4. CORS: Allowed (preview URL pattern)
```

### Production Deploy (Main)
```
1. Merge to main branch
2. Netlify deploys: https://cafee2015.netlify.app
3. API: https://cafes-20-main-6.onrender.com/api
4. CORS: Allowed (main domain)
```

---

## 📁 File Structure

```
client/
├── public/
│   ├── _redirects          ✅ SPA routing
│   ├── favicon.ico
│   └── ...
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   └── ...
├── .env                    ✅ Local default
├── .env.development        ✅ Dev environment
├── .env.production         ✅ Prod environment
├── netlify.toml            ✅ Netlify config
├── package.json
├── vite.config.ts
└── ...
```

---

## ✅ Production Checklist

### Pre-Deploy
- [ ] `netlify.toml` configured
- [ ] `public/_redirects` exists
- [ ] `.env.production` has correct API URL
- [ ] `vercel.json` removed
- [ ] Local build succeeds: `npm run build`
- [ ] `dist/_redirects` exists after build

### Netlify Setup
- [ ] Repository connected
- [ ] Base directory: `client`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `client/dist`
- [ ] Environment variable set: `VITE_API_URL`
- [ ] Node version: 18

### Post-Deploy
- [ ] Build succeeds
- [ ] Site is live
- [ ] Home page loads
- [ ] Direct URL access works: `/login`
- [ ] Page refresh works
- [ ] Admin login works
- [ ] No CORS errors
- [ ] API calls succeed
- [ ] Socket.IO connects

---

## 🎉 Success Indicators

### Build Logs
```
✓ Build succeeded
✓ Site is live
✓ Deploy time: ~2 minutes
```

### Site Access
```
✅ https://cafee2015.netlify.app/
✅ https://cafee2015.netlify.app/login
✅ https://cafee2015.netlify.app/admin/login
```

### Network Tab
```
✅ OPTIONS /api/auth/admin/login → 204
✅ POST /api/auth/admin/login → 200
✅ Response has token
✅ No CORS errors
```

### Render Logs
```
✅ CORS: Checking origin: "https://cafee2015.netlify.app"
✅ CORS: Origin allowed
```

---

## 📚 Additional Resources

- [Netlify Docs](https://docs.netlify.com/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [React Router Deployment](https://reactrouter.com/en/main/guides/deployment)
- [Netlify SPA Redirects](https://docs.netlify.com/routing/redirects/rewrites-proxies/#history-pushstate-and-single-page-apps)

---

## 🆘 Support

### Netlify Support
- Dashboard: https://app.netlify.com
- Docs: https://docs.netlify.com
- Community: https://answers.netlify.com

### Check Logs
```
Netlify Dashboard → Deploys → [Latest Deploy] → Deploy log
Render Dashboard → cafes-20-main-6 → Logs
```

---

**Status: PRODUCTION READY** 🚀

Your frontend is configured for Netlify deployment!
