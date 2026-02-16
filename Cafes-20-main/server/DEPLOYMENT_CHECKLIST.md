# 🚀 Deployment Checklist for Render/Production

## ✅ Pre-Deployment Verification

### 1. Environment Variables Check
- [ ] `PORT` uses `process.env.PORT` (✅ Configured)
- [ ] `MONGODB_URI` uses `process.env.MONGODB_URI` (✅ Configured)
- [ ] No hardcoded localhost URLs (✅ Verified)
- [ ] MongoDB connects BEFORE server starts (✅ Configured)

### 2. MongoDB Atlas Configuration
- [ ] IP Whitelist: Add `0.0.0.0/0` for production (allows all IPs)
- [ ] Database User: Verify username `cafe20` has read/write permissions
- [ ] Connection String: Correct format with database name
- [ ] Network Access: Check MongoDB Atlas dashboard

### 3. Required Environment Variables for Render

```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://cafe20:Prashant089111@completecoding.ysiqcy9.mongodb.net/himalayan-pizza?retryWrites=true&w=majority

# JWT
JWT_SECRET=himalayan-pizza-super-secret-jwt-key-2024-make-this-very-long-and-random
JWT_EXPIRES_IN=7d

# Frontend URL (Update with your deployed frontend URL)
CLIENT_URL=https://your-frontend-app.vercel.app

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 📋 Render Deployment Steps

### Step 1: Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `himalayan-pizza-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main` or `master`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### Step 2: Add Environment Variables

In Render dashboard, go to "Environment" tab and add:

```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://cafe20:Prashant089111@completecoding.ysiqcy9.mongodb.net/himalayan-pizza?retryWrites=true&w=majority
JWT_SECRET=himalayan-pizza-super-secret-jwt-key-2024-make-this-very-long-and-random
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend-url.vercel.app
```

### Step 3: MongoDB Atlas Network Access

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to "Network Access"
3. Click "Add IP Address"
4. Select "Allow Access from Anywhere" (0.0.0.0/0)
5. Click "Confirm"

### Step 4: Deploy

1. Click "Create Web Service" in Render
2. Wait for deployment to complete
3. Check logs for:
   ```
   ✅ MongoDB Connected Successfully!
   🚀 Server running on port 5000
   ```

## 🔍 Troubleshooting

### Issue: MongoDB Connection Timeout

**Solution:**
- Check MongoDB Atlas Network Access
- Ensure IP `0.0.0.0/0` is whitelisted
- Verify connection string is correct

### Issue: Authentication Failed

**Solution:**
- Verify username: `cafe20`
- Verify password: `Prashant089111`
- Check database user permissions in MongoDB Atlas

### Issue: Database Not Found

**Solution:**
- Database name in URI: `himalayan-pizza`
- Database will be created automatically on first write
- Run the init script: `npm run db:init`

### Issue: Server Crashes on Startup

**Solution:**
- Check Render logs for error messages
- Verify all environment variables are set
- Ensure `MONGODB_URI` is defined

## 📊 Health Check

After deployment, test these endpoints:

```bash
# Health check
curl https://your-app.onrender.com/api/health

# Expected response:
{
  "success": true,
  "message": "The Himalayan Pizza API is running",
  "timestamp": "2024-02-14T...",
  "environment": "production"
}
```

## 🔒 Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable CORS only for your frontend domain
- [ ] Use HTTPS in production
- [ ] Keep `.env` files out of Git (✅ Already configured)
- [ ] Rotate MongoDB password periodically
- [ ] Enable MongoDB Atlas audit logs

## 📝 Post-Deployment

1. **Update Frontend**: Change API URL to Render URL
2. **Test All Features**: Login, menu upload, settings
3. **Monitor Logs**: Check Render dashboard for errors
4. **Set Up Alerts**: Configure Render notifications

## 🎯 Production URLs

After deployment, you'll have:
- **Backend API**: `https://himalayan-pizza-backend.onrender.com`
- **Frontend**: `https://your-frontend.vercel.app`

Update `CLIENT_URL` in Render environment variables with your actual frontend URL.

---

**Need Help?** Check Render logs or MongoDB Atlas monitoring dashboard.
