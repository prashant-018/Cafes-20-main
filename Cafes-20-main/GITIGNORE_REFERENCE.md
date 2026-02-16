# 📝 .gitignore Reference for Vite React App

This is the `.gitignore` file that's already been created in your `client` folder.

## What Gets Ignored and Why

### 1. Dependencies
```
node_modules/
```
- Third-party packages installed via npm/pnpm
- Can be reinstalled with `npm install`
- Too large to commit to Git

### 2. Build Output
```
dist/
dist-ssr/
build/
```
- Generated files from `npm run build`
- Vercel will build these automatically
- No need to commit compiled code

### 3. Environment Variables
```
.env
.env.local
.env.production
```
- Contains sensitive data (API keys, URLs)
- Each environment has its own values
- Set these in Vercel dashboard instead

### 4. Editor Files
```
.vscode/
.idea/
*.swp
```
- IDE-specific settings
- Different for each developer
- Not part of the project code

### 5. OS Files
```
.DS_Store (Mac)
Thumbs.db (Windows)
```
- Operating system generated files
- Not needed for the project

### 6. Logs & Cache
```
*.log
.cache/
*.tsbuildinfo
```
- Temporary debugging files
- Build tool cache files
- Regenerated automatically

---

## ✅ What Gets Committed

These files SHOULD be in your Git repository:

- ✅ `package.json` - Dependencies list
- ✅ `package-lock.json` or `pnpm-lock.yaml` - Exact versions
- ✅ `.env.example` - Template for environment variables
- ✅ All source code (`.tsx`, `.ts`, `.css` files)
- ✅ Configuration files (`vite.config.ts`, `tailwind.config.ts`, etc.)
- ✅ `README.md` - Project documentation
- ✅ `vercel.json` - Deployment configuration

---

## 🔒 Security Best Practices

### Never Commit:
- ❌ `.env` files with real API keys
- ❌ Database credentials
- ❌ JWT secrets
- ❌ OAuth client secrets
- ❌ Payment gateway keys

### Always Use:
- ✅ `.env.example` with placeholder values
- ✅ Environment variables in Vercel dashboard
- ✅ Separate `.env` files for dev/staging/production

---

## 📋 Example .env.example

Create this file to show others what environment variables are needed:

```env
# API Configuration
VITE_API_URL=http://localhost:5000

# Optional: Other services
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🚨 If You Accidentally Committed Secrets

If you accidentally committed a `.env` file with secrets:

1. **Immediately rotate/change all exposed secrets**
2. Remove the file from Git history:
```cmd
git rm --cached .env
git commit -m "Remove .env from tracking"
git push
```

3. Add `.env` to `.gitignore` if not already there
4. Consider using `git filter-branch` or BFG Repo-Cleaner to remove from history

---

## ✅ Verify Your .gitignore Works

Before pushing to GitHub, check what will be committed:

```cmd
git status
```

You should NOT see:
- `node_modules/`
- `dist/`
- `.env` files
- `.DS_Store` or `Thumbs.db`

If you see these, your `.gitignore` isn't working correctly.

---

## 🔄 Update .gitignore After Initial Commit

If you need to update `.gitignore` after files are already tracked:

```cmd
# Remove all files from Git cache
git rm -r --cached .

# Re-add all files (respecting new .gitignore)
git add .

# Commit the changes
git commit -m "Update .gitignore"
```

This is safe - it only removes files from Git tracking, not from your disk.
