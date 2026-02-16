# 🚀 Vercel Deployment Guide (Hindi)

## 📋 Pre-Deployment Checklist

### ✅ Step 1: Lockfile Fix Karo

```bash
# Project folder me jao
cd Cafes-20-main

# Lockfile regenerate karo
pnpm install

# Verify karo (ye command fail nahi honi chahiye)
pnpm install --frozen-lockfile

# Agar success ho gaya, commit karo
git add pnpm-lock.yaml vercel.json .env.production
git commit -m "feat: add Vercel configuration"
git push origin main
```

---

## 🌐 STEP 2: Vercel Account Setup

### Option A: GitHub se Deploy (Recommended)

1. **Vercel Website pe jao**: https://vercel.com/
2. **Sign Up / Login karo** GitHub account se
3. **"Add New Project"** button pe click karo
4. **GitHub repository select karo**: `Cafes-20-main`
5. **Import karo**

### Option B: Vercel CLI se Deploy

```bash
# Vercel CLI install karo (ek baar)
npm install -g vercel

# Login karo
vercel login

# Deploy karo
vercel
```

---

## ⚙️ STEP 3: Vercel Dashboard Configuration

### 3.1 Project Settings

Jab aap repository import karoge, ye settings configure karo:

#### Framework Preset:
```
Vite
```

#### Root Directory:
```
./
```
(Leave empty ya `.` dalo)

#### Build Command:
```
pnpm run build:client
```

#### Output Directory:
```
dist/spa
```

#### Install Command:
```
pnpm install --frozen-lockfile
```

### 3.2 Environment Variables

**Settings → Environment Variables** me jao aur add karo:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://cafes-20-main.onrender.com/api` |
| `NODE_VERSION` | `22` |
| `PNPM_VERSION` | `10.14.0` |

**Important:** 
- Environment: `Production`, `Preview`, `Development` (sabme same value)
- Click "Add" button

---

## 🔧 STEP 4: Advanced Settings (Optional)

### Node.js Version

Settings → General → Node.js Version:
```
22.x
```

### Build & Development Settings

Settings → Build & Development Settings:

```
Framework Preset: Vite
Build Command: pnpm run build:client
Output Directory: dist/spa
Install Command: pnpm install --frozen-lockfile
Development Command: pnpm run dev
```

---

## 🚀 STEP 5: Deploy Karo

### Option A: Dashboard se

1. **"Deploy"** button pe click karo
2. Wait karo (2-3 minutes)
3. Build logs dekho

### Option B: CLI se

```bash
# Production deploy
vercel --prod

# Preview deploy (testing ke liye)
vercel
```

---

## 📊 STEP 6: Build Logs Check Karo

Deployment ke dauran ye logs dikhne chahiye:

```
✓ Installing dependencies
✓ pnpm install --frozen-lockfile
✓ Lockfile is up to date
✓ Dependencies installed in 8.3s
✓ Running build command
✓ pnpm run build:client
✓ vite build
✓ Build complete in 12.5s
✓ Uploading build outputs
✓ Deployment ready
```

### ✅ Success Indicators:

- ✅ No lockfile errors
- ✅ Build completes successfully
- ✅ Deployment URL mil gaya

### ❌ Agar Error Aaye:

**Error: ERR_PNPM_OUTDATED_LOCKFILE**

**Solution:**
```bash
cd Cafes-20-main
rm -rf node_modules pnpm-lock.yaml
pnpm install
git add pnpm-lock.yaml
git commit -m "fix: regenerate lockfile"
git push origin main
```

**Error: vite: not found**

**Solution:**
- Verify `vercel.json` me `buildCommand` correct hai
- Verify `pnpm-lock.yaml` committed hai

---

## 🔗 STEP 7: Domain Setup (Optional)

### Custom Domain Add Karo:

1. **Settings → Domains** me jao
2. **Add Domain** button pe click karo
3. Apna domain enter karo (e.g., `himalayan-pizza.com`)
4. DNS records configure karo (Vercel instructions follow karo)

### Default Vercel Domain:

Aapko automatically mil jayega:
```
https://cafes-20-main.vercel.app
```

---

## 🧪 STEP 8: Testing

### Frontend Test Karo:

```
https://your-app.vercel.app/
```

