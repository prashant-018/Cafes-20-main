# 🚀 Frontend Deployment Guide

## ✅ STEP 1: Environment Variables Setup

### Create `.env` file in `client/` folder:

```env
VITE_API_URL=https://cafes-20-main.onrender.com/api
```

✅ **Already Done!** - I've created this file for you.

---

## ✅ STEP 2: Verify API Configuration

Your frontend is already configured correctly! All API calls use:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

### Files using API_BASE_URL:
- ✅ `client/services/api.ts`
- ✅ `client/services/socket.ts`
- ✅ `client/hooks/useMenuImagesLocal.ts`
- ✅ `client/hooks/useMenuSimple.ts`

---

## 🔨 STEP 3: Build Test Locally

```bash
# Navigate to client folder
cd client

# Install dependencies (if not already done)
npm install

# Build for production
npm run build
```

### Expected Output:
```
✓ built in 5.23s
✓ 150 modules transformed.
dist/index.html                   0.45 kB
dist/assets/index-abc123.css     12.34 kB
dist/assets/index-xyz789.js     234.56 kB
```

✅ If `dist/` folder is created → **Ready for deployment!**

---

## 🌐 STEP 4: Deploy to Vercel

### Option A: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to client folder
cd client

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? himalayan-pizza-frontend
# - Directory? ./
# - Override settings? No
```

### Option B: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://cafes-20-main.onrender.com/api`

6. Click "Deploy"

---

## 🔧 STEP 5: Update Backend CORS

After deploying frontend, update your backend `.env` on Render:

```env
CLIENT_URL=https://your-frontend-app.vercel.app
```

Then update `server/src/server.ts` CORS configuration to include your Vercel URL.

---

## 🧪 STEP 6: Test Deployment

After deployment, test these:

### 1. Frontend loads correctly
```
https://your-app.vercel.app/
```

### 2. API connection works
Open browser console and check:
- No CORS errors
- API calls to `https://cafes-20-main.onrender.com/api/*` succeed

### 3. Test features:
- ✅ Admin login
- ✅ Menu image upload
- ✅ Settings update
- ✅ Real-time updates (Socket.IO)

---

## 🔄 Local Development vs Production

### For Local Development:

Update `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Then run:
```bash
cd client
npm run dev
```

### For Production:

Update `client/.env`:
```env
VITE_API_URL=https://cafes-20-main.onrender.com/api
```

Then build and deploy:
```bash
cd client
npm run build
vercel --prod
```

---

## 🐛 Troubleshooting

### Issue 1: CORS Error

**Error:**
```
Access to fetch at 'https://cafes-20-main.onrender.com/api/...' 
from origin 'https://your-app.vercel.app' has been blocked by CORS
```

**Solution:**
Add your Vercel URL to backend CORS configuration in `server/src/server.ts`:

```typescript
app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:5173",
    "http://localhost:8080",
    "https://your-app.vercel.app"  // Add this
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

### Issue 2: API calls fail

**Check:**
1. Backend is running: `https://cafes-20-main.onrender.com/`
2. Environment variable is set: `console.log(import.meta.env.VITE_API_URL)`
3. Network tab shows correct API URL

### Issue 3: Build fails

**Solution:**
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

---

## 📋 Deployment Checklist

- [x] `.env` file created with `VITE_API_URL`
- [ ] Build test passed (`npm run build`)
- [ ] `dist/` folder generated
- [ ] Deployed to Vercel
- [ ] Backend CORS updated with frontend URL
- [ ] Tested all features in production
- [ ] Admin login works
- [ ] Menu upload works
- [ ] Settings update works

---

## 🎯 Final URLs

After deployment:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://cafes-20-main.onrender.com`
- **API**: `https://cafes-20-main.onrender.com/api`

---

## 📞 Need Help?

Check:
1. Vercel deployment logs
2. Browser console for errors
3. Network tab for failed requests
4. Backend Render logs

**Happy Deploying! 🚀**
