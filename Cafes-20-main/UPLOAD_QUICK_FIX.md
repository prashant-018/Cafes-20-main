# ⚡ Menu Upload Quick Fix

## 🚀 Start Servers

```bash
# Terminal 1 - Backend
cd Cafes-20-main/server
npm run dev

# Terminal 2 - Frontend  
cd Cafes-20-main
npm run dev
```

## ✅ Test Upload (Browser Console)

```javascript
// Quick test in browser console (F12)
const input = document.createElement('input');
input.type = 'file';
input.accept = 'image/*';
input.onchange = async (e) => {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append('image', file);  // Key must be 'image'
  
  const response = await fetch('http://localhost:5000/api/menu-simple/upload', {
    method: 'POST',
    body: formData
  });
  
  const data = await response.json();
  console.log('Result:', data);
};
input.click();
```

## 📊 Check Results

### Backend Console Should Show:
```
📤 UPLOAD REQUEST RECEIVED
✅ File received: menu-1234567890.jpg
💾 Saving to MongoDB...
✅ Saved to MongoDB
```

### Browser Console Should Show:
```
Result: {
  success: true,
  message: "Image uploaded successfully",
  data: { ... }
}
```

### Verify File Saved:
```bash
ls -la server/uploads/
# Should show: menu-1234567890.jpg
```

### Access Image:
```
http://localhost:5000/uploads/menu-1234567890.jpg
```

## 🐛 If Not Working

### 1. Check Backend Running
```bash
curl http://localhost:5000/api/health
# Should return: {"success":true,...}
```

### 2. Check Route Exists
```bash
curl http://localhost:5000/api/menu-simple
# Should return: {"success":true,"count":0,"data":[]}
```

### 3. Check Uploads Folder
```bash
ls -la server/uploads/
# Should exist
```

### 4. Check MongoDB
```bash
mongosh
use himalayan-pizza
db.menueimagesimples.find()
```

### 5. Check CORS
```typescript
// server.ts should have:
app.use(cors({
  origin: ["http://localhost:8080"]
}));
```

## 📝 Integration Code

### Add Test Page to App.tsx:
```typescript
import { MenuUploadTest } from '@/components/test/MenuUploadTest';

// Add route
<Route path="/test-upload" element={<MenuUploadTest />} />
```

### Visit:
```
http://localhost:8080/test-upload
```

## 🔑 Key Points

1. **FormData key must be 'image'** (singular)
2. **Don't set Content-Type header** (browser does it)
3. **Backend route:** `/api/menu-simple/upload`
4. **Static files:** `/uploads/filename.jpg`
5. **Check console logs** for detailed debugging

## 📁 Files Created

- `server/src/config/uploadSimple.ts`
- `server/src/models/MenuImageSimple.ts`
- `server/src/controllers/menuSimple.controller.ts`
- `server/src/routes/menuSimple.routes.ts`
- `client/components/test/MenuUploadTest.tsx`

## 🎯 Expected Flow

1. User selects image file
2. Frontend creates FormData with key 'image'
3. POST to `/api/menu-simple/upload`
4. Multer saves file to `/uploads` folder
5. Controller saves URL to MongoDB
6. Returns success response
7. Image accessible at `/uploads/filename.jpg`

---

**Everything is set up with extensive logging. Check console for details!** 🎉
