# 🚀 Quick Test Guide - Menu Image Upload

## Prerequisites

1. **Add Cloudinary Credentials** to `server/.env`:
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Get from: https://cloudinary.com/console

2. **Start MongoDB**:
```bash
mongod
```

## Start Servers

```bash
# Terminal 1 - Backend
cd Cafes-20-main/server
npm run dev

# Terminal 2 - Frontend
cd Cafes-20-main
npm run dev
```

## Test Upload

1. Open: `http://localhost:8080/admin/dashboard`
2. Login: `admin@gmail.com` / `prashant123`
3. Click "Menu" in sidebar
4. Drag & drop OR click to select image
5. Watch console logs

## Expected Console Output

### Backend:
```
📸 Cloudinary configured
📤 Upload request received
📁 Files: [...]
🔄 Processing file: menu.jpg
☁️ Uploading to Cloudinary
✅ Cloudinary upload success
💾 Saved to MongoDB
📡 Broadcasting update
✅ Upload complete
```

### Frontend:
```
🎯 AdminDashboard: handleImageUpload called
📤 Uploading menu images: 1
🚀 Sending upload request
✅ Upload response
✅ Upload successful!
```

## Verify Results

✅ Success message in Admin Dashboard
✅ Image appears in grid
✅ Open `http://localhost:8080/menu` in new tab
✅ Image appears immediately (no refresh)

## Troubleshooting

**"No files uploaded"**
- Check FormData key is `menuImages`

**"Cloudinary upload error"**
- Verify credentials in `server/.env`
- Check quota at cloudinary.com/console

**"401 Unauthorized"**
- Logout and login again

**Images not showing**
- Check `GET /api/menu` in Network tab
- Verify CORS allows `http://localhost:8080`

---

See `MENU_COMPLETE_GUIDE.md` for detailed documentation.
