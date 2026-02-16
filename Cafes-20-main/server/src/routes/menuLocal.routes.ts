import express from 'express';
import { authenticateAdmin } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload';
import {
  getMenuImages,
  getMenuImageById,
  uploadMenuImages,
  deleteMenuImage,
  updateMenuImage,
  getAllMenuImages,
  setMenuSocketIO
} from '../controllers/menuLocal.controller';
import { Server } from 'socket.io';

const router = express.Router();

// Export function to set Socket.IO instance
export const setSocketIO = (io: Server) => {
  setMenuSocketIO(io);
};

/**
 * Public Routes
 */

// GET /api/menu-local - Get all active menu images
router.get('/', getMenuImages);

// GET /api/menu-local/:id - Get single menu image by ID
router.get('/:id', getMenuImageById);

/**
 * Admin Routes (Protected)
 */

// POST /api/menu-local/upload - Upload menu images
router.post(
  '/upload',
  authenticateAdmin,
  upload.array('menuImages', 10), // Allow up to 10 files with field name 'menuImages'
  uploadMenuImages
);

// DELETE /api/menu-local/:id - Delete menu image
router.delete('/:id', authenticateAdmin, deleteMenuImage);

// PUT /api/menu-local/:id - Update menu image metadata
router.put('/:id', authenticateAdmin, updateMenuImage);

// GET /api/menu-local/admin/all - Get all menu images (including inactive)
router.get('/admin/all', authenticateAdmin, getAllMenuImages);

export default router;
