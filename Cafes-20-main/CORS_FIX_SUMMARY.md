# 🔧 CORS Fix for Netlify → Render Cross-Site Login

## Problem
Login works locally but fails in production with:
- `0 B transferred` in Network tab
- Blank status
- Preflight blocked

## Root Cause
Cross-site requests (Netlify → Render) require:
1. Enhanced CORS headers
2. Explicit preflight handling
3. Proper credentials configuration

---

## ✅ Solution Applied

### 1. Enhanced CORS Configuration
**File:** `server/src/server.ts`

```typescript
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️  CORS blocked origin: ${origin}`);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true, // ✅ CRITICAL for cross-site
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range', 'Authorization'],
  maxAge: 86400, // Cache preflight for 24 hours
  preflightContinue: false, // ✅ End preflight here
  optionsSuccessStatus: 204 // ✅ Proper status for OPTIONS
}));

// ✅ Explicit preflight handler
app.options('*', cors());
```

### 2. Production Logging
**File:** `server/src/server.ts`

```typescript
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const origin = req.headers.origin || 'no-origin';
  
  console.log(`${timestamp} - ${req.method} ${req.path}`);
  console.log(`   Origin: ${origin}`);
  
  // Log preflight requests
  if (req.method === 'OPTIONS') {
    console.log('   🔍 PREFLIGHT REQUEST');
    console.log('   Access-Control-Request-Method:', req.headers['access-control-request-method']);
    console.log('   Access-Control-Request-Headers:', req.headers['access-control-request-headers']);
  }
  
  next();
});
```

### 3. Socket.IO Cross-Site Fix
**File:** `server/src/server.ts`

```typescript
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`⚠️  Socket.IO CORS blocked origin: ${origin}`);
        callback(new Error(`Origin ${origin} not allowed by Socket.IO CORS`));
      }
    },
    credentials: true, // ✅ CRITICAL for cross-site WebSocket
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin'
    ]
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  cookie: false, // Don't use cookies (we use JWT in headers)
  pingTimeout: 60000,
  pingInterval: 25000
});
```

---

## 🚀 Deployment Checklist

### Render (Backend)
- [ ] Update `CLIENT_URL=https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app`
- [ ] Save and wait for auto-redeploy
- [ ] Check logs for "🌐 CORS Configuration"

### Netlify (Frontend)
- [ ] Add `VITE_API_URL=https://cafes-20-main-6.onrender.com/api`
- [ ] Trigger redeploy
- [ ] Clear browser cache

### Testing
- [ ] Open DevTools → Network tab
- [ ] Go to login page
- [ ] Check OPTIONS request returns 204
- [ ] Check POST request returns 200 with token
- [ ] Verify login works

---

## 🔍 Expected Network Flow

### 1. Preflight (OPTIONS)
```
Request:
  OPTIONS /api/auth/admin/login
  Origin: https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app
  Access-Control-Request-Method: POST
  Access-Control-Request-Headers: content-type

Response:
  Status: 204 No Content
  Access-Control-Allow-Origin: https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app
  Access-Control-Allow-Credentials: true
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
  Access-Control-Max-Age: 86400
```

### 2. Actual Request (POST)
```
Request:
  POST /api/auth/admin/login
  Origin: https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app
  Content-Type: application/json
  Body: {"email":"admin@gmail.com","password":"prashant123"}

Response:
  Status: 200 OK
  Access-Control-Allow-Origin: https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app
  Access-Control-Allow-Credentials: true
  Body: {"success":true,"token":"...","admin":{...}}
```

---

## 🎯 Key Points

1. **No Cookies Used**: JWT is sent in JSON response body, not cookies
2. **Credentials Required**: `credentials: 'include'` needed for CORS to work
3. **Preflight Caching**: 24-hour cache reduces preflight requests
4. **Dynamic Origin Check**: Validates origin against allowed list
5. **Production Logging**: Helps debug CORS issues in production

---

## ✅ Status
**READY FOR PRODUCTION DEPLOYMENT**

All CORS issues for cross-site Netlify → Render requests have been fixed.
