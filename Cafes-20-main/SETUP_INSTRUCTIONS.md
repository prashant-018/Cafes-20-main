# 🍕 Himalayan Pizza - Setup Instructions

## Project Structure (MERN Monorepo)

```
Cafes-20-main/
├── client/          # React + Vite Frontend
├── server/          # Node + Express Backend
├── .env.example     # Environment variables template
└── .gitignore       # Git ignore configuration
```

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- Git

## 🚀 Setup Steps

### 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd Cafes-20-main
```

### 2️⃣ Environment Variables Setup

#### Root Level
```bash
cp .env.example .env
# Edit .env and add your actual values
```

#### Server Level
```bash
cd server
cp .env.example .env
# Edit server/.env and add:
# - MongoDB connection string
# - JWT secret key
# - Other API keys
```

#### Client Level (if needed)
```bash
cd client
# Create .env if needed for Vite environment variables
```

### 3️⃣ Install Dependencies

#### Install all dependencies (from root)
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4️⃣ MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get connection string and add to `.env`

Example connection string:
```
mongodb+srv://username:password@cluster.mongodb.net/himalayan-pizza?retryWrites=true&w=majority
```

### 5️⃣ Generate JWT Secret

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Add generated secret to `.env` file:
```
JWT_SECRET=your-generated-secret-here
```

### 6️⃣ Run Development Servers

#### Terminal 1 - Backend Server
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

#### Terminal 2 - Frontend Server
```bash
cd client
npm run dev
# Client runs on http://localhost:8080
```

## 🔐 Admin Login Credentials

Default admin credentials (change in production):
```
Email: admin@gmail.com
Password: prashant123
```

## 📁 Important Files to Configure

### `.env` (Root Level)
```env
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
CLIENT_URL=http://localhost:8080
```

### `server/.env`
```env
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
```

## 🛠️ Common Issues & Solutions

### Issue 1: MongoDB Connection Failed
**Solution:** 
- Check if IP is whitelisted in MongoDB Atlas
- Verify connection string is correct
- Ensure network connectivity

### Issue 2: Port Already in Use
**Solution:**
```bash
# Kill process on port 5000 (Backend)
npx kill-port 5000

# Kill process on port 8080 (Frontend)
npx kill-port 8080
```

### Issue 3: Module Not Found
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📦 Deployment

### Backend (Render/Railway/Heroku)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Add environment variables in platform settings
4. Deploy

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy

## 🔒 Security Checklist

- [ ] `.env` files are in `.gitignore`
- [ ] Strong JWT secret generated
- [ ] MongoDB user has limited permissions
- [ ] IP whitelist configured in MongoDB Atlas
- [ ] Admin password changed from default
- [ ] CORS configured properly
- [ ] Rate limiting enabled (if needed)

## 📞 Support

For issues or questions, contact the development team.

---

**Happy Coding! 🚀**
