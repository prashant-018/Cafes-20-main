import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import User, { IUser } from '../models/User';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

/**
 * Protect middleware - Verify JWT token and attach user to request
 */
export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
      return;
    }

    try {
      // Verify token
      const decoded = verifyToken(token);

      // Get user from database
      const user = await User.findById(decoded.id);

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Token is valid but user no longer exists'
        });
        return;
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
      return;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error in authentication'
    });
  }
};

/**
 * Authorize middleware - Check if user has required role
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
      return;
    }

    next();
  };
};

/**
 * Admin authentication middleware
 * Verifies JWT token for admin access
 */
export const authenticateAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. Admin authentication required.'
      });
      return;
    }

    try {
      // Verify token
      const decoded = verifyToken(token);

      // Check if user has admin role
      if (decoded.role !== 'admin') {
        res.status(403).json({
          success: false,
          message: 'Access denied. Admin privileges required.'
        });
        return;
      }

      // For hardcoded admin, we don't need to fetch from DB
      if (decoded.id === 'admin-hardcoded') {
        req.user = {
          _id: 'admin-hardcoded',
          role: 'admin',
          email: 'admin@gmail.com'
        } as any;
        next();
        return;
      }

      // For regular admin users from DB
      const user = await User.findById(decoded.id);

      if (!user || user.role !== 'admin') {
        res.status(403).json({
          success: false,
          message: 'Access denied. Admin privileges required.'
        });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Admin token verification error:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid or expired admin token'
      });
      return;
    }
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error in admin authentication'
    });
  }
};

// Export AuthRequest type for use in routes
export interface AuthRequest extends Request {
  user?: IUser;
}