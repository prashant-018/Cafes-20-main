import jwt from 'jsonwebtoken';

export interface JWTPayload {
  id: string;
  role: 'user' | 'admin';
}

/**
 * Sign a JWT token
 * @param payload - User ID and role
 * @param customExpiry - Optional custom expiry (e.g., '1d' for admin)
 * @returns JWT token
 */
export const signToken = (payload: JWTPayload, customExpiry?: string): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = customExpiry || process.env.JWT_EXPIRES_IN || '7d';

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(payload, secret, {
    expiresIn,
    issuer: 'himalayan-pizza-api',
    audience: 'himalayan-pizza-client'
  });
};

/**
 * Verify a JWT token
 * @param token - JWT token to verify
 * @returns Decoded payload
 */
export const verifyToken = (token: string): JWTPayload => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  try {
    const decoded = jwt.verify(token, secret, {
      issuer: 'himalayan-pizza-api',
      audience: 'himalayan-pizza-client'
    }) as JWTPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    } else {
      throw new Error('Token verification failed');
    }
  }
};