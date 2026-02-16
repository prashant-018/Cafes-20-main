# Quick Setup Guide

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings
# Required: MONGODB_URI, JWT_SECRET
```

### 3. Start Development Server
```bash
npm run dev
```

## ✅ Expected Output

When successful, you should see:
```
🍕 The Himalayan Pizza Backend API
=====================================
📍 Environment: development
🔌 Port: 5000
🗄️  Database: mongodb://localhost:27017/himalayan-pizza
=====================================

✅ Environment variables validated
✅ MongoDB Connected: localhost:27017
🚀 Server running on port 5000 in development mode
📍 Health check: http://localhost:5000/health
🔐 Auth endpoints: http://localhost:5000/api/auth
```

## 🔧 Troubleshooting

### ts-node-dev not found
```bash
npm install ts-node-dev --save-dev
```

### MongoDB connection issues
- Make sure MongoDB is running
- Check MONGODB_URI in .env
- Default: `mongodb://localhost:27017/himalayan-pizza`

### Port already in use
- Change PORT in .env
- Or kill process using port 5000

### Path resolution issues
```bash
npm install tsconfig-paths --save-dev
```

## 📡 Test Endpoints

### Health Check
```bash
curl http://localhost:5000/health
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'
```