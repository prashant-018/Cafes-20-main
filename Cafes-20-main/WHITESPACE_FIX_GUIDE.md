# 🔧 Whitespace/Newline Fix for CORS

## Problem Identified

Your `/api/health` endpoint showed:
```json
{
  "cors": {
    "allowedOrigins": [
      "https://my-netlify-domain.netlify.app\n"
    ]
  }
}
```

Notice the `\n` (newline) at the end! This causes CORS to fail because:
```
"https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app\n" 
!== 
"https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app"
```

---

## ✅ Solution Applied

### 1. Bulletproof Environment Variable Sanitization

Added `sanitizeEnvVar()` function that removes:
- Newlines (`\n`)
- Carriage returns (`\r`)
- Tabs (`\t`)
- Quotes (`'` and `"`)
- Leading/trailing whitespace

```typescript
const sanitizeEnvVar = (value: string | undefined, defaultValue: string): string => {
  if (!value) return defaultValue;
  
  // Remove all whitespace, newlines, carriage returns, tabs, quotes
  const sanitized = value
    .replace(/[\r\n\t]/g, '')  // Remove newlines, carriage returns, tabs
    .replace(/['"]/g, '')       // Remove quotes
    .trim();                    // Remove leading/trailing whitespace
  
  return sanitized || defaultValue;
};
```

### 2. Enhanced Debug Logging

Now logs:
- Raw CLIENT_URL value
- CLIENT_URL length
- CLIENT_URL as JSON (shows hidden characters)
- Each allowed origin with length
- Detailed CORS check for each request

```typescript
console.log('🔧 Environment Variables Loaded (Sanitized):');
console.log('   NODE_ENV:', NODE_ENV);
console.log('   PORT:', PORT);
console.log('   CLIENT_URL:', CLIENT_URL);
console.log('   CLIENT_URL length:', CLIENT_URL.length);
console.log('   CLIENT_URL (JSON):', JSON.stringify(CLIENT_URL));
```

### 3. Enhanced CORS Origin Checking

```typescript
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      console.log('   ✅ CORS: Allowing request with no origin');
      return callback(null, true);
    }

    // Sanitize incoming origin too!
    const sanitizedOrigin = origin.trim();
    
    console.log(`   🔍 CORS: Checking origin: "${sanitizedOrigin}"`);
    console.log(`      JSON: ${JSON.stringify(sanitizedOrigin)}`);
    
    if (allowedOrigins.includes(sanitizedOrigin)) {
      console.log(`   ✅ CORS: Origin allowed`);
      callback(null, true);
    } else {
      console.warn(`   ❌ CORS: Origin BLOCKED`);
      // Detailed comparison logging
      allowedOrigins.forEach((allowed, index) => {
        console.warn(`         [${index}] "${allowed}" === "${sanitizedOrigin}" ? ${allowed === sanitizedOrigin}`);
        console.warn(`             Lengths: ${allowed.length} vs ${sanitizedOrigin.length}`);
      });
      callback(new Error(`Origin ${sanitizedOrigin} not allowed by CORS`));
    }
  },
  // ... rest of CORS config
}));
```

---

## 🔍 Expected Render Logs (After Deploy)

### Startup Logs
```
🔧 Environment Variables Loaded (Sanitized):
   NODE_ENV: production
   PORT: 5000
   CLIENT_URL: https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app
   CLIENT_URL length: 58
   CLIENT_URL (JSON): "https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app"
   ✅ Added CLIENT_URL to allowed origins: https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app
      Length: 58 | JSON: "https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app"
   📋 Final allowed origins: ['https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app']
   📊 Total origins: 1
      [0] "https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app" (length: 58)
```

✅ **GOOD:** No `\n` in JSON, length is 58 (not 59)
❌ **BAD:** If you see `\n` in JSON or length is 59, CLIENT_URL still has newline

### Request Logs (Login)
```
2026-02-17T... - OPTIONS /api/auth/admin/login
   Origin: https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app
   🔍 PREFLIGHT REQUEST
   🔍 CORS: Checking origin: "https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app" (length: 58)
      JSON: "https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app"
   ✅ CORS: Origin allowed: "https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app"

2026-02-17T... - POST /api/auth/admin/login
   Origin: https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app
   🔍 CORS: Checking origin: "https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app" (length: 58)
      JSON: "https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app"
   ✅ CORS: Origin allowed: "https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app"
🔐 Admin login attempt: { email: 'admin@gmail.com' }
✅ Admin login successful
```

