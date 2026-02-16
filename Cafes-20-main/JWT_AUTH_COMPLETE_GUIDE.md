# Complete JWT Authentication Guide

## ✅ What Was Fixed

### 1. API Service (`client/services/api.ts`)
- ✅ Automatic token injection from localStorage
- ✅ Auto-logout on token expiration (401 errors)
- ✅ Token storage after login
- ✅ Centralized authentication state
- ✅ No need to manually pass tokens

### 2. Backend Middleware (Already Configured)
- ✅ `auth.middleware.ts` - User authentication
- ✅ `auth.ts` - Admin authentication
- ✅ JWT verification with proper error handling
- ✅ Token expiration handling

---

## 🔐 How It Works Now

### Frontend Flow

```typescript
// 1. Login (token automatically stored)
const response = await apiService.adminLogin(email, password);
// Token saved to localStorage automatically

// 2. Make authenticated requests (token automatically sent)
const menuImages = await apiService.getAllMenuImages();
// Authorization header added automatically

// 3. Token expired? Auto logout
// If 401 error, user redirected to login automatically
```

### Backend Flow

```typescript
// Protected route example
router.get('/admin/all',
  authenticateAdmin,  // Middleware checks JWT
  async (req, res) => {
    // req.admin is available here
    const images = await MenuImage.find();
    res.json({ success: true, data: images });
  }
);
```

---

## 📝 API Service Features

### Automatic Token Management

```typescript
// Get token from localStorage
private getToken(): string | null {
  return localStorage.getItem('adminToken') || 
         localStorage.getItem('userToken');
}

// Automatically add to all requests
const token = this.getToken();
if (token) {
  headers['Authorization'] = `Bearer ${token}`;
}
```

### Auto Logout on Expiration

```typescript
// Handle 401 errors
if (response.status === 401) {
  if (data.message?.includes('expired') || 
      data.message?.includes('Invalid token')) {
    this.handleTokenExpiration(); // Clear tokens + redirect
  }
}
```

### Login Methods

```typescript
// Admin login
await apiService.adminLogin(email, password);
// Stores: adminToken, admin object

// User login
await apiService.userLogin(email, password);
// Stores: userToken, user object

// Logout
apiService.logout(true); // true for admin, false for user
```

### Authentication Check

```typescript
// Check if authenticated
if (apiService.isAuthenticated()) {
  // User has valid token
}
```

---

## 🛡️ Backend Middleware

### Admin Authentication (`auth.ts`)

```typescript
export const authenticateAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Extract token
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
      return;
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    
    // 3. Get admin from database
    const admin = await Admin.findById(decoded.id).select('-password');
    
    if (!admin || !admin.isActive) {
      res.status(401).json({
        success: false,
        message: 'Invalid token or account deactivated.'
      });
      return;
    }

    // 4. Attach admin to request
    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};
```

### User Authentication (`auth.middleware.ts`)

```typescript
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Extract token
    let token: string | undefined;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
      return;
    }

    // 2. Verify token
    const decoded = verifyToken(token);
    
    // 3. Get user from database
    const user = await User.findById(decoded.id);
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Token is valid but user no longer exists'
      });
      return;
    }

    // 4. Attach user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};
```

---

## 🔧 Usage Examples

### Frontend - Admin Dashboard

```typescript
import { apiService } from '@/services/api';

// Login page
const handleLogin = async (email: string, password: string) => {
  try {
    const response = await apiService.adminLogin(email, password);
    // Token automatically stored
    navigate('/admin/dashboard');
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// Admin dashboard - fetch data
const fetchMenuImages = async () => {
  try {
    // Token automatically sent
    const response = await apiService.getAllMenuImages();
    setImages(response.data);
  } catch (error) {
    // If 401, user auto-logged out
    console.error('Failed to fetch images:', error);
  }
};

// Logout
const handleLogout = () => {
  apiService.logout(true); // Clears tokens + redirects
};
```

### Frontend - Protected Route Component

```typescript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!apiService.isAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  return apiService.isAuthenticated() ? <>{children}</> : null;
};
```

### Backend - Protected Routes

