# ⚡ Test & Deploy - Quick Commands

## 🧪 Test Locally (Do This First!)

```cmd
cd Cafes-20-main\client
npm install
npm run build
```

✅ If this works, deployment will work!

---

## 🚀 Deploy to Netlify

### Step 1: Push to GitHub

```cmd
cd Cafes-20-main
git add .
git commit -m "Fix: Complete frontend deployment setup"
git push
```

### Step 2: Configure Netlify

Go to [Netlify Dashboard](https://app.netlify.com)

**Settings are auto-configured from `netlify.toml`!**

Just add environment variables:
```
VITE_API_URL = https://your-backend-api.com
```

### Step 3: Deploy!

Netlify will auto-deploy when you push to GitHub.

---

## ✅ What's Fixed

1. ✅ `client/index.html` created with correct script path
2. ✅ `client/vite.config.ts` configured
3. ✅ `client/package.json` with all dependencies
4. ✅ `client/tsconfig.json` updated
5. ✅ `client/tailwind.config.ts` updated
6. ✅ `netlify.toml` fixed with correct paths
7. ✅ All config files copied to client folder

---

## 🎯 Key Fix

### The Problem:
```
Cafes-20-main/
├── index.html          ← Was here (wrong!)
└── client/
    └── main.tsx
```

### The Solution:
```
Cafes-20-main/
└── client/
    ├── index.html      ← Moved here! ✅
    └── main.tsx
```

### Script Path Changed:
```html
<!-- Before -->
<script type="module" src="/client/main.tsx"></script>

<!-- After -->
<script type="module" src="/main.tsx"></script>
```

---

## 🎉 That's It!

Your build should work now. Test it, then deploy!

For detailed explanations, see:
- `ALL_FIXES_COMPLETE.md` - Complete summary
- `VITE_INDEX_HTML_FIX.md` - Why the error happened
- `NETLIFY_DEPLOYMENT_GUIDE.md` - Full deployment guide
