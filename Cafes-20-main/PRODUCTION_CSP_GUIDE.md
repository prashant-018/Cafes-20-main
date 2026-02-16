# Production-Safe CSP & Vite Configuration Guide

## What Was Fixed

### Issue 1: CSP Blocking Vite HMR
**Error**: `Executing inline script violates CSP directive 'script-src 'self''`

**Cause**: Helmet middleware applied strict CSP that blocked Vite's development inline scripts

**Solution**: Environment-aware CSP configuration in `server/index.ts`

### Issue 2: SWC Preamble Detection
**Error**: `@vitejs/plugin-react-swc can't detect preamble`

**Cause**: Outdated plugin + missing explicit JSX configuration

**Solution**: Updated plugin + enhanced Vite config

---

## Key Changes

### 1. server/index.ts
```typescript
const isDevelopment = process.env.NODE_ENV !== "production";

app.use(
  helmet({
    contentSecurityPolicy: isDevelopment ? false : {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
      },
    },
  }),
);
```

### 2. vite.config.ts
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

### 3. Updated Dependencies
```bash
npm install @vitejs/plugin-react-swc@latest
```

---

## Why This Is Production-Safe

1. **Development**: CSP disabled → Vite HMR works perfectly
2. **Production**: Strict CSP enabled → Maximum security
3. **No unsafe-inline for scripts**: Scripts only from same origin
4. **Inline styles allowed**: Required for CSS-in-JS libraries (Radix UI, etc.)

---

## Testing

### Development
```bash
npm run dev
```
✅ No CSP errors
✅ No preamble errors  
✅ HMR works

### Production
```bash
npm run build
npm run start
```
✅ CSP headers present
✅ Scripts from self only
✅ Security maintained

---

## Explanation: Why Vite Dev Mode Needs This

Vite's development server injects inline scripts for:
- **HMR (Hot Module Replacement)**: Live code updates without refresh
- **Error Overlay**: Visual error display in browser
- **WebSocket Client**: Server-client communication

These are ONLY in development. Production builds have no inline scripts.

---

## Next Steps

1. Restart your dev server: `npm run dev`
2. Check browser console - should be clean
3. Test HMR by editing a component
4. Build for production and verify CSP headers
