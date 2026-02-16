import { Request, Response } from 'express';
import MenuImageSimple from '../models/MenuImageSimple';

console.log('🎮 Loading menuSimple controller...');

/**
 * Upload menu image(s)
 * POST /api/menu-simple/upload
 */
export const uploadMenuImage = async (req: Request, res: Response) => {
  console.log('\n========================================');
  console.log('📤 UPLOAD REQUEST RECEIVED');
  console.log('========================================');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Body:', req.body);
  console.log('Files:', req.files);
  console.log('========================================\n');

  try {
    const files = req.files as Express.Multer.File[];

    // Check if files exist
    if (!files || files.length === 0) {
      console.log('❌ ERROR: No files uploaded');
      return res.status(400).json({
        success: false,
        message: 'No files uploaded. Please select image file(s).'
      });
    }

    console.log(`✅ ${files.length} file(s) received`);

    // Check existing images count BEFORE upload
    const existingCount = await MenuImageSimple.countDocuments();
    console.log(`📊 Existing images in database: ${existingCount}`);

    // Process all files
    const uploadedImages = [];
    const protocol = req.protocol;
    const host = req.get('host');

    for (const file of files) {
      console.log('Processing file:', {
        originalname: file.originalname,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path
      });

      // Generate full URL
      const imageUrl = `${protocol}://${host}/uploads/${file.filename}`;
      console.log('🔗 Generated URL:', imageUrl);

      // Save to MongoDB (ADDING, not replacing)
      const menuImage = new MenuImageSimple({
        name: file.originalname,
        filename: file.filename,
        url: imageUrl,
        size: file.size,
        uploadDate: new Date()
      });

      const savedImage = await menuImage.save();
      console.log('✅ Saved to MongoDB:', savedImage._id);

      uploadedImages.push(savedImage);
    }

    // Check total images count AFTER upload
    const totalCount = await MenuImageSimple.countDocuments();
    console.log(`📊 Total images in database after upload: ${totalCount}`);
    console.log(`➕ New images added: ${uploadedImages.length}`);
    console.log(`✅ Previous images preserved: ${existingCount}`);

    // Success response
    const response = {
      success: true,
      message: `${uploadedImages.length} image(s) uploaded successfully. Total images: ${totalCount}`,
      data: uploadedImages,
      totalCount: totalCount
    };

    console.log('📤 Sending response with', uploadedImages.length, 'new image(s)');
    console.log('========================================\n');

    res.status(201).json(response);
  } catch (error) {
    console.error('❌ UPLOAD ERROR:', error);
    console.log('========================================\n');

    res.status(500).json({
      success: false,
      message: 'Error uploading image(s)',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get all menu images
 * GET /api/menu-simple
 */
export const getMenuImages = async (req: Request, res: Response) => {
  console.log('\n========================================');
  console.log('📥 GET MENU IMAGES REQUEST');
  console.log('========================================');

  try {
    const images = await MenuImageSimple.find().sort({ uploadDate: -1 });

    console.log(`✅ Found ${images.length} images`);
    console.log('========================================\n');

    res.json({
      success: true,
      count: images.length,
      data: images
    });
  } catch (error) {
    console.error('❌ GET ERROR:', error);
    console.log('========================================\n');

    res.status(500).json({
      success: false,
      message: 'Error fetching images',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Delete menu image
 * DELETE /api/menu-simple/:id
 */
export const deleteMenuImage = async (req: Request, res: Response) => {
  console.log('\n========================================');
  console.log('🗑️ DELETE REQUEST');
  console.log('========================================');
  console.log('Image ID:', req.params.id);

  try {
    const image = await MenuImageSimple.findByIdAndDelete(req.params.id);

    if (!image) {
      console.log('❌ Image not found');
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    console.log('✅ Image deleted:', image.filename);
    console.log('========================================\n');

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('❌ DELETE ERROR:', error);
    console.log('========================================\n');

    res.status(500).json({
      success: false,
      message: 'Error deleting image',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

console.log('✅ menuSimple controller loaded');
