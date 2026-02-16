# 🎉 Complete Local Menu Image Upload System

## ✅ Implementation Complete

A production-ready menu image upload system with local file storage, MongoDB integration, and real-time synchronization.

## 📁 File Structure

### Backend Files Created

```
server/
├── src/
│   ├── middleware/
│   │   └── upload.ts                    # Multer configuration for local storage
│   ├── models/
│   │   └── MenuImageLocal.ts            # MongoDB schema for menu images
│   ├── controllers/
│   │   └── menuLocal.controller.ts      # Business logic for menu operations
│   ├── routes/
│   │   └── menuLocal.routes.ts          # API routes
│   └── server.ts                        # Updated with static file serving
└── uploads/                             # Auto-created folder for images
```

### Frontend Files Created

```
client/
├── components/
│   ├── admin/
│   │   └── MenuImageUpload.tsx          # Admin upload component
│   └── user/
│       └── MenuDisplay.tsx              # User menu display component
└── hooks/
    └── useMenuImagesLocal.ts            # Custom hook for menu images
```

## 🚀 Features

### Backend Features

✅ **Multer Configuration**
- Local disk storage in `/uploads` folder
- Unique filename generation
- File type validation (JPEG, PNG, WebP)
- File size limit (10MB)
- Auto-creates uploads directory

✅ **Static File Serving**
- Express static middleware
- Accessible at `http://localhost:5000/uploads/filename.jpg`
- CORS enabled for cross-origin requests

✅ **MongoDB Integration**
- MenuImageLocal model with validation
- Stores filename, URL, size, mimeType
- Timestamps and active status
- Indexed for performance

✅ **RESTful API**
- GET `/api/menu-local` - Get all active images (public)
- GET `/api/menu-local/:id` - Get single image (public)
- POST `/api/menu-local/upload` - Upload images (admin)
- DELETE `/api/menu-local/:id` - Delete image (admin)
- PUT `/api/menu-local/:id` - Update metadata (admin)
- GET `/api/menu-local/admin/all` - Get all images (admin)

✅ **Real-Time Updates**
- Socket.IO integration
- Broadcasts on upload/delete/update
- Admin and user rooms

✅ **Error Handling**
- Comprehensive error messages
- File cleanup on failure
- Validation errors
- Authentication errors

### Frontend Features

✅ **Admin Upload Component**
- Drag and drop support
- Multiple file upload
- File validation
- Upload progress
- Success/error messages
- Image preview grid
- Delete confirmation
- Real-time updates

✅ **User Display Component**
- Responsive grid layout
- Loading states
- Error handling
- Hover effects
- Click to view full size
- Real-time updates

✅ **Custom Hook**
- Fetch images on mount
- Socket.IO listeners
- Loading and error states
- Refresh function
- Admin/user mode

## 📡 API Endpoints

### Public Endpoints

**GET /api/menu-local**
```bash
curl http://localhost:5000/api/menu-local
```

Response:
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "65abc123...",
      "name": "menu-page-1.jpg",
      "filename": "menu-1234567890-menu-page-1.jpg",
      "url": "http://localhost:5000/uploads/menu-1234567890-menu-page-1.jpg",
      "size": 245678,
      "mimeType": "image/jpeg",
      "uploadDate": "2024-01-15T10:30:00.000Z",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**GET /api/menu-local/:id**
```bash
curl http://localhost:5000/api/menu-local/65abc123...
```

### Admin Endpoints (Require JWT Token)

**POST /api/menu-local/upload**
```bash
curl -X POST http://localhost:5000/api/menu-local/upload \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -F "menuImages=@/path/to/image1.jpg" \
  -F "menuImages=@/path/to/image2.jpg"
```

Response:
```json
{
  "success": true,
  "message": "Successfully uploaded 2 image(s)",
  "data": [
    {
      "id": "65abc123...",
      "name": "image1.jpg",
      "filename": "menu-1234567890-image1.jpg",
      "url": "http://localhost:5000/uploads/menu-1234567890-image1.jpg",
      "size": 245678,
      "mimeType": "image/jpeg",
      "uploadDate": "2024-01-15T10:30:00.000Z",
      "isActive": true
    }
  ]
}
```

**DELETE /api/menu-local/:id**
```bash
curl -X DELETE http://localhost:5000/api/menu-local/65abc123... \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**PUT /api/menu-local/:id**
```bash
curl -X PUT http://localhost:5000/api/menu-local/65abc123... \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Menu", "isActive": true}'
```

**GET /api/menu-local/admin/all**
```bash
curl http://localhost:5000/api/menu-local/admin/all?page=1&limit=20 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## 🔧 Setup Instructions

### 1. Install Dependencies

Backend already has required packages:
- `multer` - File upload handling
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `socket.io` - Real-time communication

### 2. Start Backend

```bash
cd Cafes-20-main/server
npm run dev
```