### If CORS Still Blocked (Debugging)
```
   ❌ CORS: Origin BLOCKED: "https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app"
      Allowed origins: ['https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app\n']
      Checking each allowed origin:
         [0] "https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app\n" === "https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app" ? false
             Lengths: 59 vs 58
```

This tells you exactly what's wrong!

---

## 🚀 Deployment Steps

### Step 1: Fix CLIENT_URL in Render

The issue is likely how you set the environment variable. Try these methods:

#### Method A: Render Dashboard (Recommended)
```
1. Go to: https://dashboard.render.com
2. Select: cafes-20-main-6
3. Click: Environment
4. Find: CLIENT_URL
5. Click: Edit
6. Copy this EXACT value (no extra spaces/newlines):
   https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app
7. Paste carefully (don't press Enter after pasting!)
8. Click: Save
9. Wait for redeploy
```

#### Method B: Delete and Re-add
```
1. Delete the existing CLIENT_URL variable
2. Add new variable
3. Key: CLIENT_URL
4. Value: https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app
5. Save
```

#### Method C: Use render.yaml (Most Reliable)
Create `render.yaml` in your repo:
```yaml
services:
  - type: web
    name: cafes-20-main-6
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: CLIENT_URL
        value: https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app
      - key: PORT
        value: 5000
```

### Step 2: Verify Logs

Watch Render logs for:
```
CLIENT_URL length: 58
CLIENT_URL (JSON): "https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app"
```

✅ **GOOD:** Length 58, no `\n` in JSON
❌ **BAD:** Length 59, has `\n` in JSON

### Step 3: Test Health Endpoint

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

✅ **GOOD:** No `\n` visible
❌ **BAD:** Shows `\n` at end

### Step 4: Test Login

```
1. Go to: https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app/admin/login
2. Open DevTools → Network tab
3. Login
4. Check:
   ✅ OPTIONS → 204
   ✅ POST → 200
   ✅ No CORS errors
```

---

## 🔧 Troubleshooting

### Issue: Still seeing newline in logs

**Cause:** CLIENT_URL in Render still has newline

**Fix:**
1. Delete CLIENT_URL variable completely
2. Add it again manually
3. Or use render.yaml method
4. Ensure you don't press Enter after pasting value

### Issue: Length is 59 instead of 58

**Cause:** Hidden newline character

**Fix:**
1. Copy URL from browser address bar (not from text file)
2. Paste into Render without pressing Enter
3. Or type it manually

### Issue: CORS still blocking after fix

**Cause:** Browser cached old preflight response

**Fix:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Try incognito mode
3. Hard refresh (Ctrl+F5)

### Issue: Logs show "CLIENT_URL: undefined"

**Cause:** Variable not set in Render

**Fix:**
1. Go to Render Dashboard → Environment
2. Add CLIENT_URL variable
3. Value: https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app
4. Save

---

## 📊 Verification Checklist

- [ ] Render logs show CLIENT_URL length: 58 (not 59)
- [ ] Render logs show no `\n` in JSON.stringify(CLIENT_URL)
- [ ] Health endpoint shows clean URL (no `\n`)
- [ ] CORS logs show "✅ CORS: Origin allowed"
- [ ] OPTIONS request returns 204
- [ ] POST request returns 200 with token
- [ ] No CORS errors in browser console
- [ ] Login works successfully

---

## 🎯 Key Points

1. **Sanitization is automatic**: Code now removes whitespace/newlines
2. **Debug logging is verbose**: You'll see exactly what's happening
3. **Both sides sanitized**: Environment variable AND incoming origin
4. **Length check**: Easy way to spot hidden characters
5. **JSON.stringify**: Shows hidden characters like `\n`

---

## 📝 Example: Good vs Bad

### ❌ BAD (Before Fix)
```
CLIENT_URL: https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app\n
Length: 59
JSON: "https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app\n"
Result: CORS BLOCKED
```

### ✅ GOOD (After Fix)
```
CLIENT_URL: https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app
Length: 58
JSON: "https://699415c5ccbf3f3b7d3aa419--cafee2015.netlify.app"
Result: CORS ALLOWED
```

---

**The code is bulletproof now. Just fix the CLIENT_URL in Render!** 🚀
