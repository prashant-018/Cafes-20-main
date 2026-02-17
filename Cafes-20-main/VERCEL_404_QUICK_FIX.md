# ⚡ Vercel 404 Error - Quick Fix

## Problem
```
404: NOT_FOUND
Code: NOT_FOUND
ID: bom1::xxxxx
```

When refreshing or directly opening routes like `/login` or `/admin/dashboard`.

---

## ✅ Solution (1 File)

### Create `client/vercel.json`

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**That's it!**

---

## 🚀 Deploy

```bash
cd client
git add vercel.json
git commit -m "Fix Vercel SPA routing"
git push origin main
```

Vercel auto-deploys in 1-2 minutes.

---

## ✅ Test

Open these URLs directly:
```
✅ https://cafes-20-main-nias.vercel.app/login
✅ https://cafes-20-main-nias.vercel.app/admin/dashboard
✅ https://cafes-20-main-nias.vercel.app/menu
```

All should load (no 404).

---

## 🔍 Why This Works

### Before (404 Error)
```
Browser requests: /login
Vercel looks for: /login/index.html
File not found: 404 ❌
```

### After (Success)
```
Browser requests: /login
Vercel rewrites to: /index.html
React loads: Sees /login in URL
React Router: Renders Login component ✅
```

---

## 🔧 Troubleshooting

### Still Getting 404?

**Check 1: File Location**
```bash
ls client/vercel.json  # Should exist
```

**Check 2: JSON Syntax**
```bash
cat client/vercel.json | jq .  # Should parse
```

**Check 3: Vercel Settings**
```
Dashboard → Settings → General
Root Directory: client
Output Directory: dist
```

**Check 4: Clear Cache**
```
Dashboard → Deployments → Redeploy
→ Clear cache and redeploy
```

---

## 📊 Complete vercel.json (Optional)

If you want more control:

```json
{
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

But the minimal version works fine!

---

## ✅ Success Indicators

- [ ] `vercel.json` exists in `client/` folder
- [ ] Committed and pushed to git
- [ ] Vercel deployed successfully
- [ ] Direct URL access works
- [ ] Page refresh works
- [ ] No 404 errors

---

**Deploy and test!** 🚀

See `VERCEL_SPA_ROUTING_FIX.md` for complete guide.