Backend console should show:
```
📁 Created uploads directory: /path/to/server/uploads
📁 Static uploads folder configured: /path/to/server/uploads
🚀 Server running on port 5000
```

### 3. Start Frontend

```bash
cd Cafes-20-main
npm run dev
```

Frontend runs on: `http://localhost:8080`

### 4. Test Upload

1. Open Admin Dashboard: `http://localhost:8080/admin/dashboard`
2. Login: `admin@gmail.com` / `prashant123`
3. Navigate to Menu section
4. Upload a menu image
5. Check `server/uploads/` folder - file should be there
6. Check MongoDB - document should be created

### 5. Test User Display

1. Open user website: `http://localhost:8080`
2. Navigate to Menu section
3. Should see uploaded images
4. Click image to view full size

## 📊 Data Flow

### Upload Flow

```
┌─────────────────────────────────────────────────────────┐
│                  Admin Dashboard                         │
│  1. User selects image file(s)                          │
│  2. Clicks upload or drops files                         │
│  3. MenuImageUpload component validates files           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Frontend Upload Logic                       │
│  4. Creates FormData                                     │
│  5. Appends files with key 'menuImages'                 │
│  6. POST /api/menu-local/upload                          │
│  7. Authorization: Bearer <admin-token>                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Backend Server                          │
│  8. CORS check                                           │
│  9. Auth middleware verifies admin token                │
│  10. Multer receives files                              │
│  11. Saves files to /uploads folder                     │
│  12. Generates unique filenames                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Upload Controller                       │
│  13. Loop through each file                              │
│  14. Generate full URL                                   │
│  15. Create MenuImageLocal document                      │
│  16. Save to MongoDB                                     │
│  17. Add to uploadedImages array                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Response & Broadcast                        │
│  18. Emit Socket.IO: 'menuUpdate'                        │
│  19. Return success response with data                   │
│  20. Frontend receives response                          │
│  21. useMenuImagesLocal updates images array            │
│  22. Components re-render                                │
│  23. New images appear                                   │
└─────────────────────────────────────────────────────────┘
```

### Display Flow

```
┌─────────────────────────────────────────────────────────┐
│                  User Website Load                       │
│  1. MenuDisplay component mounts                         │
│  2. useMenuImagesLocal hook runs                         │
│  3. Calls fetchImages()                                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Frontend Fetch Logic                        │
│  4. GET /api/menu-local                                  │
│  5. No authentication required (public)                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Backend Server                          │
│  6. menuLocal.controller.getMenuImages()                │
│  7. MenuImageLocal.find({ isActive: true })             │
│  8. Returns array of image documents                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Frontend Display                            │
│  9. useMenuImagesLocal stores images                    │
│  10. MenuDisplay component renders grid                 │
│  11. Images load from URLs                              │
│  12. Socket.IO listener ready for updates               │
└─────────────────────────────────────────────────────────┘
```

## 🧪 Testing

### Test 1: Upload Single Image

```bash
# Get admin token first
TOKEN=$(curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"prashant123"}' \
  | jq -r '.token')

# Upload image
curl -X POST http://localhost:5000/api/menu-local/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "menuImages=@/path/to/menu.jpg"
```

### Test 2: Upload Multiple Images

```bash
curl -X POST http://localhost:5000/api/menu-local/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "menuImages=@/path/to/menu1.jpg" \
  -F "menuImages=@/path/to/menu2.jpg" \
  -F "menuImages=@/path/to/menu3.jpg"
```

### Test 3: Fetch Images

```bash
curl http://localhost:5000/api/menu-local
```

### Test 4: Access Image Directly

```bash
# Get filename from upload response
curl http://localhost:5000/uploads/menu-1234567890-menu.jpg
```

### Test 5: Delete Image

```bash
# Get image ID from fetch response
curl -X DELETE http://localhost:5000/api/menu-local/IMAGE_ID \
  -H "Authorization: Bearer $TOKEN"
```

## 🐛 Troubleshooting

### Issue 1: Images Not Displaying

**Symptom:** Images show broken icon

**Solutions:**

A. Check uploads folder exists
```bash
ls -la server/uploads/
```

B. Check file permissions
```bash
chmod 755 server/uploads/
chmod 644 server/uploads/*
```

C. Check static middleware
```typescript
// server.ts should have:
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
```

D. Check image URL format
```
Correct: http://localhost:5000/uploads/menu-1234567890-menu.jpg
Wrong: http://localhost:5000/server/uploads/menu.jpg
```

### Issue 2: Upload Fails with 400

**Symptom:** "No files uploaded" error

**Solutions:**

A. Check FormData key
```typescript
// Must be 'menuImages' (plural)
formData.append('menuImages', file);
```

B. Check multer configuration
```typescript
// routes/menuLocal.routes.ts
upload.array('menuImages', 10)  // Key must match
```

