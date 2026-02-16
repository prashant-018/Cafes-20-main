import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import { signToken } from '../utils/jwt';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📝 Registration attempt:', {
      body: { ...req.body, password: '[HIDDEN]' },
      headers: req.headers['content-type']
    });

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const { name, email, password, role } = req.body;
    console.log('✅ Validation passed for:', { name, email, role });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
      return;
    }

    // Create new user
    console.log('🔄 Creating new user...');
    const user = new User({
      name,
      email,
      password,
      role: role || 'user' // Default to 'user' if not specified
    });

    await user.save();
    console.log('✅ User created successfully:', user._id);

    // Generate JWT token
    const token = signToken({
      id: user._id.toString(),
      role: user.role
    });
    console.log('✅ JWT token generated');

    // Remove password from response
    const userResponse = user.toJSON();

    console.log('✅ Registration successful for:', email);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    console.error('❌ Register error:', error);

    // Handle MongoDB duplicate key error
    if ((error as any).code === 11000) {
      res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔐 Login attempt:', { email: req.body.email });

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Login validation errors:', errors.array());
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('❌ User not found:', email);
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      console.log('❌ Invalid password for:', email);
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    // Generate JWT token
    const token = signToken({
      id: user._id.toString(),
      role: user.role
    });

    // Remove password from response
    const userResponse = user.toJSON();

    console.log('✅ Login successful for:', email);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);

    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
};

/**
 * Admin login with hardcoded credentials
 * POST /api/auth/admin/login
 */
export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔐 Admin login attempt:', { email: req.body.email });

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Admin login validation errors:', errors.array());
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const { email, password } = req.body;

    // Hardcoded admin credentials
    const ADMIN_EMAIL = 'admin@gmail.com';
    const ADMIN_PASSWORD = 'prashant123';

    // Validate admin credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      console.log('❌ Invalid admin credentials for:', email);
      res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
      return;
    }

    // Generate JWT token with 1 day expiry
    const token = signToken({
      id: 'admin-hardcoded', // Hardcoded admin ID
      role: 'admin'
    }, '1d'); // 1 day expiry for admin tokens

    const adminData = {
      email: ADMIN_EMAIL,
      name: 'Admin',
      role: 'admin'
    };

    console.log('✅ Admin login successful');
    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: adminData
    });
  } catch (error) {
    console.error('❌ Admin login error:', error);

    res.status(500).json({
      success: false,
      message: 'Internal server error during admin login'
    });
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: {
        user: req.user.toJSON()
      }
    });
  } catch (error) {
    console.error('❌ Get profile error:', error);

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};