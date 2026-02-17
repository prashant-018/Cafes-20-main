# 🔧 Vercel SPA Routing Fix - Complete Guide

## Problem: 404 NOT_FOUND on Direct URL Access

When you refresh or directly open routes like `/login` or `/admin/dashboard`, Vercel shows:
```
404: NOT_FOUND
Code: NOT_FOUND
ID: bom1::xxxxx
```

But navigating inside the app works fine.

---

## 🤔 Why This Happens

### How SPAs Work

**Single Page Application (SPA):**
1. Vercel serves `index.html` for the root `/`
2. React loads and takes over routing
3. React Router handles navigation client-side
4. URL changes but no server requests

**The Problem:**
When you directly visit `/login`:
1. Browser requests `/login` from Vercel
2. Vercel looks for a file at `/login/index.html`
3. File doesn't exist → **404 Error**
4. React never loads → React Router never runs

### What Should Happen

Vercel should:
1. Receive request for `/login`
2. Serve `index.html` (rewrite, not redirect)
3. React loads and sees `/login` in URL
4. React Router renders the Login component

---

## ✅ Solution: vercel.json Configuration

### 1. Create vercel.json

**Location:** `client/vercel.json`

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. File Structure

```
client/
├── public/
├── src/
├── dist/                  ← Build output (Vite)
├── vercel.json            ← Place here!
├── package.json
├── vite.config.ts
└── ...
```

### 3. What Each Field Does

#### `buildCommand`
```json
"buildCommand": "npm run build"
```
- Command Vercel runs to build your app
- Runs `vite build` (defined in package.json)

#### `outputDirectory`
```json
"outputDirectory": "dist"
```
- Where Vercel looks for built files
- Vite outputs to `dist/` by default
- Must match `vite.config.ts` → `build.outDir`

#### `framework`
```json
"framework": "vite"
```
- Tells Vercel you're using Vite
- Enables Vite-specific optimizations
- Auto-detects if not specified

#### `rewrites`
```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```
- **Most Important Part!**
- `source`: Matches all routes `/(.*)`
- `destination`: Serves `/index.html`
- This is a **rewrite** (URL stays same), not a redirect

---

## 🚀 Deployment Steps

### Step 1: Create vercel.json

```bash
cd client
# File already created above
```

### Step 2: Commit and Push

```bash
git add vercel.json
git commit -m "Fix Vercel SPA routing with vercel.json"
git push origin main
```

### Step 3: Vercel Auto-Deploys

Vercel will:
1. Detect the push
2. Read `vercel.json`
3. Build with `npm run build`
4. Deploy from `dist/`
5. Apply rewrites

Wait 1-2 minutes for deployment.

### Step 4: Verify

Test these URLs directly:
```
✅ https://cafes-20-main-nias.vercel.app/
✅ https://cafes-20-main-nias.vercel.app/login
✅ https://cafes-20-main-nias.vercel.app/admin/dashboard
✅ https://cafes-20-main-nias.vercel.app/menu
```

All should load (no 404).

---

## 🔍 Verification

### Test 1: Direct URL Access

Open in **incognito mode** (to avoid cache):
```
https://cafes-20-main-nias.vercel.app/login
```

**Before Fix:**
```
404: NOT_FOUND
Code: NOT_FOUND
```

**After Fix:**
```
✅ Login page loads
✅ React Router handles the route
```

### Test 2: Page Refresh

1. Navigate to `/login` inside the app
2. Press `F5` (refresh)
3. Should stay on `/login` (not 404)

### Test 3: Browser Back/Forward

1. Navigate: Home → Login → Dashboard
2. Click browser back button
3. Should navigate correctly (not 404)

### Test 4: Bookmarks

1. Bookmark `/admin/dashboard`
2. Close browser
3. Open bookmark
4. Should load dashboard (not 404)

### Test 5: Check Network Tab

Open DevTools → Network tab:

**Request:**
```
Request URL: https://cafes-20-main-nias.vercel.app/login
Request Method: GET
```

**Response:**
```
Status: 200 OK
Content-Type: text/html
Content: index.html (with React app)
```

**URL Bar:**
```
https://cafes-20-main-nias.vercel.app/login
```
(URL stays `/login`, not redirected to `/`)

---

## 🔧 Troubleshooting

### Issue: Still Getting 404