C. Check file type
```typescript
// Only JPEG, PNG, WebP allowed
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
```

### Issue 3: 401 Unauthorized

**Symptom:** Upload fails with authentication error

**Solutions:**

A. Check admin token exists
```javascript
const token = localStorage.getItem('adminToken');
console.log('Token:', token);
```

B. Check Authorization header
```typescript
headers: {
  'Authorization': `Bearer ${token}`  // Must have 'Bearer ' prefix
}
```

C. Login again
```
Navigate to /admin/login and login again
```

### Issue 4: CORS Error

**Symptom:** "Access to fetch blocked by CORS policy"

**Solutions:**

A. Check CORS configuration
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

B. Check frontend API URL
```typescript
// .env or code
VITE_API_URL=http://localhost:5000/api
```

### Issue 5: File Not Saved to Disk

**Symptom:** Upload succeeds but file not in uploads folder

**Solutions:**

A. Check uploads directory path
```typescript
// middleware/upload.ts
const uploadsDir = path.join(__dirname, '../../uploads');
console.log('Uploads dir:', uploadsDir);
```

B. Check disk space
```bash
df -h
```

C. Check write permissions
```bash
ls -ld server/uploads/
# Should show: drwxr-xr-x
```

### Issue 6: MongoDB Save Fails

**Symptom:** File saved but not in database

**Solutions:**

A. Check MongoDB connection
```bash
# Check if MongoDB is running
mongosh
```

B. Check model validation
```typescript
// All required fields must be provided
{
  name: string,
  filename: string,
  url: string,
  size: number,
  mimeType: string
}
```

C. Check database name
```typescript
// .env
MONGODB_URI=mongodb://localhost:27017/himalayan-pizza
```

## 📝 Integration with Admin Dashboard

Update `AdminDashboard.tsx` to use the new component:

```typescript
import { MenuImageUpload } from '@/components/admin/MenuImageUpload';
import { useMenuImagesLocal } from '@/hooks/useMenuImagesLocal';

// Inside component
const { images, refreshImages } = useMenuImagesLocal(true);

// In Menu section
{activeSection === 'menu' && (
  <MenuImageUpload
    images={images}
    onUploadSuccess={refreshImages}
    onDeleteImage={() => refreshImages()}
  />
)}
```

## 📝 Integration with User Menu Page

Update `Menu.tsx` to use the new component:

```typescript
import { MenuDisplay } from '@/components/user/MenuDisplay';

// Inside component
<section id="menu" className="py-24">
  <div className="max-w-7xl mx-auto px-6">
    <h2 className="text-4xl font-serif font-bold text-white text-center mb-12">
      Our Menu
    </h2>
    <MenuDisplay />
  </div>
</section>
```

## 🔒 Security Considerations

✅ **File Validation**
- File type checking
- File size limits
- Filename sanitization

✅ **Authentication**
- Admin-only upload/delete
- JWT token verification
- Public read access

✅ **Error Handling**
- No sensitive data in errors
- Proper HTTP status codes
- Cleanup on failure

✅ **CORS**
- Whitelist specific origins
- Credentials support
- Proper headers

## 🚀 Production Deployment

### Environment Variables

```env
# Backend .env
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-domain.com
MONGODB_URI=mongodb://your-mongo-uri
JWT_SECRET=your-secret-key
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:8080;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
    }

    # Static uploads
    location /uploads {
        proxy_pass http://localhost:5000/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### File Storage Considerations

For production, consider:
- Cloud storage (AWS S3, Cloudinary)
- CDN for faster delivery
- Image optimization
- Backup strategy

## 📊 Database Schema

```javascript
{
  _id: ObjectId("65abc123..."),
  name: "menu-page-1.jpg",
  filename: "menu-1234567890-menu-page-1.jpg",
  url: "http://localhost:5000/uploads/menu-1234567890-menu-page-1.jpg",
  size: 245678,
  mimeType: "image/jpeg",
  uploadDate: ISODate("2024-01-15T10:30:00.000Z"),
  isActive: true,
  createdAt: ISODate("2024-01-15T10:30:00.000Z"),
  updatedAt: ISODate("2024-01-15T10:30:00.000Z")
}
```

## ✅ Checklist

- [x] Multer middleware configured
- [x] Uploads folder auto-created
- [x] Static file serving enabled
- [x] MongoDB model created
- [x] Controller with all CRUD operations
- [x] Routes with authentication
- [x] Socket.IO real-time updates
- [x] Admin upload component
- [x] User display component
- [x] Custom hook for data fetching
- [x] Error handling
- [x] Loading states
- [x] File validation
- [x] CORS configuration
- [x] Comprehensive documentation

---

**Your complete local menu image upload system is ready!** 🎉

Upload images in Admin Dashboard and they'll appear instantly on the user website with full persistence and real-time sync.
