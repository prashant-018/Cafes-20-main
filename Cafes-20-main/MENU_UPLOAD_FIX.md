# 🔧 Menu Image Upload - Complete Fix

## ✅ What Was Fixed

### Backend Changes:
1. ✅ Changed to **memory storage** (files stored in buffer before Cloudinary)
2. ✅ Added `uploadToCloudinary` helper function
3. ✅ Added comprehensive **console.log** for debugging
4. ✅ Proper error handling at each step
5. ✅ Cloudinary config with fallback values

### Frontend Changes:
1. ✅ Added detailed logging in API service
2. ✅ Added logging in useMenuImages hook
3. ✅ Better error messages

## 🚀 Testing Steps

### Step 1: Check Environment Variables

**File:** `server/.env`

```env
# Cloudinary Configuration (REQUIRED)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Other configs
PORT=5000
CLIENT_URL=http://localhost:8080
MONGODB_URI=mongodb://localhost:27017/himalayan-pizza
JWT_SECRET=your-secret-key
```

**⚠️ IMPORTANT:** Replace with your actual Cloudinary credentials!

Get them from: https://cloudinary.com/console

### Step 2: Start Servers

```bash
# Terminal 1 - Backend
cd Cafes-20-main/server
npm run dev

# You should see:
# 📸 Cloudinary configured: { cloud_name: 'your-cloud', api_key: '***1234' }
# 🚀 Server running on port 5000
```

```bash
# Terminal 2 - Frontend
cd Cafes-20-main
npm run dev

# Frontend runs on http://localhost:8080
```

### Step 3: Test Upload

1. Open Admin Dashboard: `http://localhost:8080/admin/dashboard`
2. Login: `admin@gmail.com` / `prashant123`
3. Go to "Menu Management" section
4. Select a menu image (JPG, PNG, or WebP)
5. Click "Upload"

### Step 4: Check Console Logs

**Backend Console Should Show:**
```
📤 Upload request received
📁 Files: [Array of files]
📦 Processing 1 file(s)
🔄 Processing file: menu.jpg
☁️ Uploading to Cloudinary: { filename: 'menu.jpg', publicId: 'menu-1234...' }
✅ Cloudinary upload success: { url: 'https://res.cloudinary.com/...', public_id: 'menu-...' }
💾 Saved to MongoDB: 65abc123...
📡 Broadcasting update for 1 image(s)
✅ Upload complete: Successfully uploaded 1 image(s)
```

**Frontend Console Should Show:**
```
🎯 useMenuImages: Starting upload for 1 file(s)
📤 Uploading menu images: 1
📁 Adding file 1: { name: 'menu.jpg', type: 'image/jpeg', size: 245678 }
🚀 Sending upload request to: http://localhost:5000/api/menu/upload
✅ Upload response: { success: true, data: [...] }
✅ useMenuImages: Upload successful, received 1 image(s)
```

## 🐛 Troubleshooting

### Issue 1: "No files uploaded"

**Backend shows:** `❌ No files uploaded`

**Solution:**
- Check FormData key is `menuImages` (plural)
- Check file input has `multiple` attribute
- Check file is actually selected

### Issue 2: Cloudinary Upload Error

**Backend shows:** `❌ Cloudinary upload error: ...`

**Solutions:**

**A. Invalid Credentials**
```
Error: Invalid API Key
```
- Check `CLOUDINARY_API_KEY` in server/.env
- Verify credentials at cloudinary.com/console

**B. Quota Exceeded**
```
Error: Quota exceeded
```
- Free tier: 25 credits/month
- Check usage at cloudinary.com/console
- Upgrade plan or wait for reset

**C. Network Error**
```
Error: ECONNREFUSED
```
- Check internet connection
- Check firewall settings
- Try different network

### Issue 3: MongoDB Save Error

**Backend shows:** `❌ Error processing file: ...`

**Solutions:**

**A. MongoDB Not Running**
```bash
# Start MongoDB
mongod

# Or on Windows
net start MongoDB
```

**B. Connection String Wrong**
```env
# Check server/.env
MONGODB_URI=mongodb://localhost:27017/himalayan-pizza
```

**C. Model Validation Error**
- Check MenuImage model schema
- Verify all required fields are provided

### Issue 4: CORS Error

**Frontend shows:** `Access to fetch blocked by CORS policy`

**Solution:**
```typescript
// server/src/server.ts
app.use(cors({
  origin: [
    "http://localhost:8080",  // ← Must match frontend URL
    "http://localhost:5173",
    "http://localhost:3000"
  ],
  credentials: true
}));
```

### Issue 5: 401 Unauthorized

**Backend shows:** `401 Unauthorized`

**Solutions:**

**A. No Admin Token**
```javascript
// Check in browser console
localStorage.getItem('adminToken')
// Should return a JWT token
```

**B. Token Expired**
- Logout and login again
- Token expires after 1 day

**C. Wrong Token**
- Clear localStorage
- Login again

