import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import BusinessSettings from '../models/BusinessSettings';

/**
 * GET /api/business-settings
 * Fetch the current business settings document.
 */
export const getBusinessSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const settings = await BusinessSettings.findOne();

    return res.status(200).json({
      success: true,
      data: settings || null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/business-settings
 * Create or update the single business settings document.
 */
export const updateBusinessSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { whatsappNumber, openingTime, closingTime, isManuallyOpen, brandStory } =
      req.body;

    let settings = await BusinessSettings.findOne();

    if (!settings) {
      settings = new BusinessSettings({
        whatsappNumber,
        openingTime,
        closingTime,
        isManuallyOpen,
        brandStory,
      });
    } else {
      settings.whatsappNumber = whatsappNumber;
      settings.openingTime = openingTime;
      settings.closingTime = closingTime;
      settings.isManuallyOpen = isManuallyOpen;
      settings.brandStory = brandStory;
    }

    const saved = await settings.save();

    return res.status(200).json({
      success: true,
      message: 'Business settings updated successfully',
      data: saved,
    });
  } catch (error) {
    next(error);
  }
};




