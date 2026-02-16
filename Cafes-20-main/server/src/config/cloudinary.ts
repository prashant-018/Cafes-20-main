import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || '123456789012345',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo-secret-key',
});

console.log('📸 Cloudinary configured:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'demo',
});

// Memory storage for multer (files stored in memory before uploading to Cloudinary)
const memoryStorage = multer.memoryStorage();

// Configure multer with memory storage
export const upload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files at once
  },
  fileFilter: (req, file, cb) => {
    console.log('📁 File received:', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });

    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Helper function to upload buffer to Cloudinary
export const uploadToCloudinary = (buffer: Buffer, filename: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const publicId = `menu-${timestamp}-${randomString}`;

    console.log('☁️ Uploading to Cloudinary:', { filename, publicId });

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'himalayan-pizza/menu-images',
        public_id: publicId,
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 1600, crop: 'limit', quality: 'auto:good' },
          { fetch_format: 'auto' }
        ],
      },
      (error, result) => {
        if (error) {
          console.error('❌ Cloudinary upload error:', error);
          reject(error);
        } else {
          console.log('✅ Cloudinary upload success:', {
            url: result?.secure_url,
            public_id: result?.public_id
          });
          resolve(result);
        }
      }
    );

    uploadStream.end(buffer);
  });
};

// Helper function to delete image from Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    console.log('🗑️ Deleting from Cloudinary:', publicId);
    await cloudinary.uploader.destroy(publicId);
    console.log('✅ Deleted from Cloudinary:', publicId);
  } catch (error) {
    console.error('❌ Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete image from storage');
  }
};

export { cloudinary };