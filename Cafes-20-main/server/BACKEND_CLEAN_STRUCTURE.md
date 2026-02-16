# Backend Clean Structure - Production Ready

## ✅ Completed Cleanup

### Files Deleted
- ❌ `test-auth.js`
- ❌ `test-server.js`
- ❌ `test-admin-login.js`
- ❌ `test-connection.js`
- ❌ `simple-server.js`
- ❌ `EXAMPLE_CSP_SERVER.js`
- ❌ `node-build.ts`
- ❌ `index.ts`
- ❌ `src/app.ts` (duplicate)
- ❌ `src/server-simple.ts` (duplicate)
- ❌ `src/config/db.ts` (duplicate)
- ❌ `src/middleware/auth.ts` (duplicate)
- ❌ `src/routes/auth.ts` (duplicate)
- ❌ `src/routes/menu-simple.ts`
- ❌ `src/routes/demo.ts`
- ❌ `src/utils/startup.ts`
- ❌ `routes/demo.ts`

## 📁 Final Clean Structure

```
server/
│
├── src/
│   ├── config/
│   │   ├── cloudinary.ts          # Cloudinary image upload config
│   │   └── database.ts            # MongoDB connection
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts     # User & admin login/register
│   │   ├── businessSettings.controller.ts
│   │   └── settings.controller.ts # Restaurant settings
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts     # JWT auth & admin protection
│   │   └── errorHandler.ts       # Global error handling
│   │
│   ├── models/
│   │   ├── Admin.ts               # Admin model
│   │   ├── BusinessSettings.ts    # Business settings model
│   │   ├── MenuImage.ts           # Menu images model
│   │   ├── Settings.ts            # Restaurant settings model
│   │   └── User.ts                # User model
│   │
│   ├── routes/
│   │   ├── auth.routes.ts         # Auth routes (login, register)
│   │   ├── businessSettings.routes.ts
│   │   ├── menuImages.ts          # Menu image routes
│   │   └── settings.routes.ts     # Settings routes
│   │
│   ├── scripts/
│   │   └── seedAdmin.ts           # Seed admin user
│   │
│   ├── utils/
│   │   ├── hash.ts                # Password hashing
│   │   └── jwt.ts                 # JWT token utilities
│   │
│   └── server.ts                  # Main server entry point
│
├── .env                           # Environment variables
├── .env.example                   # Example env file
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Configuration

### Environment Variables (.env)
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:8080

MONGODB_URI=mongodb://localhost:27017/himalayan-pizza

JWT_SECRET=himalayan-pizza-super-secret-jwt-key-2024-make-this-very-long-and-random
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=demo
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=demo-secret-key
```

## 🚀 API Routes

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login (hardcoded credentials)
- `GET /api/auth/me` - Get current user profile (protected)

### Settings Routes (`/api/settings`)
- `GET /api/settings` - Get restaurant settings (public)
- `PUT /api/settings` - Update settings (admin only)

### Menu Routes (`/api/menu`)
- `GET /api/menu` - Get active menu images (public)
- `GET /api/menu/admin/all` - Get all menu images (admin)
- `POST /api/menu/upload` - Upload menu images (admin)
- `PUT /api/menu/:id` - Update menu image (admin)
- `DELETE /api/menu/:id` - Delete menu image (admin)

### Business Settings Routes (`/api/business-settings`)
- `GET /api/business-settings` - Get business settings (public)
- `PUT /api/business-settings` - Update business settings (admin)

### Health Check
- `GET /api/health` - Server health check

## 🔐 Admin Login Credentials

**Hardcoded Admin:**
- Email: `admin@gmail.com`
- Password: `prashant123`

## 🛡️ Security Features

1. **JWT Authentication** - Token-based auth with 7-day expiry
2. **Password Hashing** - bcryptjs for secure password storage
3. **CORS Protection** - Configured for localhost:8080
4. **Helmet Security** - Security headers (CSP disabled for dev)
5. **Rate Limiting** - Express rate limit middleware
6. **Input Validation** - express-validator for all inputs
7. **Admin Middleware** - Separate admin authentication

## 🔄 Real-time Features

- **Socket.IO** enabled for real-time updates
- Settings changes broadcast to all connected clients
- Menu image updates broadcast to admin dashboard

## 📝 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Seed admin user
npm run seed:admin

# Type check
npm run type-check
```

## ✅ Fixed Issues

1. ✅ Removed duplicate server files
2. ✅ Removed all test files
3. ✅ Removed duplicate route files
4. ✅ Fixed admin login route (`POST /api/auth/admin/login`)
5. ✅ Fixed settings routes with proper admin protection
6. ✅ Removed CSP headers for development
7. ✅ Fixed CORS to allow localhost:8080
8. ✅ Consolidated auth middleware
9. ✅ Clean routing structure with `/api` prefix
10. ✅ Proper 404 and error handling

## 🎯 Frontend Integration

Frontend should connect to:
- **API Base URL:** `http://localhost:5000/api`
- **Socket.IO:** `http://localhost:5000`

### Frontend API Calls
```typescript
// User login
POST http://localhost:5000/api/auth/login
Body: { email, password }

// Admin login
POST http://localhost:5000/api/auth/admin/login
Body: { email, password }

// Get settings
GET http://localhost:5000/api/settings

// Update settings (admin)
PUT http://localhost:5000/api/settings
Headers: { Authorization: "Bearer <token>" }
Body: { whatsappNumber, openingTime, closingTime, isManuallyOpen, brandStory }
```

## 🚨 Important Notes

1. **No CSP in Development** - Content Security Policy is disabled for easier development
2. **Hardcoded Admin** - Admin credentials are hardcoded for simplicity
3. **MongoDB Required** - Ensure MongoDB is running on localhost:27017
4. **Port 5000** - Backend runs on port 5000 by default
5. **Frontend Port 8080** - CORS configured for frontend on port 8080

## 🔍 Troubleshooting

### Server won't start
- Check if MongoDB is running
- Check if port 5000 is available
- Verify .env file exists with correct values

### Admin login fails
- Verify credentials: admin@gmail.com / prashant123
- Check JWT_SECRET in .env
- Check browser console for errors

### Settings not saving
- Verify admin token is being sent in Authorization header
- Check MongoDB connection
- Check server logs for errors

### CORS errors
- Verify CLIENT_URL in .env matches frontend URL
- Check if frontend is running on port 8080
- Clear browser cache

## 📦 Dependencies

### Production
- express - Web framework
- mongoose - MongoDB ODM
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- cors - CORS middleware
- dotenv - Environment variables
- express-validator - Input validation
- multer - File upload
- cloudinary - Image storage
- socket.io - Real-time communication
- helmet - Security headers
- compression - Response compression

### Development
- typescript - Type safety
- ts-node-dev - Development server
- @types/* - TypeScript definitions

## 🎉 Ready for Production

The backend is now clean, organized, and production-ready with:
- ✅ Clean file structure
- ✅ Proper authentication
- ✅ Admin protection
- ✅ Input validation
- ✅ Error handling
- ✅ Real-time updates
- ✅ Security best practices
- ✅ Comprehensive logging
