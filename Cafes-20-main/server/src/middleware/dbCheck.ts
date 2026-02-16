import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

/**
 * Middleware to check if database is connected before processing requests
 */
export const checkDatabaseConnection = (req: Request, res: Response, next: NextFunction) => {
  const dbState = mongoose.connection.readyState;
  
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (dbState !== 1) {
    console.error('❌ Database not connected. State:', dbState);
    return res.status(503).json({
      success: false,
      message: 'Database connection unavailable. Please try again later.',
      dbState: {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
      }[dbState]
    });
  }
  
  next();
};
