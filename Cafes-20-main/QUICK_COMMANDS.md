# 🚀 Quick Command Reference - Frontend Separation

Copy and paste these commands in order. Replace `YOUR_GITHUB_URL` with your actual repository URL.

## Step 1: Clean Up and Copy Configuration Files

```cmd
cd Cafes-20-main

REM Delete root lock files (optional - keeps root clean)
del pnpm-lock.yaml
del package-lock.json

REM Copy configuration files to client
copy tailwind.config.ts client\
copy postcss.config.js client\
copy tsconfig.json client\
copy vite.config.ts client\
copy components.json client\
copy index.html client\
```

## Step 2: Initialize Git in Client Folder

```cmd
cd client
git init
git add .
git commit -m "Initial commit: Frontend separation"
```

## Step 3: Push to GitHub

**Replace `YOUR_GITHUB_URL` with your repository URL!**

```cmd
git remote add origin YOUR_GITHUB_URL
git branch -M main
git push -u origin main
```

Example:
```cmd
git remote add origin https://github.com/yourusername/cafes-frontend.git
git branch -M main
git push -u origin main
```

## Step 4: Install Dependencies (Optional - Test Locally)

```cmd
npm install
npm run dev
```

## Step 5: Deploy to Vercel

### Option A: Vercel Website
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Click "Deploy"

### Option B: Vercel CLI
```cmd
npm install -g vercel
vercel login
vercel
vercel --prod
```

---

## 🔧 Update API URL Before Deploying

Edit `client/services/api.ts` and update the API base URL to your deployed backend.

Also update `client/.env`:
```env
VITE_API_URL=https://your-backend-api.com
```

Then commit:
```cmd
git add .
git commit -m "Update API URLs for production"
git push
```

---

## ✅ That's It!

Your frontend is now:
- ✅ In its own GitHub repository
- ✅ Ready for Vercel deployment
- ✅ Independent from backend

Visit your Vercel dashboard to see your deployed site!
