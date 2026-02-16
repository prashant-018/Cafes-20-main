# 🚀 Menu Upload Quick Start Guide

## 5-Minute Setup

### Step 1: Start Backend (Terminal 1)

```bash
cd Cafes-20-main/server
npm run dev
```

**Expected Output:**
```
📁 Created uploads directory: /path/to/server/uploads
📁 Static uploads folder configured: /path/to/server/uploads
✅ Connected to MongoDB
🚀 Server running on port 5000
📡 Socket.IO enabled
```

### Step 2: Start Frontend (Terminal 2)

```bash
cd Cafes-20-main
npm run dev
```

**Expected Output:**
```
VITE ready in 500ms
➜  Local:   http://localhost:8080/
```

### Step 3: Test Upload

1. **Open Admin Dashboard**
   ```
   http://localhost:8080/admin/dashboard
   ```

2. **Login**
   - Email: `admin@gmail.com`
   - Password: `prashant123`

3. **Navigate to Menu Section**
   - Click "Menu" in sidebar

4. **Upload Image**
   - Drag and drop an image OR
   - Click "Select Files" button
   - Choose a menu image (JPEG, PNG, or WebP)
   - Wait for success message

5. **Verify Upload**
   - Image should appear in the grid below
   - Check `server/uploads/` folder - file should be there
   - Open MongoDB - document should be created

### Step 4: Test User Display

1. **Open User Website**
   ```
   http://localhost:8080
   ```

2. **Navigate to Menu Section**
   - Scroll down or click "Menu" in navbar

3. **Verify Display**
   - Uploaded images should appear
   - Click image to view full size
   - Images persist after page refresh

## ✅ Success Indicators

### Backend Console
```
📤 POST /api/menu-local/upload - Upload request received
📁 Files: [ { fieldname: 'menuImages', originalname: 'menu.jpg', ... } ]
📦 Processing 1 file(s)
🔄 Processing file: menu.jpg
✅ File saved to disk: menu-1234567890-menu.jpg
🔗 Image URL: http://localhost:5000/uploads/menu-1234567890-menu.jpg
💾 Saved to MongoDB: 65abc123...
📡 Broadcasting update for 1 image(s)
✅ Upload complete: Successfully uploaded 1 image(s)
```

### Frontend Console
```
📤 Starting upload for 1 file(s)
📁 Added file to FormData: menu.jpg
🚀 Sending upload request to: http://localhost:5000/api/menu-local/upload
📥 Upload response: { success: true, data: [...] }
📡 Menu update received: { event: 'imagesAdded', data: [...] }
```

### Admin Dashboard
- ✅ Success toast appears
- ✅ Image appears in grid
- ✅ Can delete image
- ✅ Can view full size

### User Website
- ✅ Images load on page load
- ✅ Responsive grid layout
- ✅ Hover effects work
- ✅ Click opens full size
- ✅ Real-time updates (no refresh needed)

## 🔧 Integration Code

### Admin Dashboard Integration

Add to `AdminDashboard.tsx`:

```typescript
import { MenuImageUpload } from '@/components/admin/MenuImageUpload';
import { useMenuImagesLocal } from '@/hooks/useMenuImagesLocal';

// Inside component
const { images, refreshImages } = useMenuImagesLocal(true);

// In Menu section
{activeSection === 'menu' && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    <MenuImageUpload
      images={images}
      onUploadSuccess={refreshImages}
      onDeleteImage={() => refreshImages()}
    />
  </motion.div>
)}
```

### User Menu Page Integration

Add to `Menu.tsx`:

```typescript
import { MenuDisplay } from '@/components/user/MenuDisplay';

// Inside component
<section id="menu" className="py-24 bg-background">
  <div className="max-w-7xl mx-auto px-6">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      <h2 className="text-5xl font-serif font-bold text-white mb-4">
        Our Menu
      </h2>
      <p className="text-xl text-muted-foreground">
        Explore our delicious offerings
      </p>
    </motion.div>

    <MenuDisplay />
  </div>
</section>
```

## 📊 API Endpoints

### Upload Image (Admin)
```
POST /api/menu-local/upload
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data

FormData:
  menuImages: <file>
  menuImages: <file>  (multiple files supported)
```

### Get Images (Public)
```
GET /api/menu-local

Response:
{
  "success": true,
  "count": 3,
  "data": [...]
}
```

### Delete Image (Admin)
```
DELETE /api/menu-local/:id
Authorization: Bearer <admin-token>
```

### Access Image (Public)
```
GET /uploads/menu-1234567890-menu.jpg
```

## 🐛 Quick Troubleshooting

### Images Not Showing?

1. **Check uploads folder exists**
   ```bash
   ls -la server/uploads/
   ```

2. **Check static middleware**
   - Open `server/src/server.ts`
   - Look for: `app.use('/uploads', express.static(...))`

3. **Check image URL format**
   - Should be: `http://localhost:5000/uploads/filename.jpg`
   - NOT: `http://localhost:5000/server/uploads/filename.jpg`

### Upload Fails?

1. **Check admin token**
   ```javascript
   console.log(localStorage.getItem('adminToken'));
   ```

2. **Check FormData key**
   - Must be `menuImages` (plural)

3. **Check file type**
   - Only JPEG, PNG, WebP allowed

### CORS Error?

1. **Check backend CORS config**
   ```typescript
   origin: ["http://localhost:8080"]
   ```

2. **Check frontend API URL**
   ```typescript
   VITE_API_URL=http://localhost:5000/api
   ```

## 📁 File Locations

**Backend:**
- Middleware: `server/src/middleware/upload.ts`
- Model: `server/src/models/MenuImageLocal.ts`
- Controller: `server/src/controllers/menuLocal.controller.ts`
- Routes: `server/src/routes/menuLocal.routes.ts`
- Server: `server/src/server.ts`
- Uploads: `server/uploads/` (auto-created)

**Frontend:**
- Admin Component: `client/components/admin/MenuImageUpload.tsx`
- User Component: `client/components/user/MenuDisplay.tsx`
- Hook: `client/hooks/useMenuImagesLocal.ts`

## 🎯 Next Steps

1. **Customize Styling**
   - Update colors in components
   - Adjust grid layout
   - Add animations

2. **Add Features**
   - Image cropping
   - Bulk delete
   - Image reordering
   - Categories

3. **Optimize**
   - Image compression
   - Lazy loading
   - CDN integration
   - Caching

4. **Deploy**
   - Set up cloud storage
   - Configure CDN
   - Update URLs
   - Test production

---

**Your menu upload system is ready to use!** 🎉

For detailed documentation, see `LOCAL_MENU_UPLOAD_COMPLETE.md`
