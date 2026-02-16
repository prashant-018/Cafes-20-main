# 📄 Exact Netlify Configuration

## Your netlify.toml File

**Location:** `Cafes-20-main/netlify.toml` (ROOT directory)

This file is **already created and configured** in your project!

```toml
# Netlify Configuration for Frontend Only
# Deploying from monorepo structure

[build]
  # Base directory relative to repository root
  base = "client"
  
  # Build command - install dependencies and build
  command = "npm install && npm run build"
  
  # Publish directory relative to base directory
  publish = "dist"

# Environment variables
[build.environment]
  NODE_VERSION = "18"

# SPA routing - redirect all routes to index.html for React Router
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Security headers (optional but recommended)
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "no-referrer"
    X-XSS-Protection = "1; mode=block"
```

---

## Configuration Explained

### [build] Section

```toml
base = "client"
```
- Tells Netlify to `cd` into the `client` folder before building
- All paths are relative to this directory

```toml
command = "npm install && npm run build"
```
- Installs dependencies from `client/package.json`
- Runs the build script: `vite build`

```toml
publish = "dist"
```
- Publishes the `client/dist` folder (relative to base)
- This is where Vite outputs the built files

### [build.environment] Section

```toml
NODE_VERSION = "18"
```
- Ensures Netlify uses Node.js version 18
- Matches your local development environment

### [[redirects]] Section

```toml
from = "/*"
to = "/index.html"
status = 200
```
- **Critical for React Router!**
- Redirects all routes to index.html
- Prevents 404 errors on page refresh
- Status 200 = rewrite (not redirect)

### [[headers]] Section

```toml
[headers.values]
  X-Frame-Options = "DENY"
  X-Content-Type-Options = "nosniff"
  Referrer-Policy = "no-referrer"
  X-XSS-Protection = "1; mode=block"
```
- Security headers for production
- Protects against common web vulnerabilities
- Optional but recommended

---

## Netlify Dashboard Settings

When you connect your repository to Netlify, these settings will be **auto-detected** from `netlify.toml`:

| Setting | Value | Source |
|---------|-------|--------|
| Base directory | `client` | netlify.toml |
| Build command | `npm install && npm run build` | netlify.toml |
| Publish directory | `client/dist` | netlify.toml |
| Node version | 18 | netlify.toml |

**You don't need to manually enter these!** Netlify reads them from the file.

---

## Environment Variables (Manual Setup Required)

These **cannot** be in netlify.toml for security reasons. Add them in the Netlify dashboard:

### How to Add:

1. Go to: **Netlify Dashboard → Site Settings → Environment Variables**
2. Click **"Add a variable"**
3. Add each variable:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://cafes-20-main.onrender.com/api` |

4. Click **"Save"**
5. Click **"Trigger deploy"** to rebuild with new variables

---

## File Structure Verification

```
Cafes-20-main/                    ← Repository root
├── netlify.toml                  ← Netlify config (HERE!)
├── client/                       ← Base directory
│   ├── package.json              ← Dependencies
│   ├── vite.config.ts            ← Vite config
│   ├── index.html                ← Entry point
│   ├── main.tsx                  ← React entry
│   ├── .env                      ← Local env (gitignored)
│   ├── .env.example              ← Env template
│   └── dist/                     ← Build output (created by build)
│       ├── index.html
│       └── assets/
└── server/                       ← Backend (not deployed)
```

---

## How Netlify Uses This Config

1. **Clone your repository**
2. **Read netlify.toml** from root
3. **cd into client/** (base directory)
4. **Run:** `npm install && npm run build`
5. **Publish:** `client/dist` folder
6. **Apply redirects:** All routes → index.html
7. **Apply headers:** Security headers to all files

---

## Testing the Configuration

### Test Locally:

```cmd
cd Cafes-20-main\client
npm install
npm run build
```

**Expected output:**
```
✓ built in XXXms
✓ XX modules transformed
dist/index.html                  X.XX kB
dist/assets/index-XXXXX.js       XXX.XX kB
```

If this works, Netlify will work!

### Test the Built Site:

```cmd
npm run preview
```

Opens the built site at `http://localhost:4173`

---

## Common Questions

### Q: Why is netlify.toml in the root, not client folder?

**A:** Netlify always looks for `netlify.toml` in the repository root. The `base` setting tells it where to build from.

### Q: Can I use a different publish directory?

**A:** Yes, but you'd need to change Vite's output directory in `vite.config.ts`:

```typescript
build: {
  outDir: "build"  // Change from "dist"
}
```

Then update netlify.toml:
```toml
publish = "build"
```

### Q: Do I need to commit netlify.toml?

**A:** Yes! It must be in your Git repository for Netlify to use it.

### Q: What if I want to deploy from a different branch?

**A:** Configure this in Netlify dashboard under **Site Settings → Build & Deploy → Deploy contexts**

---

## ✅ Verification Checklist

Before deploying, verify:

- [x] `netlify.toml` exists in repository root
- [x] `base = "client"` points to correct folder
- [x] `publish = "dist"` matches Vite output directory
- [x] `client/package.json` has `build` script
- [x] `client/index.html` exists
- [x] `client/vite.config.ts` configured
- [ ] Environment variables ready to add to Netlify
- [ ] Backend CORS allows Netlify domain

---

## 🎯 You're Ready!

Your `netlify.toml` is correctly configured. Just:

1. Fix TypeScript errors (or disable checking)
2. Test build locally
3. Push to GitHub
4. Connect to Netlify
5. Add environment variables
6. Deploy!

The configuration is solid. The only blocker is the TypeScript errors.

Would you like me to fix those now?
