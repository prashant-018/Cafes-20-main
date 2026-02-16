import { Response } from 'express';
import { Server } from 'socket.io';
import MenuImageLocal from '../models/MenuImageLocal';
import { AuthRequest } from '../middleware/auth.middleware';
import { deleteFile, getFileUrl } from '../middleware/upload';

let io: Server;

export const setMenuSocketIO = (socketIO: Server) => {
  io = socketIO;
};

// Helper function to emit real-time updates
const emitMenuUpdate = (event: string, data: any) => {
  if (io) {
    io.emit('menuUpdate', { event, data, timestamp: new Date() });
    console.log('📡 Socket.IO: Emitted menuUpdate event:', event);
  }
};

/**
 * @route   GET /api/menu-local
 * @desc    Get all active menu images
 * @access  Public
 */
export const getMenuImages = async (req: AuthRequest, res: Response) => {
  try {
    console.log('📥 GET /api/menu-local - Fetching menu images');

    const menuImages = await MenuImageLocal.find({ isActive: true })
      .sort({ uploadDate: -1 })
      .lean();

    console.log(`✅ Found ${menuImages.length} active menu images`);

    res.json({
      success: true,
      count: menuImages.length,
      data: menuImages
    });
  } catch (error) {
    console.error('❌ Error fetching menu images:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching menu images',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * @route   GET /api/menu-local/:id
 * @desc    Get single menu image by ID
 * @access  Public
 */
export const getMenuImageById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`📥 GET /api/menu-local/${id} - Fetching menu image`);

    const menuImage = await MenuImageLocal.findOne({
      _id: id,
      isActive: true
    }).lean();

    if (!menuImage) {
      return res.status(404).json({
        success: false,
        message: 'Menu image not found'
      });
    }

    console.log('✅ Menu image found:', menuImage.name);

    res.json({
      success: true,
      data: menuImage
    });
  } catch (error) {
    console.error('❌ Error fetching menu image:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching menu image',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * @route   POST /api/menu-local/upload
 * @desc    Upload new menu images (multiple files supported)
 * @access  Private (Admin only)
 */
export const uploadMenuImages = async (req: AuthRequest, res: Response) => {
  try {
    console.log('📤 POST /api/menu-local/upload - Upload request received');
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

        // Generate full URL
        const imageUrl = getFileUrl(file.filename, req);

        console.log(`✅ File saved to disk: ${file.filename}`);
        console.log(`🔗 Image URL: ${imageUrl}`);

        // Save to MongoDB
        const menuImage = new MenuImageLocal({
          name: file.originalname,
          filename: file.filename,
          url: imageUrl,
          size: file.size,
          mimeType: file.mimetype,
          uploadDate: new Date()
        });

        const savedImage = await menuImage.save();
        console.log(`💾 Saved to MongoDB: ${savedImage._id}`);

        uploadedImages.push(savedImage);
      } catch (error) {
        console.error(`❌ Error processing ${file.originalname}:`, error);

        // Delete file from disk if database save failed
        if (file.filename) {
          deleteFile(file.filename);
        }

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
      message: error instanceof Error ? error.message : 'Error uploading menu images',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * @route   DELETE /api/menu-local/:id
 * @desc    Delete menu image by ID
 * @access  Private (Admin only)
 */
export const deleteMenuImage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ DELETE /api/menu-local/${id} - Delete request received`);

    const menuImage = await MenuImageLocal.findById(id);

    if (!menuImage) {
      return res.status(404).json({
        success: false,
        message: 'Menu image not found'
      });
    }

    console.log(`🔄 Deleting image: ${menuImage.name}`);

    // Delete file from disk
    try {
      deleteFile(menuImage.filename);
    } catch (fileError) {
      console.error('⚠️ Error deleting file from disk:', fileError);
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database
    await MenuImageLocal.findByIdAndDelete(id);
    console.log('✅ Deleted from MongoDB');

    // Emit real-time update
    emitMenuUpdate('imageDeleted', { id });

    res.json({
      success: true,
      message: 'Menu image deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error('❌ Error deleting menu image:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting menu image',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * @route   PUT /api/menu-local/:id
 * @desc    Update menu image metadata
 * @access  Private (Admin only)
 */
export const updateMenuImage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;

    console.log(`🔄 PUT /api/menu-local/${id} - Update request received`);

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (isActive !== undefined) updateData.isActive = isActive;

    const menuImage = await MenuImageLocal.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!menuImage) {
      return res.status(404).json({
        success: false,
        message: 'Menu image not found'
      });
    }

    console.log('✅ Menu image updated:', menuImage.name);

    // Emit real-time update
    emitMenuUpdate('imageUpdated', menuImage);

    res.json({
      success: true,
      message: 'Menu image updated successfully',
      data: menuImage
    });
  } catch (error) {
    console.error('❌ Error updating menu image:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating menu image',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * @route   GET /api/menu-local/admin/all
 * @desc    Get all menu images including inactive ones (Admin only)
 * @access  Private (Admin only)
 */
export const getAllMenuImages = async (req: AuthRequest, res: Response) => {
  try {
    console.log('📥 GET /api/menu-local/admin/all - Fetching all menu images');

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const menuImages = await MenuImageLocal.find()
      .sort({ uploadDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await MenuImageLocal.countDocuments();

    console.log(`✅ Found ${menuImages.length} menu images (total: ${total})`);

    res.json({
      success: true,
      count: menuImages.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: menuImages
    });
  } catch (error) {
    console.error('❌ Error fetching all menu images:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching menu images',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
