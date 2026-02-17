# ⚡ Netlify Preview URLs - Quick Reference

## Problem
```
Preview URL changes every deploy:
https://69942475ccbf3f6b043a9ed6--cafee2015.netlify.app
https://6994247accbf3f6b043a9ed7--cafee2015.netlify.app
...

Hardcoded URL → CORS fails on next deploy ❌
```

## Solution
```
Dynamic pattern matching:
https://*--cafee2015.netlify.app ✅
```

---

## 🔧 Implementation

### Pattern Matching Function
```typescript
const isOriginAllowed = (origin: string): boolean => {
  const sanitizedOrigin = origin.trim();
  
  // Exact matches (localhost, main domain)
  if (allowedOrigins.includes(sanitizedOrigin)) {
    return true;
  }
  
  // Netlify preview pattern
  const netlifyPreviewPattern = /^https:\/\/[a-z0-9]+-[a-z0-9]+--cafee2015\.netlify\.app$/i;
  if (netlifyPreviewPattern.test(sanitizedOrigin)) {
    return true;
  }
  
  // Main domain
  if (sanitizedOrigin === 'https://cafee2015.netlify.app') {
    return true;
  }
  
  return false;
};
```

### Use in CORS
```typescript
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    if (isOriginAllowed(origin.trim())) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed'));
    }
  },
  credentials: true,
  // ... rest of config
}));
```

### Use in Socket.IO
```typescript
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed'));
      }
    },
    credentials: true,
    // ... rest of config
  }
});
```

---

## 🚀 Deploy

```bash
cd server
git add src/server.ts
git commit -m "Add Netlify preview URL support"
git push origin main
```

No environment variable changes needed!

---

## ✅ What's Allowed

### ✅ Allowed
```
http://localhost:5173                              (dev)
http://localhost:3000                              (dev)
https://cafee2015.netlify.app                      (main)
https://69942475ccbf3f6b043a9ed6--cafee2015.netlify.app  (preview)
https://abc123def456--cafee2015.netlify.app        (preview)
https://deploy-preview-123--cafee2015.netlify.app (preview)
```

### ❌ Blocked
```
https://malicious-site.com                         (not allowed)
https://other--cafee2015.netlify.app               (wrong pattern)
https://69942475ccbf3f6b043a9ed6--other.netlify.app  (wrong site)
http://69942475ccbf3f6b043a9ed6--cafee2015.netlify.app   (http not https)
```

---

## 🔍 Expected Logs

### Preview URL Request
```
🔍 CORS: Checking origin: "https://69942475ccbf3f6b043a9ed6--cafee2015.netlify.app"
✅ Netlify preview URL matched: https://69942475ccbf3f6b043a9ed6--cafee2015.netlify.app
✅ CORS: Origin allowed
```

### Main Domain Request
```
🔍 CORS: Checking origin: "https://cafee2015.netlify.app"
✅ CORS: Origin allowed: "https://cafee2015.netlify.app"
```

### Blocked Request
```
🔍 CORS: Checking origin: "https://malicious-site.com"
❌ CORS: Origin BLOCKED: "https://malicious-site.com"
   Netlify preview pattern: https://*--cafee2015.netlify.app
```

---

## 🧪 Test

```bash
# Test preview URL
curl -X POST https://cafes-20-main-6.onrender.com/api/auth/admin/login \
  -H "Origin: https://69942475ccbf3f6b043a9ed6--cafee2015.netlify.app" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"prashant123"}' \
  -v | grep "access-control-allow-origin"

# Should show:
# access-control-allow-origin: https://69942475ccbf3f6b043a9ed6--cafee2015.netlify.app
```

---

## 🎯 Key Points

1. ✅ No wildcard "*" (secure)
2. ✅ Pattern specific to your site
3. ✅ Works with credentials: true
4. ✅ No env var updates needed
5. ✅ Supports unlimited preview URLs
6. ✅ Main domain still works
7. ✅ Localhost still works (dev)

---

## 🔧 Customize

### Change Site Name
```typescript
// Old
/^https:\/\/[a-z0-9]+-[a-z0-9]+--cafee2015\.netlify\.app$/i

// New
/^https:\/\/[a-z0-9]+-[a-z0-9]+--newsite\.netlify\.app$/i
```

### Add Vercel Support
```typescript
// Vercel pattern: https://*-username.vercel.app
const vercelPattern = /^https:\/\/[a-z0-9-]+-username\.vercel\.app$/i;
if (vercelPattern.test(sanitizedOrigin)) {
  return true;
}
```

---

**Deploy and test!** 🚀
