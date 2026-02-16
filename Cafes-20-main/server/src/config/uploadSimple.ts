import multer from 'multer';
import path from 'path';
import fs from 'fs';

console.log('🔧 Configuring multer upload...');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
console.log('📁 Uploads directory path:', uploadsDir);

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory');
} else {
  console.log('✅ Uploads directory already exists');
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('📂 Setting destination for file:', file.originalname);
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = 'menu-' + uniqueSuffix + ext;
    console.log('📝 Generated filename:', filename);
    cb(null, filename);
  }
});

// File filter
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  console.log('🔍 Checking file:', {
    fieldname: file.fieldname,
    originalname: file.originalname,
    mimetype: file.mimetype
  });

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (allowedTypes.includes(file.mimetype)) {
    console.log('✅ File type accepted');
    cb(null, true);
  } else {
    console.log('❌ File type rejected:', file.mimetype);
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
  }
};

// Create multer instance
export const uploadSingle = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: fileFilter
});

console.log('✅ Multer configured successfully');
