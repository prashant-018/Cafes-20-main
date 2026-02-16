# Render Environment Variables Checklist

## ✅ Required Variables

Copy these EXACTLY to your Render environment variables (no quotes, no extra spaces):

```env
MONGODB_URI=mongodb+srv://cafe:heQCBCCq2ccFM2hkv@completecoding.ysiqcy9.mongodb.net/himalayan-pizza?retryWrites=true&w=majority&appName=CompleteCoding

JWT_SECRET=himalayan-pizza-super-secret-jwt-key-2024-make-this-very-long-and-random

JWT_EXPIRES_IN=7d

NODE_ENV=production

PORT=5000
```

## 📋 How to Set in Render

1. Go to: https://dashboard.render.com
2. Select your service: `cafes-20-main`
3. Click "Environment" tab
4. For each variable:
   - Click "Add Environment Variable"
   - Paste the Key (e.g., `JWT_SECRET`)
   - Paste the Value (e.g., `himalayan-pizza-super-secret-jwt-key-2024-make-this-very-long-and-random`)
   - **DO NOT add quotes around the value**
   - Click "Save"

## ⚠️ Common Mistakes

### ❌ WRONG

```env
JWT_SECRET="himalayan-pizza-super-secret-jwt-key-2024-make-this-very-long-and-random"
# Has quotes - REMOVE THEM

JWT_EXPIRES_IN="7d"
# Has quotes - REMOVE THEM

JWT_EXPIRES_IN= 7d
# Has space before value - REMOVE IT

MONGODB_URI = mongodb+srv://...
# Has spaces around = - REMOVE THEM
```

### ✅ CORRECT

```env
JWT_SECRET=himalayan-pizza-super-secret-jwt-key-2024-make-this-very-long-and-random
JWT_EXPIRES_IN=7d
MONGODB_URI=mongodb+srv://cafe:heQCBCCq2ccFM2hkv@completecoding.ysiqcy9.mongodb.net/himalayan-pizza?retryWrites=true&w=majority&appName=CompleteCoding
```

## 🔍 Verification

After setting variables:

1. Click "Save Changes" in Render
2. Wait for automatic redeploy (2-3 minutes)
3. Check logs for:
   ```
   ✅ JWT configuration validated successfully
   ✅ MongoDB Connected Successfully!
   ```

## 🧪 Test After Setup

```powershell
cd Cafes-20-main
./test-render-api.ps1
```

Expected results:
- ✅ Health Check: SUCCESS
- ✅ Register: SUCCESS
- ✅ Login: SUCCESS
- ✅ Admin Login: SUCCESS

## 📞 If Something Goes Wrong

### Check Render Logs

1. Render Dashboard → Your Service → Logs
2. Look for error messages:
   - `❌ JWT_SECRET is not defined` → Add JWT_SECRET
   - `❌ Failed to connect to MongoDB` → Fix MongoDB Atlas Network Access
   - `⚠️ Invalid JWT_EXPIRES_IN format` → Fix JWT_EXPIRES_IN format

### MongoDB Atlas Network Access

If you see MongoDB connection errors:

1. Go to: https://cloud.mongodb.com
2. Network Access → Add IP Address
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Wait 2-3 minutes

## 🎯 Quick Fix Commands

### Generate New JWT_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and use it as your JWT_SECRET.

### Test Locally

```bash
cd Cafes-20-main/server
npm run test:jwt
```

This tests JWT configuration without deploying.

## 📊 Environment Variable Reference

| Variable | Required | Default | Format | Example |
|----------|----------|---------|--------|---------|
| MONGODB_URI | ✅ Yes | None | MongoDB connection string | `mongodb+srv://user:pass@cluster...` |
| JWT_SECRET | ✅ Yes | None | String (32+ chars) | `your-secret-key-here` |
| JWT_EXPIRES_IN | ⚠️ Optional | `7d` | Timespan | `7d`, `24h`, `60m` |
| NODE_ENV | ⚠️ Optional | `development` | String | `production`, `development` |
| PORT | ⚠️ Optional | `5000` | Number | `5000`, `3000` |
| CLIENT_URL | ⚠️ Optional | Auto | URL | `https://your-frontend.com` |

## 🔒 Security Best Practices

### JWT_SECRET

- ✅ Use at least 32 characters
- ✅ Use random, unpredictable characters
- ✅ Generate using crypto functions
- ❌ Don't use simple passwords
- ❌ Don't commit to git
- ❌ Don't share publicly

### JWT_EXPIRES_IN

- **Users**: `7d` or `14d` (better UX)
- **Admins**: `1d` or `12h` (more secure)
- **High Security**: `1h` or `30m`

## 📝 Checklist

Before deploying, verify:

- [ ] All required variables are set in Render
- [ ] No quotes around values
- [ ] No extra spaces
- [ ] MongoDB Atlas Network Access allows 0.0.0.0/0
- [ ] MongoDB cluster is not paused
- [ ] JWT_SECRET is at least 32 characters
- [ ] JWT_EXPIRES_IN uses valid format (7d, 24h, etc.)

After deploying:

- [ ] Check Render logs for success messages
- [ ] Run `./test-render-api.ps1`
- [ ] Test login from frontend
- [ ] Test registration from frontend
- [ ] Test admin login

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ Render logs show: `✅ MongoDB Connected Successfully!`
2. ✅ Render logs show: `✅ JWT configuration validated successfully`
3. ✅ Health check returns 200 OK
4. ✅ Registration creates new users
5. ✅ Login returns JWT tokens
6. ✅ Admin login works

---

**Need help?** Check `JWT_EXPIRES_IN_FIX.md` for detailed troubleshooting.