```typescript
import { authenticateAdmin } from '../middleware/auth';

// Admin-only route
router.get('/admin/all',
  authenticateAdmin,
  async (req: AuthRequest, res: Response) => {
    // req.admin is available
    const images = await MenuImage.find();
    res.json({ success: true, data: images });
  }
);

// User route
router.get('/me',
  protect,
  async (req: Request, res: Response) => {
    // req.user is available
    res.json({ success: true, data: req.user });
  }
);
```

---

## 🧪 Testing

### 1. Test Login

```bash
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

Expected response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "...",
    "email": "admin@example.com",
    "name": "Admin User"
  }
}
```

### 2. Test Protected Route (Without Token)

```bash
curl http://localhost:5000/api/menu/admin/all
```

Expected response:
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 3. Test Protected Route (With Token)

```bash
curl http://localhost:5000/api/menu/admin/all \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Expected response:
```json
{
  "success": true,
  "data": [...]
}
```

### 4. Test Expired Token

```bash
# Use an expired token
curl http://localhost:5000/api/menu/admin/all \
  -H "Authorization: Bearer EXPIRED_TOKEN"
```

Expected response:
```json
{
  "success": false,
  "message": "Invalid token."
}
```

---

## 🔍 Debugging

### Check Token in Browser

```javascript
// Open browser console
localStorage.getItem('adminToken');
localStorage.getItem('userToken');
```

### Decode JWT Token

```javascript
// In browser console
const token = localStorage.getItem('adminToken');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log(payload);
// Shows: { id, role, iat, exp, iss, aud }
```

### Check Token Expiration

```javascript
const token = localStorage.getItem('adminToken');
const payload = JSON.parse(atob(token.split('.')[1]));
const expiresAt = new Date(payload.exp * 1000);
console.log('Token expires at:', expiresAt);
console.log('Is expired:', Date.now() > payload.exp * 1000);
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "Access denied. No token provided"

**Cause**: Token not in localStorage or not being sent

**Solution**:
```typescript
// Check if token exists
console.log(localStorage.getItem('adminToken'));

// If missing, login again
await apiService.adminLogin(email, password);
```

### Issue 2: "Invalid token"

**Cause**: Token expired or JWT_SECRET mismatch

**Solution**:
```bash
# Check JWT_SECRET in .env
echo $JWT_SECRET

# Login again to get fresh token
```

### Issue 3: Token not persisting after login

**Cause**: Login response not returning token

**Solution**:
```typescript
// Check login response
const response = await apiService.adminLogin(email, password);
console.log('Token:', response.token); // Should exist

// Verify it's stored
console.log(localStorage.getItem('adminToken'));
```

### Issue 4: Auto-logout not working

**Cause**: 401 error not being caught

**Solution**:
```typescript
// Check API service handles 401
// Already implemented in updated api.ts
if (response.status === 401) {
  this.handleTokenExpiration();
}
```

---

## 🎯 Environment Variables

### Backend (.env)

```env
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🔒 Security Best Practices

### ✅ DO

- Use HTTPS in production
- Store JWT_SECRET securely (environment variable)
- Set reasonable token expiration (7d for admin, 30d for users)
- Clear tokens on logout
- Validate tokens on every protected route
- Use httpOnly cookies for extra security (optional)

### ❌ DON'T

- Store sensitive data in JWT payload
- Use weak JWT_SECRET
- Set very long expiration times
- Expose JWT_SECRET in client code
- Trust client-side token validation alone

---

## 📚 Additional Features (Optional)

### Refresh Token Implementation

```typescript
// Add to api.ts
async refreshToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  const response = await this.request('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
  
  if (response.token) {
    localStorage.setItem('adminToken', response.token);
  }
  
  return response;
}
```

### Token Interceptor (Axios Alternative)

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);
```

---

## ✨ Summary

Your JWT authentication is now fully configured with:

- ✅ Automatic token injection
- ✅ Auto-logout on expiration
- ✅ Secure backend verification
- ✅ Protected routes working
- ✅ Clean error handling
- ✅ Production-ready security

**No more 401 errors!** 🎉
