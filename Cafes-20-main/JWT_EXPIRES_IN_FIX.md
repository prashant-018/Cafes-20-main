# JWT_EXPIRES_IN Production Error Fix

## 🚨 Error Message

```
"expiresIn" should be a number of seconds or string representing a timespan
```

## 🔍 Root Cause

The error occurs when `JWT_EXPIRES_IN` environment variable contains:
- Extra whitespace: `" 7d "` or `"  7d"`
- Quotes: `"'7d'"` or `'"7d"'`
- Invalid format: `"7x"`, `"invalid"`, `""`
- Undefined/null value that gets passed as-is

This happens because Render (and other cloud platforms) sometimes add extra characters when setting environment variables through their UI.

## ✅ Solution Implemented

### Production-Safe JWT Utility

The `signToken` function now includes:

1. **Sanitization**: Removes whitespace and quotes
2. **Validation**: Checks format matches valid timespan patterns
3. **Fallback**: Uses safe default (`7d`) if invalid
4. **Error Recovery**: Catches and handles JWT signing errors
5. **Logging**: Warns about invalid configurations

### Key Features

```typescript
// Sanitizes and validates expiration time
const sanitizeExpiresIn = (expiresIn: string | undefined): string => {
  // Removes whitespace and quotes
  let sanitized = expiresIn.trim().replace(/['"]/g, '');
  
  // Validates format: number + time unit (s, m, h, d, w, y)
  const timeSpanRegex = /^(\d+)([smhdwy]?)$/i;
  
  // Returns default if invalid
  if (!match) {
    return '7d'; // Safe default
  }
  
  return sanitized;
};
```

### Valid Formats

✅ **Accepted Formats**:
- `7d` - 7 days
- `24h` - 24 hours
- `60m` - 60 minutes
- `3600s` - 3600 seconds
- `1w` - 1 week
- `1y` - 1 year
- `604800` - Number only (seconds)

❌ **Invalid Formats** (will use default):
- `7x` - Invalid unit
- `invalid` - Not a number
- `""` - Empty string
- `" 7d "` - Will be sanitized to `7d` ✅
- `"'7d'"` - Will be sanitized to `7d` ✅

## 🔧 How to Fix in Render

### Option 1: Check Environment Variable (Recommended)

1. Go to Render Dashboard
2. Select your service
3. Click "Environment" tab
4. Find `JWT_EXPIRES_IN`
5. Check the value - it should be exactly: `7d`
6. **No quotes, no spaces, no extra characters**
7. If it has quotes or spaces, edit it to: `7d`
8. Save and redeploy

### Option 2: Remove and Re-add

1. In Render Environment tab
2. Delete the `JWT_EXPIRES_IN` variable
3. Click "Add Environment Variable"
4. Key: `JWT_EXPIRES_IN`
5. Value: `7d` (no quotes!)
6. Save

### Option 3: Let It Use Default

The code now handles missing `JWT_EXPIRES_IN` gracefully:
- If not set, uses default: `7d`
- If invalid, uses default: `7d`
- Logs a warning but doesn't crash

## 🧪 Testing

### Test Locally

```bash
cd Cafes-20-main/server
npm run test:jwt
```

This will test:
- ✅ Environment variable reading
- ✅ Configuration validation
- ✅ Token signing with default expiry
- ✅ Token signing with custom expiry
- ✅ Token verification
- ✅ Various expiry formats
- ✅ Invalid format handling

### Expected Output

```
🧪 Testing JWT Configuration

📋 Test 1: Environment Variables
JWT_SECRET: ✅ Set
JWT_SECRET Length: 73 characters
JWT_EXPIRES_IN: 7d

📋 Test 2: Validate Configuration
✅ JWT configuration validated successfully
   JWT_EXPIRES_IN: 7d

📋 Test 3: Sign Token (Default Expiry)
✅ Token signed successfully

📋 Test 4: Sign Token (Custom Expiry: 1d)
✅ Token signed successfully with custom expiry

📋 Test 5: Verify Token
✅ Token verified successfully
✅ Payload matches original

📋 Test 6: Test Various Expiry Formats
✅ Format "7d": Success
✅ Format "24h": Success
✅ Format "60m": Success
✅ Format "3600s": Success
✅ Format "1w": Success
✅ Format "1y": Success
✅ Format "604800": Success

📋 Test 7: Test Invalid Expiry Formats
✅ Format "invalid": Handled gracefully (used default)
✅ Format "7x": Handled gracefully (used default)
✅ Format "": Handled gracefully (used default)

✅ All JWT tests completed successfully!
```

