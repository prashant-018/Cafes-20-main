# 🐛 Menu Upload Debug Guide

## Quick Test Setup

### Step 1: Start Backend

```bash
cd Cafes-20-main/server
npm run dev
```

**Expected Console Output:**
```
🔧 Configuring multer upload...
📁 Uploads directory path: /path/to/server/uploads
✅ Created uploads directory (or already exists)
✅ Multer configured successfully
🛣️ Loading menuSimple routes...
✅ menuSimple routes loaded
🎮 Loading menuSimple controller...
✅ menuSimple controller loaded
📁 Static uploads folder configured: /path/to/server/uploads
✅ All routes registered
   - /api/auth
   - /api/menu
   - /api/menu-local
   - /api/menu-simple
   - /api/business-settings
   - /api/settings
🚀 Server running on port 5000
```

### Step 2: Test Upload Endpoint

Open browser console and run:

```javascript
// Test 1: Check if endpoint exists
fetch('http://localhost:5000/api/menu-simple')
  .then(r => r.json())
  .then(d => console.log('GET response:', d));

// Test 2: Upload test (select a file first)
const input = document.createElement('input');
input.type = 'file';
input.accept = 'image/*';
input.onchange = async (e) => {
  const file = e.target.files[0];
  console.log('Selected file:', file);
  
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch('http://localhost:5000/api/menu-simple/upload', {
    method: 'POST',
    body: formData
  });
  
  const data = await response.json();
  console.log('Upload response:', data);
};
input.click();
```

### Step 3: Use Test Component

Add to your app:

```typescript
// In App.tsx or any route
import { MenuUploadTest } from '@/components/test/MenuUploadTest';

// Add route
<Route path="/test-upload" element={<MenuUploadTest />} />
```

Then visit: `http://localhost:8080/test-upload`

## Debug Checklist

### Backend Checks

- [ ] **Server Running**
  ```bash
  curl http://localhost:5000/api/health
  ```
  Should return: `{"success":true,"message":"..."}`

- [ ] **MongoDB Connected**
  Check console for: `✅ Connected to MongoDB`

- [ ] **Uploads Folder Exists**
  ```bash
  ls -la server/uploads/
  ```
  Should exist and be writable

- [ ] **Static Middleware Working**
  ```bash
  # Create test file
  echo "test" > server/uploads/test.txt
  
  # Access via browser
  curl http://localhost:5000/uploads/test.txt
  ```
  Should return: `test`

- [ ] **Route Registered**
  Check console for: `✅ All routes registered` with `/api/menu-simple`

- [ ] **CORS Enabled**
  ```bash
  curl -H "Origin: http://localhost:8080" \
       -H "Access-Control-Request-Method: POST" \
       -H "Access-Control-Request-Headers: Content-Type" \
       -X OPTIONS \
       http://localhost:5000/api/menu-simple/upload
  ```
  Should include `Access-Control-Allow-Origin` header

### Frontend Checks

- [ ] **API URL Correct**
  ```typescript
  const API_URL = 'http://localhost:5000/api/menu-simple';
  console.log('API URL:', API_URL);
  ```

- [ ] **FormData Created Correctly**
  ```typescript
  const formData = new FormData();
  formData.append('image', file);  // Key must be 'image'
  
  // Check contents
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }
  ```

- [ ] **No Content-Type Header**
  ```typescript
  // WRONG - Don't do this
  headers: {
    'Content-Type': 'multipart/form-data'  // ❌ Browser sets this automatically
  }
  
  // CORRECT
  fetch(url, {
    method: 'POST',
    body: formData  // ✅ No headers needed
  });
  ```

- [ ] **File Selected**
  ```typescript
  console.log('Selected file:', file);
  console.log('File name:', file.name);
  console.log('File type:', file.type);
  console.log('File size:', file.size);
  ```

## Common Issues & Solutions

### Issue 1: "No file uploaded"

**Backend Console Shows:**
```
📤 UPLOAD REQUEST RECEIVED
File: undefined
❌ ERROR: No file uploaded
```

**Solutions:**

A. **Check FormData key**
```typescript
// Must be 'image' (singular)
formData.append('image', file);  // ✅ Correct
formData.append('images', file); // ❌ Wrong
formData.append('file', file);   // ❌ Wrong
```

B. **Check multer configuration**
```typescript
// In routes
uploadSingle.single('image')  // Key must match FormData key
```

