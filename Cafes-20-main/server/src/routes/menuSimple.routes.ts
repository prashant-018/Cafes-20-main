import express from 'express';
import { uploadSingle } from '../config/uploadSimple';
import { authenticateAdmin } from '../middleware/auth.middleware';
import {
  uploadMenuImage,
  getMenuImages,
  deleteMenuImage
} from '../controllers/menuSimple.controller';

console.log('🛣️ Loading menuSimple routes...');

const router = express.Router();

// GET /api/menu-simple - Get all menu images
router.get('/', (req, res, next) => {
  console.log('🔀 Route hit: GET /api/menu-simple');
  next();
}, getMenuImages);

// POST /api/menu-simple/upload - Upload menu image
router.post('/upload',
  authenticateAdmin,
  (req, res, next) => {
    console.log('🔀 Route hit: POST /api/menu-simple/upload');
    console.log('Request headers:', req.headers);
    console.log('Content-Type:', req.get('content-type'));
    next();
  },
  uploadSingle.array('menuImages', 10),
  (req, res, next) => {
    console.log('🔀 After multer middleware');
    console.log('Files received:', req.files ? (req.files as any[]).length : 0);
    console.log('Files:', req.files);
    next();
  },
  uploadMenuImage
);

// DELETE /api/menu-simple/:id - Delete menu image
router.delete('/:id',
  authenticateAdmin,
  (req, res, next) => {
    console.log('🔀 Route hit: DELETE /api/menu-simple/:id');
    next();
  },
  deleteMenuImage
);

console.log('✅ menuSimple routes loaded');

export default router;
