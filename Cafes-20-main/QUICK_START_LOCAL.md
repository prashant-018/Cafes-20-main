# 🚀 Quick Start - Local Development

## ⚡ TL;DR

```bash
# Terminal 1 - Backend
cd server
npm install
npm run dev

# Terminal 2 - Frontend
cd client
npm install
npm run dev

# Open browser: http://localhost:5173/admin/login
# Login: admin@himalayan-pizza.com / admin123456
```

---

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Git installed

---

## 🔧 Setup Steps

### 1. Clone & Install

```bash
# Clone repository
git clone <your-repo-url>
cd Cafes-20-main

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

#### Backend (.env already configured)
```bash
cd server
cat .env
```

Should show:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://...
JWT_SECRET=himalayan-pizza-super-secret-jwt-key-2024-make-this-very-long-and-random
JWT_EXPIRES_IN=7d
```

#### Frontend (.env already configured)
```bash
cd client
cat .env
```

Should show:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Backend

```bash
cd server
npm run dev
```

**Expected Output:**
```
╔════════════════════════════════════════════════════════╗
║   🍕 The Himalayan Pizza - Backend API                ║
║   🚀 Server running on port 5000                      ║
║   📊 Environment: development                         ║
║   🌐 Frontend URL: http://localhost:5173              ║
║   📡 Socket.IO enabled                                 ║
╚════════════════════════════════════════════════════════╝
```

### 4. Start Frontend

```bash
cd client
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 5. Test Login

1. Open browser: `http://localhost:5173/admin/login`
2. Enter credentials:
   - **Email**: `admin@himalayan-pizza.com`
   - **Password**: `admin123456`
3. Click "Login as Admin"
4. Should redirect to admin dashboard

---

## ✅ Verification

### Check Backend Health
```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "The Himalayan Pizza API is running",
  "environment": "development"
}
```

### Check Frontend
Open browser: `http://localhost:5173`

Should see the homepage without errors.

### Check CORS
Open browser console (F12) and check for:
- ❌ No CORS errors
- ❌ No "Failed to fetch" errors
- ✅ API requests succeed

---

## 🐛 Troubleshooting

### Backend Won't Start

**Error**: "Cannot find module"
```bash
cd server
npm install
npm run dev
```

**Error**: "MongoDB connection failed"
- Check MONGODB_URI in server/.env
- Ensure MongoDB Atlas allows your IP

**Error**: "Port 5000 already in use"
```bash
# Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

### Frontend Won't Start

**Error**: "Cannot find module"
```bash
cd client
npm install
npm run dev
```

**Error**: "Port 5173 already in use"
```bash
# Kill process on port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill -9
```

### Login Fails

**Error**: "Failed to fetch"
- Check backend is running on port 5000
- Check client/.env has `VITE_API_URL=http://localhost:5000/api`
- Restart frontend after changing .env

**Error**: "CORS policy blocked"
- Check server/.env has `CLIENT_URL=http://localhost:5173`
- Restart backend after changing .env

**Error**: "Invalid credentials"
- Use correct credentials:
  - Email: `admin@himalayan-pizza.com`
  - Password: `admin123456`

---

## 📁 Project Structure

```
Cafes-20-main/
├── server/                 # Backend (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── server.ts      # Main server file
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   └── utils/         # Utility functions
│   ├── .env               # Environment variables (development)
│   ├── .env.development   # Development config
│   ├── .env.production    # Production config
│   └── package.json
│
├── client/                # Frontend (React + Vite + TypeScript)
│   ├── src/
│   │   ├── pages/         # React pages
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   └── App.tsx        # Main app component
│   ├── .env               # Environment variables (development)
│   ├── .env.development   # Development config
│   ├── .env.production    # Production config
│   └── package.json
│
└── README.md
```

---

## 🔑 Default Credentials

### Admin Login
- **Email**: `admin@himalayan-pizza.com`
- **Password**: `admin123456`
- **URL**: `http://localhost:5173/admin/login`

### User Registration
- Create new user at: `http://localhost:5173/register`

---

## 🌐 URLs

### Development
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Backend Health**: http://localhost:5000/api/health
- **Admin Login**: http://localhost:5173/admin/login

### Production
- **Frontend**: https://your-frontend-domain.com
- **Backend API**: https://cafes-20-main.onrender.com/api

---

## 📝 Available Scripts

### Backend
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start            # Start production server
npm run clean        # Clean dist folder
npm run type-check   # Check TypeScript types
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code
```

---

## 🎯 Next Steps

1. ✅ Backend running on port 5000
2. ✅ Frontend running on port 5173
3. ✅ Login working
4. ✅ No CORS errors

Now you can:
- Explore the admin dashboard
- Upload menu images
- Update business settings
- Test real-time updates with Socket.IO

---

## 📚 Documentation

- `LOGIN_FIX_COMPLETE.md` - Detailed fix documentation
- `TYPESCRIPT_FIX_COMPLETE.md` - TypeScript configuration
- `RENDER_DEPLOY_GUIDE.md` - Production deployment guide

---

**Happy Coding! 🚀**
