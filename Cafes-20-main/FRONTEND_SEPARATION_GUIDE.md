# 🚀 Frontend Separation Guide - Vercel Deployment

This guide will help you separate your React frontend into its own GitHub repository and deploy it to Vercel.

## 📋 Prerequisites

Before starting, make sure you have:
- Git installed on your computer
- A GitHub account
- Node.js and npm/pnpm installed
- Your backend API already deployed (you'll need the API URL)

---

## 🎯 Step 1: Create a New GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Name it something like: `cafes-frontend` or `your-project-frontend`
4. Keep it **Public** or **Private** (your choice)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click **"Create repository"**
7. **Copy the repository URL** (looks like: `https://github.com/yourusername/cafes-frontend.git`)

---

## 🛠️ Step 2: Prepare Your Frontend Folder

Open your terminal/command prompt and navigate to your project:

```cmd
cd Cafes-20-main
```

### Create a package.json for the client folder

The client folder needs its own package.json. Run this command:

```cmd
cd client
```

Create a new `package.json` file in the client folder with this content (I'll create it for you in the next step).

---

## 📦 Step 3: Copy Required Configuration Files

You need to copy some files from the root to the client folder:

```cmd
REM Make sure you're in the Cafes-20-main directory
cd ..

REM Copy configuration files to client folder
copy tailwind.config.ts client\
copy postcss.config.js client\
copy tsconfig.json client\
copy vite.config.ts client\
copy components.json client\
copy index.html client\
```

---

## 🔧 Step 4: Initialize Git in Client Folder

```cmd
REM Navigate to client folder
cd client

REM Initialize a new git repository
git init

REM Add all files
git add .

REM Create first commit
git commit -m "Initial commit: Frontend separation"

REM Add your GitHub repository as remote (replace with YOUR repository URL)
git remote add origin https://github.com/yourusername/cafes-frontend.git

REM Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🌐 Step 5: Update API URLs in Your Frontend

Before deploying, you need to update your API endpoints to point to your deployed backend.

**File to update:** `client/services/api.ts`

Change the base URL from `http://localhost:5000` to your deployed backend URL:

```typescript
// Example:
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-backend.onrender.com';
```

**Update your `.env` file:**

```env
VITE_API_URL=https://your-backend-api.com
```

Commit these changes:

```cmd
git add .
git commit -m "Update API URLs for production"
git push
```

---

## 🚀 Step 6: Deploy to Vercel

### Option A: Using Vercel Website (Easiest)

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your new frontend repository
5. Vercel will auto-detect it's a Vite project
6. Configure these settings:

   **Framework Preset:** Vite
   
   **Root Directory:** `./` (leave as is)
   
   **Build Command:** `npm run build` or `pnpm build`
   
   **Output Directory:** `dist`
   
   **Install Command:** `npm install` or `pnpm install`

7. Add Environment Variables:
   - Click **"Environment Variables"**
   - Add: `VITE_API_URL` = `https://your-backend-api.com`

8. Click **"Deploy"**

### Option B: Using Vercel CLI

```cmd
REM Install Vercel CLI globally
npm install -g vercel

REM Login to Vercel
vercel login

REM Deploy (run from client folder)
vercel

REM Follow the prompts:
REM - Set up and deploy? Yes
REM - Which scope? (select your account)
REM - Link to existing project? No
REM - Project name? (press enter or type a name)
REM - Directory? ./ (press enter)
REM - Override settings? No

REM For production deployment:
vercel --prod
```

---

## ⚙️ Step 7: Vercel Configuration (Optional but Recommended)

Create a `vercel.json` file in your client folder:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures proper routing for your React app.

---

## 🔒 Environment Variables on Vercel

After deployment, add your environment variables:

1. Go to your project on Vercel dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Add these variables:

```
VITE_API_URL=https://your-backend-api.com
```

4. Click **"Save"**
5. Redeploy your project for changes to take effect

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Frontend loads without errors
- [ ] API calls work correctly
- [ ] Images and assets load properly
- [ ] Routing works (try refreshing on different pages)
- [ ] Environment variables are set correctly
- [ ] CORS is configured on your backend to allow your Vercel domain

---

## 🐛 Common Issues & Solutions

### Issue 1: "404 on page refresh"
**Solution:** Make sure you have the `rewrites` configuration in `vercel.json` (see Step 7)

### Issue 2: "API calls failing"
**Solution:** 
- Check your backend CORS settings
- Verify `VITE_API_URL` is set correctly
- Make sure your backend allows requests from your Vercel domain

### Issue 3: "Environment variables not working"
**Solution:**
- Vercel env vars need `VITE_` prefix to be accessible in frontend
- Redeploy after adding env vars
- Check they're set in Vercel dashboard

### Issue 4: "Build fails on Vercel"
**Solution:**
- Check if all dependencies are in `package.json`
- Make sure `vite.config.ts` is in the client folder
- Check build logs for specific errors

---

## 🔄 Future Updates

To update your deployed frontend:

```cmd
REM Make your changes
REM Commit and push
git add .
git commit -m "Your update message"
git push

REM Vercel will automatically redeploy!
```

---

## 📞 Need Help?

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all configuration files are present
4. Make sure backend CORS is configured correctly

---

## 🎉 Success!

Your frontend is now:
- ✅ In its own GitHub repository
- ✅ Deployed on Vercel
- ✅ Automatically deploys on every push
- ✅ Has its own domain (yourproject.vercel.app)

You can now develop frontend and backend independently!
