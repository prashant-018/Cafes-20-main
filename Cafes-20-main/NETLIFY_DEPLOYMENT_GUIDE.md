# 🚀 Netlify Deployment Guide - Frontend Only

## 🎯 Two Deployment Options

### Option A: Deploy from Root Repository (Current Setup)
Deploy the client folder from your existing monorepo.

### Option B: Deploy from Separated Repository (Recommended)
Deploy from a clean frontend-only repository (see FRONTEND_SEPARATION_GUIDE.md).

---

## 📋 Option A: Deploy from Root (Monorepo)

### Netlify Dashboard Settings

When setting up your site on Netlify:

1. **Base directory:** `client`
2. **Build command:** `npm install && npm run build`
3. **Publish directory:** `client/dist`
4. **Node version:** 18 or higher

### Environment Variables

Add these in Netlify Dashboard → Site Settings → Environment Variables:

```
VITE_API_URL=https://your-backend-api.com
```

### netlify.toml Configuration

Your `netlify.toml` at the root should be:

```toml
[build]
  base = "client"
  command = "npm install && npm run build"
  publish = "client/dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 📋 Option B: Deploy from Separated Repository (Recommended)

### Step 1: Create Vite Config in Client Folder

The client folder needs its own `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  build: {
    outDir: "dist",
  },
});
```

### Step 2: Netlify Dashboard Settings

1. **Base directory:** Leave empty or `.`
2. **Build command:** `npm install && npm run build`
3. **Publish directory:** `dist`
4. **Node version:** 18 or higher

### Step 3: netlify.toml in Client Folder

Create `client/netlify.toml`:

```toml
[build]
  command = "npm install && npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "no-referrer"
```

---

## 🔧 Common Issues & Solutions

### Issue 1: "Base directory does not exist"

**Problem:** Using absolute paths like `/opt/build`

**Solution:** Use relative paths from repository root:
- ✅ Correct: `base = "client"`
- ❌ Wrong: `base = "/opt/build/client"`

### Issue 2: "Build command failed"

**Problem:** Missing dependencies or wrong Node version

**Solution:**
1. Set Node version in netlify.toml: `NODE_VERSION = "18"`
2. Use full install command: `npm install && npm run build`

### Issue 3: "404 on page refresh"

**Problem:** Missing SPA redirect configuration

**Solution:** Add this to netlify.toml:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Issue 4: "Cannot find module '@/...'"

**Problem:** Path aliases not configured

**Solution:** Make sure vite.config.ts has:
```typescript
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./client"),
  },
}
```

### Issue 5: "Environment variables not working"

**Problem:** Variables not prefixed with `VITE_`

**Solution:**
- All frontend env vars must start with `VITE_`
- Set them in Netlify Dashboard
- Example: `VITE_API_URL` not `API_URL`

---

## ✅ Deployment Checklist

Before deploying, verify:

- [ ] `package.json` exists in client folder (or base directory)
- [ ] `vite.config.ts` configured correctly
- [ ] Build outputs to correct directory (`dist`)
- [ ] Environment variables set in Netlify dashboard
- [ ] All env vars prefixed with `VITE_`
- [ ] Backend CORS allows Netlify domain
- [ ] API URLs updated to production backend
- [ ] `netlify.toml` has SPA redirect rule

---

## 🎯 Quick Deploy Commands

### Test Build Locally First

```cmd
cd Cafes-20-main\client
npm install
npm run build
```

If this works, Netlify should work too!

### Deploy via Netlify CLI (Optional)

```cmd
npm install -g netlify-cli
netlify login
cd client
netlify init
netlify deploy --prod
```

---

## 🔄 Continuous Deployment

Once configured, Netlify will automatically:
1. Detect pushes to your main branch
2. Run the build command
3. Deploy the new version
4. Provide a unique URL

---

## 📞 Still Having Issues?

1. Check Netlify build logs for specific errors
2. Verify all paths are relative to repository root
3. Test build locally first: `npm run build`
4. Check Node version matches (18+)
5. Verify environment variables are set

---

## 🎉 Success Indicators

Your deployment is successful when:
- ✅ Build completes without errors
- ✅ Site loads at your Netlify URL
- ✅ Page refresh works (no 404)
- ✅ API calls work (check browser console)
- ✅ All routes work correctly

Your site will be at: `https://your-site-name.netlify.app`