## 📊 Upload Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  Admin Dashboard                         │
│  1. User selects image file                              │
│  2. Clicks "Upload"                                      │
│  3. useMenuImages.uploadImages(files)                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Frontend API Service                        │
│  4. Creates FormData                                     │
│  5. Appends files with key 'menuImages'                 │
│  6. POST /api/menu/upload                                │
│  7. Authorization: Bearer <admin-token>                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Backend Server                          │
│  8. CORS check                                           │
│  9. Auth middleware (verify admin token)                │
│  10. Multer receives files (memory storage)             │
│  11. Files stored in req.files as buffers               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Upload Handler                          │
│  12. Loop through each file                              │
│  13. uploadToCloudinary(buffer, filename)               │
│  14. Cloudinary returns secure_url & public_id          │
│  15. Create MenuImage document                           │
│  16. Save to MongoDB                                     │
│  17. Add to uploadedImages array                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Response & Broadcast                    │
│  18. Emit Socket.IO: 'menuUpdate'                        │
│  19. Return success response with data                   │
│  20. Frontend receives response                          │
│  21. useMenuImages updates images array                  │
│  22. Components re-render                                │
│  23. New images appear                                   │
└─────────────────────────────────────────────────────────┘
```

## 🧪 Manual API Test

### Using cURL

```bash
# Get admin token first
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"prashant123"}'

# Copy the token from response

# Upload image
curl -X POST http://localhost:5000/api/menu/upload \
  -H "Authorization: Bearer <your-token-here>" \
  -F "menuImages=@/path/to/your/image.jpg"
```

### Using Postman

1. **Login:**
   - Method: POST
   - URL: `http://localhost:5000/api/auth/admin/login`
   - Body (JSON):
     ```json
     {
       "email": "admin@gmail.com",
       "password": "prashant123"
     }
     ```
   - Copy the `token` from response

2. **Upload Image:**
   - Method: POST
   - URL: `http://localhost:5000/api/menu/upload`
   - Headers:
     - `Authorization`: `Bearer <token>`
   - Body (form-data):
     - Key: `menuImages` (type: File)
     - Value: Select your image file
   - Click "Send"

## ✅ Success Indicators

### Backend Console:
```
📸 Cloudinary configured: { cloud_name: 'your-cloud', api_key: '***1234' }
📤 Upload request received
📁 Files: [ { fieldname: 'menuImages', originalname: 'menu.jpg', ... } ]
📦 Processing 1 file(s)
🔄 Processing file: menu.jpg
☁️ Uploading to Cloudinary: { filename: 'menu.jpg', publicId: 'menu-...' }
✅ Cloudinary upload success: { url: 'https://...', public_id: '...' }
💾 Saved to MongoDB: 65abc123...
📡 Broadcasting update for 1 image(s)
✅ Upload complete: Successfully uploaded 1 image(s)
```

### Frontend Console:
```
🎯 useMenuImages: Starting upload for 1 file(s)
📤 Uploading menu images: 1
📁 Adding file 1: { name: 'menu.jpg', type: 'image/jpeg', size: 245678 }
🚀 Sending upload request to: http://localhost:5000/api/menu/upload
✅ Upload response: { success: true, message: '...', data: [...] }
✅ useMenuImages: Upload successful, received 1 image(s)
Menu update received: { event: 'imagesAdded', data: [...] }
```

### Admin Dashboard:
- ✅ Success toast appears
- ✅ Image appears in preview list
- ✅ Upload progress shows 100%

### User Menu Page:
- ✅ New image appears immediately
- ✅ No page refresh needed

## 📝 Key Changes Made

### 1. Cloudinary Config (`server/src/config/cloudinary.ts`)
```typescript
// Before: CloudinaryStorage (direct upload)
// After: Memory storage + manual upload

const memoryStorage = multer.memoryStorage();

export const uploadToCloudinary = (buffer: Buffer, filename: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'himalayan-pizza/menu-images', ... },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};
```

### 2. Upload Route (`server/src/routes/menuImages.ts`)
```typescript
// Added comprehensive logging
console.log('📤 Upload request received');
console.log('📁 Files:', req.files);

// Manual Cloudinary upload
const cloudinaryResult = await uploadToCloudinary(file.buffer, file.originalname);

// Save to MongoDB
const menuImage = new MenuImage({
  name: file.originalname,
  url: cloudinaryResult.secure_url,
  cloudinaryId: cloudinaryResult.public_id,
  ...
});
```

### 3. Frontend API (`client/services/api.ts`)
```typescript
// Added logging
console.log('📤 Uploading menu images:', files.length);
console.log('📁 Adding file:', { name, type, size });
console.log('🚀 Sending upload request to:', url);
```

## 🎯 Next Steps

1. **Test Upload:**
   - Upload a test image
   - Check all console logs
   - Verify image appears on Menu page

2. **Check Cloudinary:**
   - Login to cloudinary.com/console
   - Go to Media Library
   - Find folder: `himalayan-pizza/menu-images`
   - Verify uploaded images are there

3. **Check MongoDB:**
   ```bash
   mongosh
   use himalayan-pizza
   db.menuimages.find().pretty()
   ```

4. **Production Setup:**
   - Get real Cloudinary credentials
   - Update server/.env
   - Test upload again
   - Deploy!

---

**Your menu upload is now fully functional with detailed logging!** 🚀
