# 🚀 Himalayan Pizza Backend Setup

Complete real-time backend system for restaurant admin dashboard with instant updates.

## 📋 Features

### 🔧 Backend Features
- **Multiple Menu Images**: Upload, view, delete multiple menu images
- **Real-time Updates**: Socket.IO for instant updates across admin and user sites
- **Secure Authentication**: JWT-based admin authentication
- **Cloud Storage**: Cloudinary integration for image storage
- **Production Ready**: Error handling, validation, rate limiting

### 🎯 API Endpoints
```
POST /api/menu/upload     → Upload new menu images
GET  /api/menu           → Fetch all menu images (public)
DELETE /api/menu/:id     → Delete specific menu image
PUT  /api/menu/:id       → Update menu image metadata
GET  /api/menu/admin/all → Get all images (admin only)

POST /api/auth/login     → Admin login
GET  /api/auth/me        → Get admin profile
PUT  /api/auth/profile   → Update admin profile
```

## 🛠️ Installation

### 1. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies (if not already done)
cd ../
npm install
```

### 2. Environment Setup

#### Server Environment (.env)
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/himalayan-pizza

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Admin Configuration
ADMIN_EMAIL=admin@himalayan-pizza.com
ADMIN_PASSWORD=admin123456
ADMIN_NAME=Restaurant Admin
```

#### Client Environment (.env)
```bash
# In root directory
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Database Setup

#### Install MongoDB
- **Windows**: Download from [MongoDB Official Site](https://www.mongodb.com/try/download/community)
- **macOS**: `brew install mongodb-community`
- **Linux**: Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

#### Start MongoDB
```bash
# Windows (if installed as service)
net start MongoDB

# macOS/Linux
mongod

# Or using brew (macOS)
brew services start mongodb-community
```

### 4. Cloudinary Setup

1. Create account at [Cloudinary](https://cloudinary.com/)
2. Get your credentials from Dashboard
3. Add to `server/.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

### 5. Create Admin User

```bash
cd server
npm run seed:admin
```

This creates an admin user with credentials from `.env` file.

## 🚀 Running the Application

### Development Mode

#### Terminal 1: Start Backend
```bash
cd server
npm run dev
```

#### Terminal 2: Start Frontend
```bash
# In root directory
npm run dev
```

### Production Mode

#### Build and Start Backend
```bash
cd server
npm run build
npm start
```

#### Build and Serve Frontend
```bash
npm run build
npm run preview
```

## 📡 Real-time Features

### Socket.IO Events
- **Connection**: Automatic connection on page load
- **Menu Updates**: Real-time updates when images are added/deleted
- **Admin/User Rooms**: Separate channels for admin and user updates

### Frontend Integration
```typescript
// Automatic real-time updates
const { images, uploadImages, deleteImage } = useMenuImages(true);

// Images automatically update when other admins make changes
// No manual refresh needed
```

## 🔐 Authentication

### Admin Login
```bash
# Default credentials (change after first login)
Email: admin@himalayan-pizza.com
Password: admin123456
```

### API Authentication
```typescript
// Automatic token handling
const token = localStorage.getItem('adminToken');
// Token automatically added to requests
```

## 📱 Usage Examples

### Upload Multiple Images
```typescript
const files = event.target.files;
await uploadImages(files);
// Real-time update sent to all connected clients
```

### Delete Image
```typescript
await deleteImage(imageId);
// Image removed from Cloudinary and database
// Real-time update sent to all connected clients
```

### User Website Integration
```typescript
// Public endpoint - no authentication required
const { images } = useMenuImages(false);
// Automatically receives real-time updates
```

## 🛡️ Security Features

- **JWT Authentication**: Secure admin routes
- **Rate Limiting**: Prevent brute force attacks
- **File Validation**: Size and type restrictions
- **CORS Configuration**: Secure cross-origin requests
- **Helmet**: Security headers
- **Input Validation**: Express-validator for all inputs

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Logs
- Server logs all requests and errors
- Socket.IO connection logs
- Database connection status

## 🔧 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB service
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
```

#### 2. Cloudinary Upload Fails
- Verify credentials in `.env`
- Check internet connection
- Ensure file size < 5MB

#### 3. Socket.IO Not Connecting
- Check CORS configuration
- Verify CLIENT_URL in server `.env`
- Check firewall settings

#### 4. JWT Token Issues
- Check JWT_SECRET in `.env`
- Clear localStorage and login again
- Verify token expiration

### Debug Mode
```bash
# Enable debug logs
DEBUG=* npm run dev
```

## 🚀 Deployment

### Environment Variables
Set all production environment variables:
- `NODE_ENV=production`
- `MONGODB_URI` (MongoDB Atlas or production DB)
- `CLIENT_URL` (production frontend URL)
- Strong `JWT_SECRET`
- Production Cloudinary credentials

### Build Process
```bash
# Backend
cd server
npm run build

# Frontend
npm run build
```

## 📈 Performance

- **Image Optimization**: Cloudinary auto-optimization
- **Compression**: Gzip compression enabled
- **Caching**: Proper cache headers
- **Database Indexing**: Optimized queries
- **Connection Pooling**: MongoDB connection pooling

## 🎯 Next Steps

1. **Setup Environment**: Follow installation steps
2. **Test Upload**: Upload a menu image in admin dashboard
3. **Verify Real-time**: Open user website and see instant updates
4. **Customize**: Modify according to your needs

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review server logs
3. Verify environment configuration
4. Test API endpoints directly

---

**🎉 Your restaurant admin dashboard is now ready with real-time backend support!**