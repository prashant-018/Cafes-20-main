# ⚡ Quick Fix - Vite Build Error

## ❌ Error
```
Could not resolve entry module 'index.html'
```

## ✅ Solution

I've already fixed it! Here's what changed:

### Before (Broken):
```
Cafes-20-main/
├── index.html          ← Wrong location!
└── client/
    ├── vite.config.ts
    └── main.tsx
```

### After (Fixed):
```
Cafes-20-main/
└── client/
    ├── index.html      ← Moved here! ✅
    ├── vite.config.ts
    └── main.tsx
```

### Script Path Changed:
```html
<!-- Before (Wrong) -->
<script type="module" src="/client/main.tsx"></script>

<!-- After (Correct) -->
<script type="module" src="/main.tsx"></script>
```

---

## 🧪 Test It Now

```cmd
cd Cafes-20-main\client
npm run build
```

Should work! ✅

---

## 🚀 Deploy to Netlify

Your Netlify config is already correct. Just push:

```cmd
cd Cafes-20-main
git add .
git commit -m "Fix: Move index.html to client folder"
git push
```

Netlify will auto-deploy successfully!

---

## 📝 Remember

**Golden Rule:** `index.html` must be in the same folder as `vite.config.ts`

That's it! Your build should work now.
