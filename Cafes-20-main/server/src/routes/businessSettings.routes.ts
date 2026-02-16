import { Router } from 'express';
import { body } from 'express-validator';
import { authenticateAdmin } from '../middleware/auth.middleware';
import {
  getBusinessSettings,
  updateBusinessSettings,
} from '../controllers/businessSettings.controller';

const router = Router();

/**
 * @route   GET /api/business-settings
 * @desc    Get current business settings
 * @access  Public (frontend can read settings)
 */
router.get('/', getBusinessSettings);

/**
 * @route   PUT /api/business-settings
 * @desc    Create or update business settings
 * @access  Private (Admin only)
 */
router.put(
  '/',
  authenticateAdmin,
  [
    body('whatsappNumber')
      .trim()
      .notEmpty()
      .withMessage('WhatsApp number is required')
      .isLength({ min: 5, max: 20 })
      .withMessage('WhatsApp number must be between 5 and 20 characters'),
    body('openingTime')
      .trim()
      .notEmpty()
      .withMessage('Opening time is required'),
    body('closingTime')
      .trim()
      .notEmpty()
      .withMessage('Closing time is required'),
    body('isManuallyOpen')
      .isBoolean()
      .withMessage('isManuallyOpen must be a boolean'),
    body('brandStory')
      .optional()
      .isString()
      .withMessage('brandStory must be a string'),
  ],
  updateBusinessSettings
);

export default router;




