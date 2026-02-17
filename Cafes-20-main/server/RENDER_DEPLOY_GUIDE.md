# 🚀 Render Deployment - Quick Reference

## ⚡ Quick Deploy Commands

### Render Dashboard Settings:

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm start
```

**That's it!** The `postinstall` script automatically runs the build.

---

## 🔧 Environment Variables

Set these in Render Dashboard → Environment:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-key-minimum-32-characters-long
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend-url.com
NODE_ENV=production
PORT=5000
```

### Required Variables:
- ✅ `MONGODB_URI` - Your MongoDB connection string
- ✅ `JWT_SECRET` - Secret key for JWT tokens (min 32 chars)
- ✅ `JWT_EXPIRES_IN` - Token expiration (e.g., "7d", "24h")
- ✅ `CLIENT_URL` - Your frontend URL for CORS
- ✅ `NODE_ENV` - Set to "production"
- ✅ `PORT` - Port number (Render provides this automatically)

---

## 📋 Pre-Deployment Checklist

- [x] TypeScript compiles successfully (0 errors)
- [x] dist/ folder is generated
- [x] Environment variables are ready
- [x] MongoDB connection string is valid
- [x] JWT_SECRET is at least 32 characters
- [x] Frontend URL is correct for CORS
- [x] package.json has postinstall script
- [x] Build command is set to `npm install`
- [x] Start command is set to `npm start`

---

## 🧪 Test Locally Before Deploy

```bash
# 1. Clean build
npm run clean

# 2. Production build
npm run build

# 3. Check dist folder
ls dist/

# 4. Test start command
npm start
```

**Expected Output:**
```
╔════════════════════════════════════════════════════════╗
║   🍕 The Himalayan Pizza - Backend API                ║
║   🚀 Server running on port 5000                      ║
║   📊 Environment: production                          ║
╚════════════════════════════════════════════════════════╝
```

---

## 🔍 Troubleshooting

### Build Fails on Render:

**Check:**
1. Is `npm install` the build command?
2. Are all dependencies in package.json?
3. Is @types/node installed as devDependency?

**Solution:**
```bash
# Locally test the exact Render build process
npm ci
npm run build
npm start
```

### "Cannot find name 'console'" Error:

**Status:** ✅ FIXED
- tsconfig.json now includes `"types": ["node"]`
- This error should not occur anymore

### "Cannot find name 'process'" Error:

**Status:** ✅ FIXED
- Node.js types are properly configured
- This error should not occur anymore

### Build Succeeds but Server Won't Start:

**Check:**
1. Is dist/server.js present?
2. Are environment variables set in Render?
3. Is MongoDB URI valid?

**Test Locally:**
```bash
node dist/server.js
```

---

## 📊 Build Output

### Successful Build Shows:
```
> himalayan-pizza-backend@1.0.0 build
> npm run clean && tsc -p tsconfig.prod.json

> himalayan-pizza-backend@1.0.0 clean
> rimraf dist

✓ TypeScript compilation complete
✓ 32 files generated in dist/
```

### Files Generated:
- `dist/server.js` - Main entry point
- `dist/config/` - Configuration files
- `dist/controllers/` - Route controllers
- `dist/middleware/` - Express middleware
- `dist/models/` - MongoDB models
- `dist/routes/` - API routes
- `dist/utils/` - Utility functions
- `dist/scripts/` - Database scripts

---

## 🎯 Deployment Steps

### 1. Create New Web Service on Render
- Go to Render Dashboard
- Click "New +" → "Web Service"
- Connect your GitHub repository

### 2. Configure Build Settings
```
Name: himalayan-pizza-backend
Environment: Node
Region: Choose closest to your users
Branch: main (or your production branch)
Build Command: npm install
Start Command: npm start
```

### 3. Add Environment Variables
Click "Environment" tab and add all variables listed above.

### 4. Deploy
Click "Create Web Service" - Render will:
1. Clone your repository
2. Run `npm install` (which triggers build via postinstall)
3. Run `npm start` to start the server

### 5. Verify Deployment
Once deployed, test your API:
```bash
curl https://your-app.onrender.com/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "The Himalayan Pizza API is running",
  "timestamp": "2024-02-17T...",
  "environment": "production"
}
```

---

## 🔄 Auto-Deploy on Git Push

Render automatically redeploys when you push to your connected branch:

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Render will:
1. Detect the push
2. Run build command
3. Restart the service
4. Your changes are live!

---

## 📈 Monitoring

### Check Logs:
- Go to Render Dashboard
- Click your service
- Click "Logs" tab
- View real-time server logs

### Check Metrics:
- CPU usage
- Memory usage
- Request count
- Response times

---

## ✅ Success Indicators

Your deployment is successful when you see:

1. ✅ Build completes without errors
2. ✅ Service status shows "Live"
3. ✅ Health check endpoint responds
4. ✅ MongoDB connection established
5. ✅ API endpoints are accessible
6. ✅ No errors in logs

---

## 🆘 Support

### Common Issues:

**MongoDB Connection Failed:**
- Check MONGODB_URI is correct
- Ensure MongoDB Atlas allows Render's IP (0.0.0.0/0)
- Verify database user has correct permissions

**JWT Errors:**
- Ensure JWT_SECRET is set
- Minimum 32 characters recommended
- Check JWT_EXPIRES_IN format (e.g., "7d", "24h")

**CORS Errors:**
- Verify CLIENT_URL matches your frontend URL
- Include protocol (https://)
- No trailing slash

---

## 🎉 You're Ready!

Your Node.js + TypeScript backend is now:
- ✅ TypeScript configured correctly
- ✅ Building successfully
- ✅ Production-ready
- ✅ Ready for Render deployment

**Deploy with confidence!** 🚀
