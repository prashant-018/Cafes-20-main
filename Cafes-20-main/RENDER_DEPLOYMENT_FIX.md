# Render Deployment Fix Guide

## Current Issues

Your backend on Render (cafes-20-main.onrender.com) is returning 500 errors, which indicates:
1. Server is crashing when handling auth requests
2. Database connection is failing or unstable
3. Environment variables might not be properly set

## Step-by-Step Fix

### 1. Check Render Logs (MOST IMPORTANT)

Go to your Render dashboard and check the logs:
1. Visit: https://dashboard.render.com
2. Select your service: `cafes-20-main`
3. Click on "Logs" tab
4. Look for these error messages:
   - `❌ MONGODB_URI is not defined`
   - `❌ Failed to connect to MongoDB`
   - `ENOTFOUND` or `ETIMEDOUT` errors
   - Any stack traces showing where the crash occurs

### 2. Fix MongoDB Atlas Network Access

**This is the most common issue!**

1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Select your cluster: `CompleteCoding`
3. Click "Network Access" in the left sidebar
4. Click "Add IP Address"
5. Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add Render's specific IP ranges if you want more security
6. Click "Confirm"
7. Wait 2-3 minutes for changes to propagate

### 3. Verify Environment Variables on Render

1. In Render dashboard, go to your service
2. Click "Environment" tab
3. Verify these variables exist and are correct:

```bash
# Required Variables
MONGODB_URI=mongodb+srv://cafe:heQCBCCq2ccFM2hkv@completecoding.ysiqcy9.mongodb.net/himalayan-pizza?retryWrites=true&w=majority&appName=CompleteCoding
JWT_SECRET=himalayan-pizza-super-secret-jwt-key-2024-make-this-very-long-and-random
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=5000

# Optional but recommended
CLIENT_URL=https://your-frontend-url.com
```

**IMPORTANT**: Make sure there are NO extra spaces or quotes around the values!

### 4. Redeploy the Backend

After making changes:

1. In Render dashboard, click "Manual Deploy" → "Deploy latest commit"
2. Or push your code changes to trigger auto-deploy:
   ```bash
   cd Cafes-20-main
   git add .
   git commit -m "Fix auth error handling"
   git push
   ```

### 5. Test the Deployment

After deployment completes (wait 2-3 minutes):

#### Test 1: Health Check
```bash
curl https://cafes-20-main.onrender.com/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "The Himalayan Pizza API is running",
  "timestamp": "2026-02-16T...",
  "environment": "production"
}
```

#### Test 2: Register a User
```bash
curl -X POST https://cafes-20-main.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123456"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "token": "eyJ..."
  }
}
```

#### Test 3: Login
```bash
curl -X POST https://cafes-20-main.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'
```

#### Test 4: Admin Login
```bash
curl -X POST https://cafes-20-main.onrender.com/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gmail.com",
    "password": "prashant123"
  }'
```

## Common Error Messages and Solutions

### Error: "Database connection unavailable"
- **Cause**: MongoDB is not connected
- **Fix**: Check MongoDB Atlas network access (Step 2)
- **Fix**: Verify MONGODB_URI environment variable (Step 3)

### Error: "ENOTFOUND" or "ETIMEDOUT"
- **Cause**: Cannot reach MongoDB Atlas
- **Fix**: Add 0.0.0.0/0 to MongoDB Atlas Network Access
- **Fix**: Check if MongoDB cluster is paused (free tier pauses after inactivity)

### Error: "Authentication failed" (MongoDB)
- **Cause**: Wrong database username/password in connection string
- **Fix**: Verify the password in MONGODB_URI matches your MongoDB user
- **Fix**: Create a new database user in MongoDB Atlas if needed

### Error: "Invalid email or password" (Login)
- **Cause**: User doesn't exist or wrong password
- **Fix**: Register a new user first
- **Fix**: Make sure you're using the exact password you registered with

## MongoDB Atlas Cluster Status

If your cluster is paused (common with free tier):
1. Go to MongoDB Atlas
2. Click on your cluster
3. If you see "Paused", click "Resume"
4. Wait 2-3 minutes for cluster to start

## Alternative: Test Locally First

If Render deployment is still failing, test locally:

```bash
# Terminal 1 - Start backend
cd Cafes-20-main/server
npm install
npm run dev

# Terminal 2 - Start frontend
cd Cafes-20-main/client
npm install
npm run dev
```

Update `Cafes-20-main/client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Test locally, then once working, deploy to Render.

## Files Changed in This Fix

1. `server/src/controllers/auth.controller.ts` - Added better error logging
2. `server/src/middleware/dbCheck.ts` - New middleware to check DB connection
3. `server/src/routes/auth.routes.ts` - Added DB check middleware

## Next Steps After Fix

1. Check Render logs to confirm "✅ MongoDB Connected Successfully!"
2. Test all endpoints using curl commands above
3. Try logging in from your frontend
4. If still failing, share the Render logs for more specific help

## Support

If you're still having issues:
1. Copy the error messages from Render logs
2. Check which step is failing (health check, register, or login)
3. Verify MongoDB Atlas shows "Connected" status
