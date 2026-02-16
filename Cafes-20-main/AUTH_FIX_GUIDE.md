# Authentication Issues Fix Guide

## Problems Identified

1. **Login 401 Error**: "Invalid email or password"
   - No users exist in the database yet
   - Need to create test users or register first

2. **Registration 500 Error**: "Internal server error during registration"
   - Database connection issue on Render deployment
   - MongoDB Atlas might not be accessible from Render

## Solutions

### Option 1: Fix Database Connection (Recommended)

1. **Check MongoDB Atlas Network Access**
   - Go to MongoDB Atlas Dashboard
   - Navigate to Network Access
   - Add Render's IP addresses or allow access from anywhere (0.0.0.0/0) for testing

2. **Verify Environment Variables on Render**
   - Go to your Render dashboard
   - Check that these environment variables are set:
     ```
     MONGODB_URI=mongodb+srv://cafe:heQCBCCq2ccFM2hkv@completecoding.ysiqcy9.mongodb.net/himalayan-pizza?retryWrites=true&w=majority&appName=CompleteCoding
     JWT_SECRET=himalayan-pizza-super-secret-jwt-key-2024-make-this-very-long-and-random
     JWT_EXPIRES_IN=7d
     NODE_ENV=production
     ```

3. **Check Render Logs**
   - Go to Render dashboard → Your service → Logs
   - Look for MongoDB connection errors
   - Look for "✅ MongoDB Connected!" message

### Option 2: Test Locally First

1. **Start the backend server locally**:
   ```bash
   cd Cafes-20-main/server
   npm install
   npm run dev
   ```

2. **Update client .env to use local backend**:
   ```env
   # Cafes-20-main/client/.env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start the frontend**:
   ```bash
   cd Cafes-20-main/client
   npm install
   npm run dev
   ```

4. **Test registration and login locally**

### Option 3: Create Test User via Script

Run the database initialization script:

```bash
cd Cafes-20-main/server
npm run db:init
npm run db:seed
```

This will create an admin user you can use for testing.

## Quick Test

### Test User Credentials (after seeding):
- **Admin**: admin@gmail.com / prashant123
- **Regular User**: Create via registration form

### API Endpoints to Test:

1. **Health Check**:
   ```bash
   curl https://cafes-20-main.onrender.com/api/health
   ```

2. **Register**:
   ```bash
   curl -X POST https://cafes-20-main.onrender.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"test123456"}'
   ```

3. **Login**:
   ```bash
   curl -X POST https://cafes-20-main.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123456"}'
   ```

## Common Issues

### Issue: "User with this email already exists"
- The user is already registered
- Try logging in instead
- Or use a different email

### Issue: "Invalid email or password"
- Check that you're using the correct credentials
- Passwords are case-sensitive
- Make sure the user was successfully registered

### Issue: "Internal server error"
- Check MongoDB connection
- Verify environment variables
- Check Render logs for detailed error messages

## Next Steps

1. First, check if the backend is running:
   - Visit: https://cafes-20-main.onrender.com/api/health
   - Should return: `{"success":true,"message":"Server is healthy"}`

2. If health check fails:
   - Backend is not running on Render
   - Check Render dashboard and redeploy if needed

3. If health check succeeds but auth fails:
   - Database connection issue
   - Follow "Fix Database Connection" steps above

4. Create your first user:
   - Use the registration form
   - Or run the seed script locally and sync to production