C. **Check file input**
```typescript
const file = e.target.files[0];  // Get first file
if (!file) {
  console.error('No file selected');
  return;
}
```

### Issue 2: 404 Not Found

**Browser Console Shows:**
```
POST http://localhost:5000/api/menu-simple/upload 404 (Not Found)
```

**Solutions:**

A. **Check route registration**
```typescript
// server.ts must have:
app.use('/api/menu-simple', menuSimpleRoutes);
```

B. **Check URL**
```typescript
// Correct
'http://localhost:5000/api/menu-simple/upload'

// Wrong
'http://localhost:5000/menu-simple/upload'  // Missing /api
'http://localhost:5000/api/menu/upload'     // Wrong endpoint
```

C. **Restart server**
```bash
# Stop server (Ctrl+C)
# Start again
npm run dev
```

### Issue 3: CORS Error

**Browser Console Shows:**
```
Access to fetch at 'http://localhost:5000/api/menu-simple/upload' 
from origin 'http://localhost:8080' has been blocked by CORS policy
```

**Solutions:**

A. **Check CORS configuration**
```typescript
// server.ts
app.use(cors({
  origin: [
    "http://localhost:8080",  // Must match frontend URL
    "http://localhost:5173"
  ],
  credentials: true
}));
```

B. **Check frontend URL**
```bash
# Frontend should run on port 8080
npm run dev
# Check output for: http://localhost:8080
```

C. **Clear browser cache**
```
Ctrl+Shift+Delete → Clear cache
Or use Incognito mode
```

### Issue 4: Image Not Saving to MongoDB

**Backend Console Shows:**
```
✅ File saved to disk: menu-1234567890.jpg
❌ MongoDB save error: ...
```

**Solutions:**

A. **Check MongoDB connection**
```bash
mongosh
use himalayan-pizza
db.menueimagesimples.find()
```

B. **Check model**
```typescript
// All required fields must be provided
{
  name: string,      // ✅
  filename: string,  // ✅
  url: string,       // ✅
  size: number       // ✅
}
```

C. **Check database name**
```env
# .env
MONGODB_URI=mongodb://localhost:27017/himalayan-pizza
```

### Issue 5: Images Not Displaying

**Browser Shows Broken Image Icon**

**Solutions:**

A. **Check image URL format**
```
Correct: http://localhost:5000/uploads/menu-1234567890.jpg
Wrong: http://localhost:5000/server/uploads/menu-1234567890.jpg
```

B. **Check static middleware**
```typescript
// server.ts
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));
```

C. **Check file exists**
```bash
ls -la server/uploads/
# Should show uploaded files
```

D. **Test direct access**
```
Open in browser: http://localhost:5000/uploads/menu-1234567890.jpg
Should display image
```

### Issue 6: File Size Too Large

**Backend Console Shows:**
```
❌ File too large
```

**Solutions:**

A. **Check multer limits**
```typescript
limits: {
  fileSize: 10 * 1024 * 1024  // 10MB
}
```

B. **Compress image**
```bash
# Use online tool or:
convert input.jpg -quality 85 output.jpg
```

### Issue 7: Invalid File Type

**Backend Console Shows:**
```
❌ File type rejected: application/pdf
```

**Solutions:**

A. **Check file filter**
```typescript
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
```

B. **Check file input accept**
```html
<input type="file" accept="image/*" />
```

C. **Verify file type**
```typescript
console.log('File type:', file.type);
// Should be: image/jpeg, image/png, etc.
```

## Step-by-Step Debug Process

### 1. Test Backend Endpoint

```bash
# Terminal 1 - Start server
cd server
npm run dev

# Terminal 2 - Test endpoint
curl http://localhost:5000/api/menu-simple
```

**Expected Response:**
```json
{
  "success": true,
  "count": 0,
  "data": []
}
```

### 2. Test File Upload with cURL

```bash
# Create test image
curl -o test.jpg https://via.placeholder.com/300

# Upload
curl -X POST http://localhost:5000/api/menu-simple/upload \
  -F "image=@test.jpg"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "id": "...",
    "name": "test.jpg",
    "filename": "menu-1234567890.jpg",
    "url": "http://localhost:5000/uploads/menu-1234567890.jpg",
    "size": 12345
  }
}
```

### 3. Verify File Saved

