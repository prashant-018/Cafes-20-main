# 🚀 Quick Start Guide - The Himalayan Pizza

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (running on localhost:27017)
- npm or pnpm

## 🔧 Setup Instructions

### 1. Backend Setup

```bash
# Navigate to server directory
cd Cafes-20-main/server

# Install dependencies
npm install

# Verify .env file exists with correct values
# PORT=5000
# CLIENT_URL=http://localhost:8080
# MONGODB_URI=mongodb://localhost:27017/himalayan-pizza
# JWT_SECRET=your-secret-key

# Start development server
npm run dev
```

**Backend will run on:** `http://localhost:5000`

### 2. Frontend Setup

```bash
# Navigate to project root
cd Cafes-20-main

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will run on:** `http://localhost:8080`

## 🔐 Login Credentials

### Admin Login
- URL: `http://localhost:8080/admin/login`
- Email: `admin@gmail.com`
- Password: `prashant123`

### User Login/Register
- URL: `http://localhost:8080/login`
- Create a new account or use existing credentials

## ✅ Verify Everything Works

### 1. Check Backend Health
Open browser: `http://localhost:5000/api/health`

Should see:
```json
{
  "success": true,
  "message": "The Himalayan Pizza API is running",
  "timestamp": "2024-...",
  "environment": "development"
}
```

### 2. Test Admin Login
1. Go to `http://localhost:8080/admin/login`
2. Enter credentials: `admin@gmail.com` / `prashant123`
3. Should redirect to admin dashboard

### 3. Test User Login
1. Go to `http://localhost:8080/login`
2. Click "Sign Up" tab
3. Create a new account
4. Should redirect to home page with user logged in

### 4. Test Settings (Admin)
1. Login as admin
2. Go to admin dashboard
3. Update restaurant settings (WhatsApp, hours, etc.)
4. Changes should save and reflect immediately

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if MongoDB is running
mongod --version

# Check if port 5000 is available
netstat -ano | findstr :5000

# Check server logs for errors
cd server
npm run dev
```

### Frontend won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear Vite cache
rm -rf node_modules/.vite

# Start again
npm run dev
```

### Login not working
1. Check browser console for errors
2. Verify backend is running on port 5000
3. Check Network tab in DevTools
4. Verify CORS is not blocking requests

### Settings not saving
1. Verify you're logged in as admin
2. Check browser console for errors
3. Verify MongoDB is running
4. Check backend logs for errors

## 📝 Available Routes

### Frontend Routes
- `/` - Home page
- `/login` - User login/register
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard
- `/menu` - Menu page
- `/gallery` - Gallery page
- `/offers` - Offers page
- `/contact` - Contact page
- `/our-story` - Our story page

### Backend API Routes
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User register
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/me` - Get current user
- `GET /api/settings` - Get settings (public)
- `PUT /api/settings` - Update settings (admin)
- `GET /api/health` - Health check

## 🎯 Next Steps

1. ✅ Backend is clean and production-ready
2. ✅ Frontend routing is fixed
3. ✅ Admin login works with hardcoded credentials
4. ✅ User login/register works
5. ✅ Settings can be updated by admin
6. ✅ CORS is configured for localhost:8080
7. ✅ No CSP issues in development

## 📚 Documentation

- Backend structure: `server/BACKEND_CLEAN_STRUCTURE.md`
- API documentation: See backend structure doc
- Frontend components: Check `client/components/`

## 🆘 Need Help?

Check the following files for detailed information:
- `server/BACKEND_CLEAN_STRUCTURE.md` - Complete backend documentation
- `server/.env.example` - Environment variable examples
- `server/README.md` - Server-specific documentation

## 🎉 You're Ready!

Your restaurant management system is now fully set up and ready for development!