## 📋 Environment Variable Checklist

### In Render Dashboard

Check these variables are set correctly:

```env
# Required - No quotes, no spaces
JWT_SECRET=himalayan-pizza-super-secret-jwt-key-2024-make-this-very-long-and-random

# Optional - Will use default "7d" if not set
JWT_EXPIRES_IN=7d

# Other required variables
MONGODB_URI=mongodb+srv://...
NODE_ENV=production
PORT=5000
```

### Common Mistakes

❌ **Wrong**:
```env
JWT_EXPIRES_IN="7d"        # Has quotes
JWT_EXPIRES_IN='7d'        # Has quotes
JWT_EXPIRES_IN= 7d         # Has space before value
JWT_EXPIRES_IN=7d          # Has space after value
JWT_EXPIRES_IN=7 d         # Has space in value
```

✅ **Correct**:
```env
JWT_EXPIRES_IN=7d          # No quotes, no spaces
```

## 🔒 Security Notes

### Token Expiration Times

**User Tokens** (default: 7d):
- Longer expiration for better UX
- Users don't need to login frequently
- Acceptable for most applications

**Admin Tokens** (custom: 1d):
- Shorter expiration for security
- Admins should re-authenticate more often
- Reduces risk if token is compromised

### Recommended Values

- **Development**: `7d` or `30d`
- **Production (Users)**: `7d` or `14d`
- **Production (Admins)**: `1d` or `12h`
- **High Security**: `1h` or `30m`

## 🚀 Deployment Steps

### 1. Update Code (Already Done)

The JWT utility has been updated with:
- ✅ Sanitization
- ✅ Validation
- ✅ Fallback to default
- ✅ Error recovery
- ✅ Better logging

### 2. Verify Environment Variables

```bash
# Check Render environment variables
# Make sure JWT_EXPIRES_IN=7d (no quotes, no spaces)
```

### 3. Deploy

```bash
# Push changes to trigger deployment
git add .
git commit -m "Fix JWT_EXPIRES_IN production error"
git push
```

Or use Render's "Manual Deploy" button.

### 4. Test

After deployment:

```powershell
# Test the API
cd Cafes-20-main
./test-render-api.ps1
```

All tests should pass ✅

## 📊 Before vs After

### Before (Crashes)

```typescript
// Direct usage - crashes if invalid
const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
jwt.sign(payload, secret, { expiresIn }); // ❌ Crashes if expiresIn has quotes
```

### After (Production-Safe)

```typescript
// Sanitized and validated - never crashes
const expiresIn = sanitizeExpiresIn(process.env.JWT_EXPIRES_IN);
jwt.sign(payload, secret, { expiresIn }); // ✅ Always works
```

## 🐛 Troubleshooting

### Still Getting the Error?

1. **Check Render Logs**:
   - Look for: `⚠️ Invalid JWT_EXPIRES_IN format`
   - This shows what value is being read

2. **Verify Environment Variable**:
   - Go to Render → Environment
   - Copy the exact value of `JWT_EXPIRES_IN`
   - Check for hidden characters

3. **Remove and Re-add**:
   - Delete `JWT_EXPIRES_IN` completely
   - Let it use the default `7d`
   - Test if it works

4. **Check for Typos**:
   - Variable name should be: `JWT_EXPIRES_IN` (not `JWT_EXPIRE_IN`)
   - Value should be: `7d` (not `7D` or `7 d`)

### Error Persists After Fix?

If you still see the error after deploying:

1. **Clear Render Cache**:
   - Go to Render Dashboard
   - Click "Manual Deploy" → "Clear build cache & deploy"

2. **Check Build Logs**:
   - Look for environment variable values during build
   - Verify JWT_EXPIRES_IN is being read correctly

3. **Test Locally First**:
   ```bash
   cd Cafes-20-main/server
   npm run test:jwt
   ```
   If it works locally but not on Render, it's an environment variable issue.

## 📝 Summary

**Problem**: `JWT_EXPIRES_IN` with quotes/spaces causes crashes  
**Solution**: Sanitize and validate before use  
**Fallback**: Use safe default `7d` if invalid  
**Result**: Production-safe JWT signing that never crashes  

**Action Required**: 
1. Check Render environment variables
2. Ensure `JWT_EXPIRES_IN=7d` (no quotes, no spaces)
3. Redeploy if needed
4. Test with `./test-render-api.ps1`

---

**The code is now production-safe and will handle any invalid JWT_EXPIRES_IN values gracefully!** ✅
