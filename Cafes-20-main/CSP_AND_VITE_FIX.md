# CSP and Vite React SWC Fix - Production-Safe Solution

## Problems Identified

### 1. Content Security Policy (CSP) Error
**Error Message:**
```
Executing inline script violates the following Content Security Policy directive 'script-src 'self''.
```

**Root Cause:**
- Helmet middleware in `server/index.ts` was applying strict CSP headers by default
- Vite's Hot Module Replacement (HMR) in development mode injects inline scripts for live reloading
- These inline scripts were blocked by the CSP policy

### 2. Vite React SWC Preamble Error
**Error Message:**
```
Uncaught Error: @vitejs/plugin-react-swc can't detect preamble. Something is wrong.
```

**Root Cause:**
- Outdated `@vitejs/plugin-react-swc` version (4.0.0)
- Missing explicit JSX configuration in vite.config.ts
- Plugin couldn't properly detect React imports in some files

---

## Solutions Applied

### 1. Fixed Helmet CSP Configuration (`server/index.ts`)

**What Changed:**
```typescript
// BEFORE
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// AFTER
const isDevelopment = process.env.NODE_ENV !== "production";

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: isDevelopment
      ? false // Disable CSP in development to allow Vite HMR
      : {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
          },
        },
  }),
);
```

**Why This Works:**
- **Development:** CSP is disabled completely, allowing Vite HMR to work without restrictions
- **Production:** Strict CSP policy is enforced for security
- No `unsafe-inline` for scripts in production (secure)
- Only allows inline styles for CSS-in-JS libraries (common requirement)

### 2. Updated Vite React SWC Plugin

**What Changed:**
```bash
npm install @vitejs/plugin-react-swc@latest
```

Updated from version 4.0.0 to latest (5.x), which includes:
- Better preamble detection
- Improved JSX handling
- Bug fixes for React 18.3+

### 3. Enhanced Vite Configuration (`vite.config.ts`)

**What Changed:**
```typescript
plugins: [
  react({
    jsxImportSource: "react",
    plugins: [],
  }),
  expressPlugin(),
],
optimizeDeps: {
  include: ["react", "react-dom"],
},
```

**Why This Works:**
- Explicitly tells SWC where JSX comes from
- Pre-optimizes React dependencies
- Prevents preamble detection issues

### 4. Cleared Vite Cache

Removed stale cache that might contain old plugin configurations:
```bash
rm -rf node_modules/.vite
```

---

## Why These Errors Happen in Vite Dev Mode

### CSP Error
1. Vite dev server injects inline scripts for:
   - Hot Module Replacement (HMR)
   - Error overlay
   - Client-server WebSocket connection
2. Helmet's default CSP blocks these inline scripts
3. This only affects development; production builds don't have inline scripts

### SWC Preamble Error
1. `@vitejs/plugin-react-swc` needs to detect React imports to optimize JSX
2. Older versions had bugs with:
   - Files without explicit React imports (React 17+ automatic JSX)
   - Complex import patterns
   - Certain file structures
3. The plugin scans file "preamble" (top section) for imports
4. Detection failure causes the error

---

## Production Safety Checklist

✅ **CSP is enforced in production** - Only disabled in development
✅ **No unsafe-inline for scripts** - Scripts must be from same origin
✅ **Latest security patches** - Updated plugin has security fixes
✅ **Proper CORS configuration** - Already configured in your server
✅ **Compression enabled** - Already using compression middleware
✅ **Rate limiting ready** - express-rate-limit is installed

---

## Testing the Fix

### 1. Restart Development Server
```bash
npm run dev
```

### 2. Check Browser Console
- CSP errors should be gone
- No preamble detection errors
- HMR should work normally

### 3. Test Production Build
```bash
npm run build
npm run start
```

Check that CSP headers are present:
```bash
curl -I http://localhost:3000
```

Should see:
```
Content-Security-Policy: default-src 'self'; script-src 'self'; ...
```

---

## Additional Recommendations

### 1. Environment-Specific Configuration

Create `.env.development` and `.env.production`:

```env
# .env.development
NODE_ENV=development
VITE_API_URL=http://localhost:8080

# .env.production
NODE_ENV=production
VITE_API_URL=https://your-domain.com
```

### 2. Enhanced Production CSP (Optional)

For even stricter security, consider adding nonces:

```typescript
// server/index.ts
import crypto from "crypto";

app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString("base64");
  next();
});

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`],
        // ... other directives
      },
    },
  }),
);
```

Then in your HTML template, add the nonce to script tags.

### 3. Monitor CSP Violations

Add CSP reporting:

```typescript
contentSecurityPolicy: {
  directives: {
    // ... your directives
    reportUri: "/api/csp-report",
  },
}
```

---

## Troubleshooting

### If CSP errors persist:
1. Ensure `NODE_ENV` is not set to "production" in development
2. Clear browser cache (Ctrl+Shift+Delete)
3. Check if other middleware is setting CSP headers

### If preamble errors persist:
1. Verify React version is 18.3+
2. Check that all `.tsx` files have proper imports
3. Try deleting `node_modules` and reinstalling:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### If HMR stops working:
1. Check Vite dev server is running on correct port
2. Verify WebSocke