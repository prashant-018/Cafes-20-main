# 🔧 CORS Configuration Reference

## Complete Working Configuration

### Environment Variables (Render)
```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app
MONGODB_URI=mongodb+srv://...
JWT_SECRET=himalayan-pizza-super-secret-jwt-key-2024-make-this-very-long-and-random
JWT_EXPIRES_IN=7d
```

---

## Server Configuration (`server/src/server.ts`)

### 1. Environment Loading
```typescript
import 'dotenv/config'; // ✅ FIRST LINE - loads .env

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

console.log('🔧 Environment Variables Loaded:');
console.log('   NODE_ENV:', NODE_ENV);
console.log('   PORT:', PORT);
console.log('   CLIENT_URL:', CLIENT_URL);
```

### 2. Dynamic Allowed Origins
```typescript
const getAllowedOrigins = (): string[] => {
  const origins: string[] = [];

  // ✅ ALWAYS add CLIENT_URL (production or development)
  if (CLIENT_URL) {
    origins.push(CLIENT_URL);
    console.log('   ✅ Added CLIENT_URL to allowed origins:', CLIENT_URL);
  }

  // ✅ In development, ALSO allow localhost
  if (NODE_ENV === 'development') {
    const devOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:8080',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:8080'
    ];
    origins.push(...devOrigins);
    console.log('   ✅ Added development origins');
  }

  // Remove duplicates and empty strings
  const uniqueOrigins = [...new Set(origins.filter(Boolean))];
  console.log('   📋 Final allowed origins:', uniqueOrigins);
  
  return uniqueOrigins;
};

const allowedOrigins = getAllowedOrigins();
```

### 3. Socket.IO CORS
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
    credentials: true,
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
  cookie: false,
  pingTimeout: 60000,
  pingInterval: 25000
});
```

### 4. Express CORS Middleware
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
  credentials: true,
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
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.options('*', cors());
```

### 5. Middleware Order
```typescript
// ✅ CORRECT ORDER:
1. import 'dotenv/config'           // Load environment
2. helmet()                         // Security headers
3. compression()                    // Compress responses
4. cors()                           // CORS (before routes!)
5. app.options('*', cors())         // Preflight handler
6. express.json()                   // Body parser
7. express.urlencoded()             // URL parser
8. express.static()                 // Static files
9. Request logging middleware       // Logging
10. Routes (app.use('/api/...'))    // API routes
11. notFound()                      // 404 handler
12. errorHandler()                  // Error handler (last!)
```

### 6. Health Check Endpoint
```typescript
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'The Himalayan Pizza API is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    cors: {
      allowedOrigins: allowedOrigins  // ✅ Shows current CORS config
    }
  });
});
```

---

## Frontend Configuration

### Environment Variables (Netlify)
```env
VITE_API_URL=https://cafes-20-main-6.onrender.com/api
```

### API Service (`client/services/api.ts`)
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  'https://cafes-20-main-6.onrender.com/api';

async request<T>(endpoint: string, options: RequestInit = {}) {
  const config: RequestInit = {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : undefined
    },
    credentials: 'include' // ✅ CRITICAL for CORS
  };
  
  return fetch(`${API_BASE_URL}${endpoint}`, config);
}
```

### Socket.IO Client (`client/services/socket.ts`)
```typescript
const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 
  'https://cafes-20-main-6.onrender.com';

const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  withCredentials: true, // ✅ CRITICAL for CORS
  timeout: 20000,
  reconnection: true
});
```

---

## Verification Commands

### Check Environment Variable
```bash
# In Render Dashboard → Environment
CLIENT_URL=https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app
```

### Test Health Endpoint
```bash
curl https://cafes-20-main-6.onrender.com/api/health | jq '.cors'
```

Expected:
```json
{
  "allowedOrigins": [
    "https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app"
  ]
}
```

### Test CORS from Browser
```javascript
// Run in Netlify site console
fetch('https://cafes-20-main-6.onrender.com/api/health', {
  credentials: 'include'
})
.then(r => r.json())
.then(d => console.log('CORS:', d.cors))
```

### Test Login
```bash
curl -X POST https://cafes-20-main-6.onrender.com/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app" \
  -d '{"email":"admin@gmail.com","password":"prashant123"}' \
  -v
```

Look for:
```
< HTTP/2 200
< access-control-allow-origin: https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app
< access-control-allow-credentials: true
```

---

## Key Points

1. **dotenv MUST be first import**: `import 'dotenv/config'`
2. **CLIENT_URL is dynamic**: Set via environment variable
3. **Development includes localhost**: Automatically added in dev mode
4. **Production is strict**: Only CLIENT_URL allowed
5. **credentials: true**: Required for cross-site requests
6. **No wildcards**: Never use "*" in production
7. **Health endpoint**: Shows current CORS configuration
8. **Logging**: Startup logs show what origins are allowed

---

## Common Issues

### Issue: Health shows localhost in production
**Fix:** Update CLIENT_URL in Render Dashboard

### Issue: CORS still blocking
**Fix:** Verify CLIENT_URL matches Netlify URL exactly (no trailing slash)

### Issue: Environment variable not loading
**Fix:** Check `import 'dotenv/config'` is first line

### Issue: Preflight fails
**Fix:** Ensure `app.options('*', cors())` is before routes

---

**This is the complete, production-ready CORS configuration.** ✅
