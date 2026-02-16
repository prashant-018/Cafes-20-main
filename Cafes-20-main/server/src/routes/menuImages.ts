import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { MenuImage } from '../models/MenuImage';
import { authenticateAdmin, AuthRequest } from '../middleware/auth.middleware';
import { upload, deleteFromCloudinary, uploadToCloudinary } from '../config/cloudinary';
import { Server } from 'socket.io';

const router = express.Router();

// Store Socket.IO instance
let io: Server;

export const setSocketIO = (socketIO: Server) => {
  io = socketIO;
};

// Helper function to emit real-time updates
const emitMenuUpdate = (event: string, data: any) => {
  if (io) {
    io.emit('menuUpdate', { event, data, timestamp: new Date() });
  }
};

/**
 * @route   GET /api/menu
 * @desc    Get all active menu images
 * @access  Public (used by both admin and user website)
 */
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const menuImages = await MenuImage.find({ isActive: true })
      .sort({ uploadDate: -1 })
      .select('-cloudinaryId');

    res.json({
      success: true,
      count: menuImages.length,
      data: menuImages
    });
  } catch (error) {
    console.error('Error fetching menu images:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching menu images'
    });
  }
});

/**
 * @route   GET /api/menu/:id
 * @desc    Get single menu image by ID
 * @access  Public
 */
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const menuImage = await MenuImage.findOne({
      _id: req.params.id,
      isActive: true
    }).select('-cloudinaryId');

    if (!menuImage) {
      return res.status(404).json({
        success: false,
        message: 'Menu image not found'
      });
    }

    res.json({
      success: true,
      data: menuImage
    });
  } catch (error) {
    console.error('Error fetching menu image:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching menu image'
    });
  }
});

/**
 * @route   POST /api/menu/upload
 * @desc    Upload new menu images (multiple files supported)
 * @access  Private (Admin only)
 */
router.post('/upload',
  authenticateAdmin,
  upload.array('menuImages', 10), // Allow up to 10 files
  async (req: AuthRequest, res: Response) => {
    try {
      console.log('📤 Upload request received');
      console.log('📁 Files:', req.files);
      console.log('📝 Body:', req.body);

      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        console.log('❌ No files uploaded');
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }

      console.log(`📦 Processing ${files.length} file(s)`);

      const uploadedImages = [];
      const errors = [];

      // Process each uploaded file
      for (const file of files) {
        try {
          console.log(`🔄 Processing file: ${file.originalname}`);

          // Upload buffer to Cloudinary
          const cloudinaryResult = await uploadToCloudinary(file.buffer, file.originalname);

          console.log(`✅ Cloudinary upload successful for: ${file.originalname}`);

          const menuImage = new MenuImage({
            name: file.originalname,
            url: cloudinaryResult.secure_url,
            cloudinaryId: cloudinaryResult.public_id,
            size: file.size,
            mimeType: file.mimetype,
            uploadDate: new Date()
          });

          const savedImage = await menuImage.save();
          console.log(`💾 Saved to MongoDB: ${savedImage._id}`);

          uploadedImages.push(savedImage);
        } catch (error) {
          console.error(`❌ Error processing ${file.originalname}:`, error);
          errors.push({
            filename: file.originalname,
            error: error instanceof Error ? error.message : 'Failed to save to database'
          });
        }
      }

      // Emit real-time update
      if (uploadedImages.length > 0) {
        console.log(`📡 Broadcasting update for ${uploadedImages.length} image(s)`);
        emitMenuUpdate('imagesAdded', uploadedImages);
      }

      const response: any = {
        success: true,
        message: `Successfully uploaded ${uploadedImages.length} image(s)`,
        data: uploadedImages
      };

      if (errors.length > 0) {
        response.errors = errors;
        response.message += ` with ${errors.length} error(s)`;
      }

      console.log('✅ Upload complete:', response.message);
      res.status(201).json(response);
    } catch (error) {
      console.error('❌ Upload error:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error uploading menu images'
      });
    }
  }
);

/**
 * @route   DELETE /api/menu/:id
 * @desc    Delete menu image by ID
 * @access  Private (Admin only)
 */
router.delete('/:id',
  authenticateAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const menuImage = await MenuImage.findById(req.params.id);

      if (!menuImage) {
        return res.status(404).json({
          success: false,
          message: 'Menu image not found'
        });
      }

      // Delete from Cloudinary
      try {
        await deleteFromCloudinary(menuImage.cloudinaryId);
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError);
        // Continue with database deletion even if Cloudinary fails
      }

      // Delete from database
      await MenuImage.findByIdAndDelete(req.params.id);

      // Emit real-time update
      emitMenuUpdate('imageDeleted', { id: req.params.id });

      res.json({
        success: true,
        message: 'Menu image deleted successfully',
        data: { id: req.params.id }
      });
    } catch (error) {
      console.error('Error deleting menu image:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting menu image'
      });
    }
  }
);

/**
 * @route   PUT /api/menu/:id
 * @desc    Update menu image metadata
 * @access  Private (Admin only)
 */
router.put('/:id',
  authenticateAdmin,
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Name must be between 1 and 255 characters'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean')
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array()
        });
      }

      const { name, isActive } = req.body;
      const updateData: any = {};

      if (name !== undefined) updateData.name = name;
      if (isActive !== undefined) updateData.isActive = isActive;

      const menuImage = await MenuImage.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).select('-cloudinaryId');

      if (!menuImage) {
        return res.status(404).json({
          success: false,
          message: 'Menu image not found'
        });
      }

      // Emit real-time update
      emitMenuUpdate('imageUpdated', menuImage);

      res.json({
        success: true,
        message: 'Menu image updated successfully',
        data: menuImage
      });
    } catch (error) {
      console.error('Error updating menu image:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating menu image'
      });
    }
  }
);

/**
 * @route   GET /api/menu/admin/all
 * @desc    Get all menu images including inactive ones (Admin only)
 * @access  Private (Admin only)
 */
router.get('/admin/all',
  authenticateAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;

      const menuImages = await MenuImage.find()
        .sort({ uploadDate: -1 })
        .skip(skip)
        .limit(limit)
        .select('-cloudinaryId');

      const total = await MenuImage.countDocuments();

      res.json({
        success: true,
        count: menuImages.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: menuImages
      });
    } catch (error) {
      console.error('Error fetching all menu images:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching menu images'
      });
    }
  }
);

export default router;