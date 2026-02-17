# 🔧 Vite Environment Variables Configuration

## Complete Guide for API Base URL Configuration

This guide shows how to properly configure environment variables in Vite to avoid 503 errors from relative API paths.

---

## ❌ Problem: Relative Paths Cause 503 Errors

### What Happens
```typescript
// ❌ BAD: Relative path
fetch("/api/settings")
```

When deployed on Netlify, this becomes:
```
https://cafee2015.netlify.app/api/settings  ❌
```

Netlify tries to serve this route, but it doesn't exist → **503 Error**

### What Should Happen
```typescript
// ✅ GOOD: Absolute URL
fetch("https://cafes-20-main-6.onrender.com/api/settings")
```

This goes directly to your Render backend → **200 Success**

---

## ✅ Solution: Environment Variables

### 1. Environment Files Structure

```
client/
├── .env                    # Default (fallback)
├── .env.development        # Local development
├── .env.production         # Production build
└── .env.example            # Template (commit to git)
```

### 2. File Contents

#### `.env` (Default/Fallback)
```env
# =========================
# DEFAULT ENVIRONMENT
# =========================

# Backend API URL - Production (Render)
VITE_API_URL=https://cafes-20-main-6.onrender.com/api
```

#### `.env.development` (Local Development)
```env
# =========================
# DEVELOPMENT ENVIRONMENT
# =========================

# Backend API URL - Local Development
VITE_API_URL=http://localhost:5000/api
```

#### `.env.production` (Production Build)
```env
# =========================
# PRODUCTION ENVIRONMENT
# =========================

# Backend API URL - Production (Render)
VITE_API_URL=https://cafes-20-main-6.onrender.com/api
```

#### `.env.example` (Template for Git)
```env
# =========================
# ENVIRONMENT VARIABLES TEMPLATE
# =========================

# Backend API URL
# Development: http://localhost:5000/api
# Production:  https://cafes-20-main-6.onrender.com/api
VITE_API_URL=
```

### 3. .gitignore Configuration

```gitignore
# Environment variables
.env
.env.local
.env.development.local
.env.production.local

# Keep example file
!.env.example
!.env.development
!.env.production
```

---

## 📝 Code Implementation

### 1. API Service (`services/api.ts`)

```typescript
// ✅ CORRECT: Use environment variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://cafes-20-main-6.onrender.com/api';

// Log configuration in development
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:');
  console.log('   Base URL:', API_BASE_URL);
  console.log('   Mode:', import.meta.env.MODE);
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // ✅ CORRECT: Construct full URL
    const url = `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // Important for CORS
    });

    return response.json();
  }

  // Example: Get settings
  async getSettings() {
    // ✅ CORRECT: Endpoint starts with /
    return this.request('/settings', { method: 'GET' });
  }

  // Example: Update settings
  async updateSettings(data: any) {
    return this.request('/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();
export default apiService;
```

### 2. Socket.IO Service (`services/socket.ts`)

```typescript
import { io, Socket } from 'socket.io-client';

// ✅ CORRECT: Derive Socket URL from API URL
const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://cafes-20-main-6.onrender.com';

// Log configuration in development
if (import.meta.env.DEV) {
  console.log('🔌 Socket.IO Configuration:');
  console.log('   URL:', SOCKET_URL);
  console.log('   Mode:', import.meta.env.MODE);
}

class SocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    // ✅ CORRECT: Use environment-based URL
    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true, // Important for CORS
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    return this.socket;
  }

  // ... rest of your socket methods
}

export const socketService = new SocketService();
export default socketService;
```

### 3. Custom Hooks (`hooks/useSettings.ts`)

```typescript
import { useState, useEffect } from 'react';
import apiService from '../services/api';

// ✅ CORRECT: Use apiService (which uses environment variable)
export const useSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        // ✅ CORRECT: Use apiService
        const data = await apiService.getSettings();
        setSettings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
};
```

### 4. React Components

```typescript
import { useState } from 'react';
import apiService from '../services/api';

