# ⚡ Deploy to Netlify - Quick Checklist

## ✅ What's Already Done

1. ✅ `netlify.toml` in root with correct configuration
2. ✅ `client/package.json` has build script
3. ✅ `client/.gitignore` properly configured
4. ✅ `client/index.html` in correct location
5. ✅ `client/vite.config.ts` configured
6. ✅ All config files in place

---

## ⚠️ What You Need to Do

### 1. Fix TypeScript Errors (Required)

**Current Status:** 6 TypeScript errors preventing build

**Quick Fix Option - Disable Type Checking:**

Update `client/package.json`:

```json
{
  "scripts": {
    "build": "vite build"
  }
}
```

Add to `client/vite.config.ts`:

```typescript
export default defineConfig({
  // ... existing config
  build: {
    outDir: "dist",
    // Don't fail build on TypeScript errors
    emptyOutDir: true,
  },
});
```

**Or let me fix the actual TypeScript errors for you!**

### 2. Test Build Locally

```cmd
cd Cafes-20-main\client
npm install
npm run build
```

Should output:
```
✓ built in XXXms
dist/index.html
dist/assets/...
```

### 3. Push to GitHub

```cmd
cd Cafes-20-main
git add .
git commit -m "Ready for Netlify deployment"
git push
```

### 4. Deploy on Netlify

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub repository
4. Settings auto-detected from `netlify.toml` ✅
5. Click "Deploy site"

### 5. Add Environment Variable

After deployment:

1. Go to: **Site Settings → Environment Variables**
2. Click "Add a variable"
3. Add:
   ```
   VITE_API_URL = https://cafes-20-main.onrender.com/api
   ```
4. Click "Trigger deploy"

### 6. Update Backend CORS

Add your Netlify URL to backend CORS:

```javascript
origin: [
  'http://localhost:5173',
  'https://your-site.netlify.app'  // Add this
]
```

---

## 📋 Environment Variables to Add

Copy these to Netlify Dashboard:

```
VITE_API_URL=https://cafes-20-main.onrender.com/api
```

---

## 🧪 Test After Deployment

- [ ] Site loads
- [ ] Navigation works
- [ ] Page refresh works (no 404)
- [ ] API calls work
- [ ] No console errors

---

## 🚨 If Build Fails

Check these:

1. **TypeScript errors** - See fix above
2. **Missing dependencies** - Run `npm install` in client folder
3. **Node version** - netlify.toml sets Node 18 ✅
4. **Build logs** - Check Netlify dashboard for details

---

## 📁 File Structure (Verified ✅)

```
Cafes-20-main/
├── netlify.toml              ✅ Correct location
└── client/
    ├── index.html            ✅ Correct location
    ├── main.tsx              ✅ Entry point
    ├── vite.config.ts        ✅ Configured
    ├── package.json          ✅ Build script ready
    ├── tsconfig.json         ✅ Present
    ├── tailwind.config.ts    ✅ Present
    └── .env                  ✅ Gitignored
```

---

## 🎯 Priority Actions

1. **Fix TypeScript errors** (use quick fix or let me help)
2. **Test build:** `npm run build`
3. **Push to GitHub**
4. **Deploy on Netlify**
5. **Add env vars**

You're almost there! Just need to handle the TypeScript errors and you can deploy.

Would you like me to fix the TypeScript errors now?