**Check karo:**
- ✅ Page load ho raha hai
- ✅ Images dikh rahe hain
- ✅ Navigation kaam kar raha hai

### API Connection Test Karo:

Browser console me check karo:
- ✅ API calls `https://cafes-20-main.onrender.com/api` pe ja rahe hain
- ✅ No CORS errors
- ✅ Data fetch ho raha hai

### Features Test Karo:

- ✅ Admin login
- ✅ Menu display
- ✅ Settings update
- ✅ Image upload

---

## 🔄 STEP 9: Auto-Deployment Setup

Vercel automatically deploy karega jab bhi aap Git pe push karoge:

```bash
# Code change karo
# Files edit karo

# Commit karo
git add .
git commit -m "feat: new feature"

# Push karo
git push origin main

# Vercel automatically deploy karega
```

### Deployment Status Check Karo:

1. Vercel Dashboard → Deployments
2. Latest deployment dekho
3. Build logs check karo

---

## 🐛 Troubleshooting

### Issue 1: Build Fail Ho Raha Hai

**Check karo:**
```bash
# Local build test karo
cd Cafes-20-main
pnpm install
pnpm run build:client

# Agar local me kaam kar raha hai, Vercel settings check karo
```

### Issue 2: Blank Page Dikh Raha Hai

**Solution:**
- Verify `outputDirectory` = `dist/spa` (not `dist`)
- Browser console me errors check karo
- Vercel logs me errors dekho

### Issue 3: API Calls Fail Ho Rahe Hain

**Solution:**
- Environment variable check karo: `VITE_API_URL`
- Backend CORS settings me Vercel URL add karo
- Network tab me API calls check karo

### Issue 4: 404 on Page Refresh

**Solution:**
Already fixed in `vercel.json`:
```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```

---

## 📋 Complete Checklist

### Pre-Deployment:
- [ ] `pnpm install` run kiya
- [ ] `pnpm install --frozen-lockfile` success hua
- [ ] `pnpm run build:client` local me kaam kar raha hai
- [ ] `vercel.json` file committed hai
- [ ] `.env.production` file committed hai
- [ ] `pnpm-lock.yaml` updated aur committed hai

### Vercel Setup:
- [ ] Vercel account banaya
- [ ] GitHub repository connected kiya
- [ ] Framework preset: Vite
- [ ] Build command: `pnpm run build:client`
- [ ] Output directory: `dist/spa`
- [ ] Install command: `pnpm install --frozen-lockfile`
- [ ] Environment variables add kiye

### Post-Deployment:
- [ ] Build successful hua
- [ ] Deployment URL mil gaya
- [ ] Frontend load ho raha hai
- [ ] API calls kaam kar rahe hain
- [ ] All features test kiye

---

## 🎯 Expected URLs

### Frontend (Vercel):
```
https://cafes-20-main.vercel.app
```

### Backend (Render):
```
https://cafes-20-main.onrender.com
```

### API Endpoint:
```
https://cafes-20-main.onrender.com/api
```

---

## 🔒 Backend CORS Update

Deployment ke baad, backend me Vercel URL add karo:

### File: `server/src/server.ts`

```typescript
app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:5173",
    "http://localhost:8080",
    "https://cafes-20-main.vercel.app",  // ← Add this
    "https://*.vercel.app"  // ← All Vercel preview URLs
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

### Backend .env Update:

```env
CLIENT_URL=https://cafes-20-main.vercel.app
```

Phir backend redeploy karo on Render.

---

## 📞 Support

### Vercel Documentation:
- https://vercel.com/docs
- https://vercel.com/docs/frameworks/vite

### Common Issues:
- Build errors: Check Vercel logs
- API errors: Check browser console
- CORS errors: Update backend CORS settings

---

## 🎉 Success!

Agar sab kuch sahi se configure hua, to:

✅ Frontend Vercel pe live hai
✅ Backend Render pe live hai
✅ API calls kaam kar rahe hain
✅ Auto-deployment setup hai

**Congratulations! Aapka app production me hai! 🚀**

---

## 🔄 Future Deployments

Har baar jab code change karoge:

```bash
# Code edit karo
# Files change karo

# Commit karo
git add .
git commit -m "your message"

# Push karo
git push origin main

# Vercel automatically deploy karega
# 2-3 minutes me live ho jayega
```

**Happy Deploying! 🎊**