export const SettingsForm = () => {
  const [settings, setSettings] = useState({
    whatsappNumber: '',
    openingTime: '',
    closingTime: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // ✅ CORRECT: Use apiService
      const response = await apiService.updateSettings(settings);
      console.log('Settings updated:', response);
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
};
```

---

## 🚀 How It Works

### Development (Local)
```
1. Run: npm run dev
2. Vite loads: .env.development
3. VITE_API_URL = http://localhost:5000/api
4. API calls go to: http://localhost:5000/api/settings ✅
```

### Production (Netlify)
```
1. Run: npm run build
2. Vite loads: .env.production or Netlify env vars
3. VITE_API_URL = https://cafes-20-main-6.onrender.com/api
4. API calls go to: https://cafes-20-main-6.onrender.com/api/settings ✅
```

---

## 🔍 Debugging

### Check Environment Variable

```typescript
// Add this to your component
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('Mode:', import.meta.env.MODE);
console.log('Dev:', import.meta.env.DEV);
console.log('Prod:', import.meta.env.PROD);
```

### Expected Output (Development)
```
VITE_API_URL: http://localhost:5000/api
Mode: development
Dev: true
Prod: false
```

### Expected Output (Production)
```
VITE_API_URL: https://cafes-20-main-6.onrender.com/api
Mode: production
Dev: false
Prod: true
```

### Check Network Tab

Open DevTools → Network tab:

**❌ Wrong (503 Error):**
```
Request URL: https://cafee2015.netlify.app/api/settings
Status: 503 Service Unavailable
```

**✅ Correct (200 Success):**
```
Request URL: https://cafes-20-main-6.onrender.com/api/settings
Status: 200 OK
```

---

## 🔧 Netlify Configuration

### Option 1: Use .env.production (Recommended)

Your `.env.production` file is already committed to git, so Netlify will use it automatically.

### Option 2: Netlify Dashboard

If you want to override `.env.production`:

1. Go to: Site settings → Environment variables
2. Add:
   ```
   Key:   VITE_API_URL
   Value: https://cafes-20-main-6.onrender.com/api
   ```
3. Redeploy

**Priority:**
```
Netlify Dashboard > .env.production > .env
```

---

## ✅ Checklist

### Environment Files
- [ ] `.env` exists with production URL
- [ ] `.env.development` exists with localhost URL
- [ ] `.env.production` exists with production URL
- [ ] `.env.example` exists (template)
- [ ] `.gitignore` configured correctly

### Code
- [ ] API service uses `import.meta.env.VITE_API_URL`
- [ ] Socket service uses `import.meta.env.VITE_API_URL`
- [ ] All fetch calls use apiService (not relative paths)
- [ ] All endpoints start with `/` (e.g., `/settings`)
- [ ] `credentials: 'include'` in fetch options

### Testing
- [ ] Local dev works: `npm run dev`
- [ ] Production build works: `npm run build`
- [ ] Network tab shows correct URLs
- [ ] No 503 errors
- [ ] CORS works

---

## 🎯 Common Mistakes

### ❌ Mistake 1: Wrong Prefix
```env
# ❌ WRONG: Missing VITE_ prefix
API_URL=https://cafes-20-main-6.onrender.com/api

# ✅ CORRECT: Has VITE_ prefix
VITE_API_URL=https://cafes-20-main-6.onrender.com/api
```

Vite only exposes variables with `VITE_` prefix!

### ❌ Mistake 2: Relative Paths
```typescript
// ❌ WRONG: Relative path
fetch("/api/settings")

// ✅ CORRECT: Use apiService
apiService.request("/settings")
```

### ❌ Mistake 3: Hardcoded URLs
```typescript
// ❌ WRONG: Hardcoded URL
fetch("https://cafes-20-main-6.onrender.com/api/settings")

// ✅ CORRECT: Use environment variable
const url = `${import.meta.env.VITE_API_URL}/settings`;
fetch(url)
```

### ❌ Mistake 4: Missing Credentials
```typescript
// ❌ WRONG: No credentials
fetch(url)

// ✅ CORRECT: Include credentials for CORS
fetch(url, { credentials: 'include' })
```

---

## 📚 Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [CORS with Credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#requests_with_credentials)

---

**Status: PRODUCTION READY** ✅

Your environment variables are properly configured!