```bash
# Check uploads folder
ls -la server/uploads/

# Should show: menu-1234567890.jpg
```

### 4. Verify MongoDB

```bash
mongosh
use himalayan-pizza
db.menueimagesimples.find().pretty()
```

**Expected Output:**
```javascript
{
  _id: ObjectId("..."),
  name: "test.jpg",
  filename: "menu-1234567890.jpg",
  url: "http://localhost:5000/uploads/menu-1234567890.jpg",
  size: 12345,
  uploadDate: ISODate("..."),
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

### 5. Test Image Access

```bash
# Access image directly
curl http://localhost:5000/uploads/menu-1234567890.jpg

# Or open in browser
open http://localhost:5000/uploads/menu-1234567890.jpg
```

### 6. Test Frontend

```typescript
// In browser console
const formData = new FormData();
const input = document.createElement('input');
input.type = 'file';
input.accept = 'image/*';
input.onchange = async (e) => {
  const file = e.target.files[0];
  formData.append('image', file);
  
  const response = await fetch('http://localhost:5000/api/menu-simple/upload', {
    method: 'POST',
    body: formData
  });
  
  const data = await response.json();
  console.log('Response:', data);
};
input.click();
```

## Console Log Examples

### Successful Upload - Backend

```
========================================
📤 UPLOAD REQUEST RECEIVED
========================================
Method: POST
URL: /upload
File: {
  fieldname: 'image',
  originalname: 'menu.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  destination: '/path/to/uploads',
  filename: 'menu-1234567890.jpg',
  path: '/path/to/uploads/menu-1234567890.jpg',
  size: 245678
}
========================================

✅ File received: {
  originalname: 'menu.jpg',
  filename: 'menu-1234567890.jpg',
  mimetype: 'image/jpeg',
  size: 245678,
  path: '/path/to/uploads/menu-1234567890.jpg'
}
🔗 Generated URL: http://localhost:5000/uploads/menu-1234567890.jpg
💾 Saving to MongoDB...
✅ Saved to MongoDB: 65abc123...
📤 Sending response: {
  "success": true,
  "message": "Image uploaded successfully",
  "data": { ... }
}
========================================
```

### Successful Upload - Frontend

```
========================================
📁 FILE SELECTED
========================================
File details: {
  name: 'menu.jpg',
  type: 'image/jpeg',
  size: 245678,
  lastModified: 2024-01-15T10:30:00.000Z
}
========================================

========================================
🚀 STARTING UPLOAD
========================================
📦 Creating FormData...
✅ FormData created with key "image"
FormData contents:
  image: File { name: 'menu.jpg', ... }
📤 Sending POST request to: http://localhost:5000/api/menu-simple/upload
Request details: {
  method: 'POST',
  url: 'http://localhost:5000/api/menu-simple/upload',
  body: 'FormData with image'
}
📥 Response received: {
  status: 201,
  statusText: 'Created',
  ok: true
}
📦 Response data: {
  "success": true,
  "message": "Image uploaded successfully",
  "data": { ... }
}
✅ Upload successful!
========================================
```

## Files Created

### Backend
- `server/src/config/uploadSimple.ts` - Multer configuration
- `server/src/models/MenuImageSimple.ts` - MongoDB model
- `server/src/controllers/menuSimple.controller.ts` - Controller with logging
- `server/src/routes/menuSimple.routes.ts` - Routes with logging
- `server/src/server.ts` - Updated with routes and static serving

### Frontend
- `client/components/test/MenuUploadTest.tsx` - Test component with logging

## API Endpoints

### POST /api/menu-simple/upload
Upload a menu image

**Request:**
```
POST /api/menu-simple/upload
Content-Type: multipart/form-data

FormData:
  image: <file>
```

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "id": "65abc123...",
    "name": "menu.jpg",
    "filename": "menu-1234567890.jpg",
    "url": "http://localhost:5000/uploads/menu-1234567890.jpg",
    "size": 245678,
    "uploadDate": "2024-01-15T10:30:00.000Z"
  }
}
```

### GET /api/menu-simple
Get all menu images

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [...]
}
```

### DELETE /api/menu-simple/:id
Delete a menu image

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

### GET /uploads/:filename
Access uploaded image

**Example:**
```
http://localhost:5000/uploads/menu-1234567890.jpg
```

---

**Follow this guide step by step to debug your menu upload system!** 🐛