#### Check 1: vercel.json Location
```bash
# Should be in client folder
ls client/vercel.json  # Should exist
```

#### Check 2: vercel.json Syntax
```bash
# Validate JSON
cat client/vercel.json | jq .
# Should parse without errors
```

#### Check 3: Vercel Build Settings

Go to: Vercel Dashboard → Settings → General

Ensure:
```
Root Directory: client (if in subdirectory)
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

#### Check 4: Clear Vercel Cache

```
Vercel Dashboard → Deployments → [Latest] → ...
→ Redeploy → Clear cache and redeploy
```

#### Check 5: Check Deployment Logs

```
Vercel Dashboard → Deployments → [Latest] → Building
```

Look for:
```
✓ Detected vercel.json
✓ Build Command: npm run build
✓ Output Directory: dist
```

### Issue: Redirect Loop

If you see infinite redirects:

**Cause:** Using `redirects` instead of `rewrites`

**Fix:** Use `rewrites` (not `redirects`):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Issue: API Calls Return HTML

If API calls return HTML instead of JSON:

**Cause:** Rewrite is catching API calls

**Fix:** Exclude API routes:
```json
{
  "rewrites": [
    {
      "source": "/((?!api).*)",
      "destination": "/index.html"
    }
  ]
}
```

But this shouldn't be needed if your API is on a different domain (Render).

---

## 📊 Rewrites vs Redirects

### Rewrites (What We Use) ✅
```json
"rewrites": [
  { "source": "/(.*)", "destination": "/index.html" }
]
```

**Behavior:**
- URL stays: `/login`
- Serves: `index.html`
- Status: 200
- React Router sees: `/login`

### Redirects (Don't Use) ❌
```json
"redirects": [
  { "source": "/(.*)", "destination": "/index.html" }
]
```

**Behavior:**
- URL changes: `/` (redirected)
- Serves: `index.html`
- Status: 301/302
- React Router sees: `/` (not `/login`)

---

## 🎯 Complete vercel.json Options

### Minimal (Recommended)
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### With Build Settings
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### With Headers (Security)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### With Environment Variables
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_API_URL": "https://cafes-20-main.onrender.com/api"
  },
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Note:** Environment variables in `vercel.json` are for build-time only. For runtime, use Vercel Dashboard.

---

## 🔄 Alternative: Vercel Dashboard Configuration

If you don't want to use `vercel.json`, you can configure in the dashboard:

### Go to: Settings → Rewrites

Add:
```
Source: /(.*)
Destination: /index.html
```

But `vercel.json` is recommended because:
- ✅ Version controlled (in git)
- ✅ Consistent across deployments
- ✅ Easier to review and update

---

## 📝 React Router Configuration

Your React Router setup should work as-is. No changes needed.

### Example (Already Working)
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**How it works:**
1. Vercel serves `index.html` for all routes
2. React loads
3. `BrowserRouter` reads URL from browser
4. `Routes` matches URL to component
5. Component renders

---

## ✅ Checklist

### Before Deploy
- [ ] `vercel.json` created in `client/` folder
- [ ] JSON syntax is valid
- [ ] `rewrites` (not `redirects`) configured
- [ ] `outputDirectory` is `dist`
- [ ] Committed to git

### After Deploy
- [ ] Deployment succeeded
- [ ] Direct URL access works: `/login`
- [ ] Page refresh works
- [ ] Browser back/forward works
- [ ] Bookmarks work
- [ ] No 404 errors

---

## 🎉 Success Indicators

### Vercel Deployment Logs
```
✓ Detected vercel.json
✓ Build Command: npm run build
✓ Output Directory: dist
✓ Build completed
✓ Deployment ready
```

### Browser
```
✅ All routes load directly
✅ No 404 errors
✅ React Router works
✅ URL stays correct (no redirects)
```

### Network Tab
```
Request: /login
Status: 200 OK
Content-Type: text/html
Content: index.html
```

---

## 📚 Additional Resources

- [Vercel Rewrites Documentation](https://vercel.com/docs/projects/project-configuration#rewrites)
- [Vercel SPA Configuration](https://vercel.com/guides/deploying-react-with-vercel)
- [React Router Deployment](https://reactrouter.com/en/main/guides/deployment)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)

---

**Status: READY TO DEPLOY** 🚀

Your Vercel SPA routing is now configured!
