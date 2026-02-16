# CSP Quick Reference Card

## 🚨 The Problem

```
Error: Executing inline script violates CSP directive 'script-src 'self''
Error: @vitejs/plugin-react-swc can't detect preamble
```

## ✅ The Solution

### 1. Development: Disable CSP
```typescript
contentSecurityPolicy: process.env.NODE_ENV !== "production" ? false : { ... }
```

### 2. Production: Use Nonce
```typescript
// Generate nonce
app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString("base64");
  next();
});

// Use in CSP
scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`]
```

### 3. Fix SWC Plugin
```bash
npm install @vitejs/plugin-react-swc@latest
```

```typescript
// vite.config.ts
plugins: [
  react({
    jsxImportSource: "react",
    plugins: [],
  }),
],
optimizeDeps: {
  include: ["react", "react-dom"],
},
```

## 🎯 Why Vite Needs Inline Scripts

| Feature | Purpose | Requires Inline Script |
|---------|---------|----------------------|
| HMR | Live code updates | ✅ Yes |
| Error Overlay | Show errors in browser | ✅ Yes |
| WebSocket Client | Server communication | ✅ Yes |
| React Fast Refresh | Preserve state | ✅ Yes |

## 🔐 Security Levels

| Method | Security | Vite Dev | Production |
|--------|----------|----------|------------|
| No CSP | ❌ Unsafe | ✅ Works | ❌ Bad |
| `unsafe-inline` | ❌ Unsafe | ✅ Works | ❌ Bad |
| CSP disabled in dev | ✅ Safe | ✅ Works | ✅ Good |
| Nonce-based | ✅ Secure | ✅ Works | ✅ Best |

## 📋 Checklist

- [ ] Import crypto in server
- [ ] Generate nonce per request (production only)
- [ ] Disable CSP in development
- [ ] Use nonce in production CSP
- [ ] Update @vitejs/plugin-react-swc
- [ ] Configure vite.config.ts
- [ ] Clear Vite cache
- [ ] Test both dev and prod modes

## 🧪 Quick Test

```bash
# 