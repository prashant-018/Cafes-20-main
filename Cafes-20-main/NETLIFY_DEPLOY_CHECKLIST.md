# ✅ Netlify Deployment Checklist

## Quick Reference for Deploying to Netlify

---

## 📋 Pre-Deployment

### Files Ready
- [x] `client/netlify.toml` - Build configuration
- [x] `client/public/_redirects` - SPA routing
- [x] `client/.env.production` - Production env vars
- [x] `client/vercel.json` - REMOVED ✅

### Local Test
```bash
cd client
npm install
npm run build
ls dist/_redirects  # Should exist
```

---

## 🚀 Netlify Setup

### 1. Connect Repository
```
1. Go to: https://app.netlify.com
2. Click: "Add new site" → "Import an existing project"
3. Choose: GitHub
4. Select: Your repository
```

### 2. Build Settings
```
Base directory:       client
Build command:        npm run build
Publish directory:    client/dist
```

### 3. Environment Variables
```
Go to: Site settings → Environment variables
Add:
  Key:   VITE_API_URL
  Value: https://cafes-20-main-6.onrender.com/api
```

### 4. Deploy
```
Click: "Deploy site"
Wait: ~2-3 minutes
```

---

## ✅ Verification

### Test URLs
```
✅ https://cafee2015.netlify.app/
✅ https://cafee2015.netlify.app/login
✅ https://cafee2015.netlify.app/admin/login
```

### Test Login
```
1. Go to: /admin/login
2. Login with admin credentials
3. Check Network tab:
   ✅ OPTIONS → 204
   ✅ POST → 200
   ✅ No CORS errors
```

### Test Refresh
```
1. Navigate to: /login
2. Press F5
3. Should stay on /login (not 404)
```

---

## 🔧 Common Issues

### Build Fails
```
Check: Base directory = "client"
Check: Node version = 18
Check: npm install works locally
```

### 404 on Routes
```
Check: dist/_redirects exists
Check: Publish directory = "client/dist"
Clear cache and redeploy
```

### CORS Errors
```
Check: VITE_API_URL is set
Check: Backend CORS allows Netlify domain
Check: Render logs show origin allowed
```

### Env Vars Not Working
```
Check: Prefix is VITE_ (not just API_URL)
Redeploy after adding env vars
Check build logs for VITE_API_URL
```

---

## 📊 Expected Results

### Build Logs
```
✓ Build succeeded
✓ Site is live
✓ Deploy time: ~2 minutes
```

### Network Tab
```
✅ OPTIONS /api/auth/admin/login → 204
✅ POST /api/auth/admin/login → 200
✅ access-control-allow-origin: https://cafee2015.netlify.app
✅ access-control-allow-credentials: true
```

### Render Logs
```
✅ CORS: Checking origin: "https://cafee2015.netlify.app"
✅ CORS: Origin allowed
```

---

## 🎯 Quick Commands

### Local Build Test
```bash
cd client
npm run build
ls dist/_redirects
```

### Deploy via CLI
```bash
npm install -g netlify-cli
netlify login
cd client
netlify deploy --prod
```

### Check Deployed _redirects
```bash
curl https://cafee2015.netlify.app/_redirects
```

---

## 📝 Configuration Summary

### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### _redirects
```
/*  /index.html  200
```

### Environment Variables
```
VITE_API_URL=https://cafes-20-main-6.onrender.com/api
```

---

## ✅ Final Checklist

- [ ] Repository connected to Netlify
- [ ] Base directory: `client`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `client/dist`
- [ ] Environment variable: `VITE_API_URL` set
- [ ] Build succeeds
- [ ] Site is live
- [ ] All routes work (no 404)
- [ ] Login works (no CORS errors)
- [ ] Page refresh works

---

**Ready to deploy!** 🚀

See `NETLIFY_COMPLETE_DEPLOYMENT.md` for detailed guide.
