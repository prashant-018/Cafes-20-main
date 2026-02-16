# 🔧 Debugging 500 Internal Server Error

## 🔍 **Root Causes Identified**

### 1. **Wrong Client URL Configuration**
- **Issue**: Server `.env` had `CLIENT_URL=http://localhost:8080` but Vite runs on `5173`
- **Fix**: Updated to `CLIENT_URL=http://localhost:5173`

### 2. **Missing Dependencies**
- **Issue**: Client missing `axios` and `socket.io-client`
- **Fix**: Added to `package.json`

### 3. **Missing Environment Variables**
- **Issue**: Server missing Cloudinary config and proper JWT secret
- **Fix**: Updated server `.env` with all required variables

### 4. **Server Not Running New Code**
- **Issue**: Old `index.ts` being used instead of new `src/server.ts`
- **Fix**: Package.json already configured correctly

## 🛠️ **Step-by-Step Fix Instructions**

### Step 1: Install Missing Dependencies
```bash
# In root directory (client)
npm install axios socket.io-client

# In server directory
cd server
npm install
```

### Step 2: Setup Environment Files

#### Client `.env` (root directory)
```env
VITE_API_URL=http://localhost:5000/api
```

#### Server `.env` (server directory)
```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/himalayan-pizza

# JWT Configuration
JWT_SECRET=himalayan-pizza-super-secret-jwt-key-2024-make-this-very-long-and-random
JWT_EXPIRES_IN=7d

# Cloudinary Configuration (for image storage)
CLOUDINARY_CLOUD_NAME=demo
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=demo-secret-key

# Admin Configuration (for initial setup)
ADMIN_EMAIL=admin@himalayan-pizza.com
ADMIN_PASSWORD=admin123456
ADMIN_NAME=Restaurant Admin
```

### Step 3: Start MongoDB
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Or manually
mongod
```

### Step 4: Create Admin User
```bash
cd server
npm run seed:admin
```

### Step 5: Start Services

#### Terminal 1: Backend
```bash
cd server
npm run dev
```

#### Terminal 2: Frontend
```bash
# In root directory
npm run dev
```

## 🔍 **Debugging Steps**

### 1. Check Server Logs
Look for these messages when starting the server:
```
✅ MongoDB Connected: localhost:27017
🚀 Server running on port 5000
📊 Environment: development
🌐 Client URL: http://localhost:5173
📡 Socket.IO enabled for real-time updates
```

### 2. Test API Endpoints Manually

#### Health Check
```bash
curl http://localhost:5000/api/health
```
Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-02-09T...",
  "environment": "development"
}
```

#### Menu Images (Public)
```bash
curl http://localhost:5000/api/menu
```

### 3. Check Browser Console
The debug version of `api.ts` will show:
```
🔧 API Base URL: http://localhost:5000/api
🔧 Environment Variables: { VITE_API_URL: "http://localhost:5000/api", ... }
📤 API Request: GET /health
📥 API Response: 200 /health
```

### 4. Common Error Messages and Fixes

#### "ECONNREFUSED"
- **Cause**: Backend server not running
- **Fix**: Start backend with `npm run dev`

#### "Network Error"
- **Cause**: Wrong API URL or CORS issue
- **Fix**: Check `.env` files and CORS configuration

#### "Cannot connect to MongoDB"
- **Cause**: MongoDB not running
- **Fix**: Start MongoDB service

#### "JWT_SECRET is not defined"
- **Cause**: Missing environment variable
- **Fix**: Check server `.env` file

## 🚀 **Production-Ready Fixes**

### 1. Environment Variables Validation
```typescript
// Add to server/src/config/env.ts
const requiredEnvVars = [
  'JWT_SECRET',
  'MONGODB_URI',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

### 2. Better Error Handling
```typescript
// Enhanced error middleware
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error Stack:', err.stack);
  
  // Log request details for debugging
  console.error('Request Details:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body
  });

  // Send appropriate error response
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

### 3. Health Check with Dependencies
```typescript
app.get('/api/health', async (req, res) => {
  try {
    // Check MongoDB connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Check Cloudinary config
    const cloudinaryStatus = process.env.CLOUDINARY_CLOUD_NAME ? 'configured' : 'missing';
    
    res.json({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: dbStatus,
        cloudinary: cloudinaryStatus,
        socketio: 'enabled'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message
    });
  }
});
```

## 🎯 **Testing Checklist**

### Backend Tests
- [ ] Server starts without errors
- [ ] MongoDB connects successfully
- [ ] Health endpoint returns 200
- [ ] Menu endpoint returns data
- [ ] Socket.IO connections work

### Frontend Tests
- [ ] API debug component shows green status
- [ ] Console shows successful API calls
- [ ] No CORS errors in browser
- [ ] Environment variables loaded correctly

### Integration Tests
- [ ] Admin dashboard loads without errors
- [ ] Menu images fetch successfully
- [ ] Real-time updates work
- [ ] File uploads work (after Cloudinary setup)

## 🔧 **Quick Debug Commands**

```bash
# Check if ports are in use
netstat -an | grep :5000
netstat -an | grep :5173

# Test API directly
curl -v http://localhost:5000/api/health

# Check MongoDB status
mongo --eval "db.adminCommand('ismaster')"

# View server logs with debug info
DEBUG=* npm run dev
```

## 📞 **Still Having Issues?**

1. **Check all environment files** are correctly configured
2. **Restart both frontend and backend** after changes
3. **Clear browser cache** and localStorage
4. **Check firewall settings** aren't blocking ports
5. **Verify MongoDB is running** and accessible

The debug component in the admin dashboard will show real-time status of all API connections!