import { Router } from 'express';
import { body } from 'express-validator';
import { authenticateAdmin } from '../middleware/auth.middleware';
import { getSettings, upsertSettings } from '../controllers/settings.controller';

const router = Router();

/**
 * GET /api/settings
 * Public: frontend can read current settings
 */
router.get('/', getSettings);

/**
 * PUT /api/settings
 * Private: Admin only
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
    body('openingTime').trim().notEmpty().withMessage('Opening time is required'),
    body('closingTime').trim().notEmpty().withMessage('Closing time is required'),
    body('isManuallyOpen')
      .isBoolean()
      .withMessage('isManuallyOpen must be a boolean'),
    body('brandStory').optional().isString().withMessage('brandStory must be a string'),
  ],
  upsertSettings
);

export default router;