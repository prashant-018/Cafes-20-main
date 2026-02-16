import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import type { Server } from 'socket.io';
import Settings from '../models/Settings';

let io: Server | undefined;

export const setSettingsSocketIO = (socketIO: Server) => {
  io = socketIO;
};

/**
 * GET /api/settings
 * Public: fetch current settings (single doc)
 */
export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await Settings.findOne();
    return res.status(200).json({
      success: true,
      data: settings || null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/settings
 * Admin-only: upsert settings document and emit realtime update
 */
export const upsertSettings = async (
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

    const { whatsappNumber, openingTime, closingTime, isManuallyOpen, brandStory, offersText } = req.body;

    const updated = await Settings.findOneAndUpdate(
      {},
      { whatsappNumber, openingTime, closingTime, isManuallyOpen, brandStory, offersText },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      }
    );

    // Realtime broadcast
    io?.emit('settingsUpdate', {
      data: updated,
      timestamp: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};



