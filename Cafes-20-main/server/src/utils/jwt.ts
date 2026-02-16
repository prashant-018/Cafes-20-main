import jwt from 'jsonwebtoken';

export interface JWTPayload {
  id: string;
  role: 'user' | 'admin';
}

// Default JWT expiration time
const DEFAULT_JWT_EXPIRES_IN = '7d';

// Valid time span formats for JWT
const VALID_TIME_SPANS = ['s', 'm', 'h', 'd', 'w', 'y'];

/**
 * Sanitize and validate JWT expiration time
 * Removes whitespace, quotes, and validates format
 * @param expiresIn - Raw expiration time from environment or parameter
 * @returns Sanitized expiration time or default
 */
const sanitizeExpiresIn = (expiresIn: string | undefined): string => {
  if (!expiresIn) {
    return DEFAULT_JWT_EXPIRES_IN;
  }

  // Remove whitespace and quotes
  let sanitized = expiresIn.trim().replace(/['"]/g, '');

  // If empty after sanitization, use default
  if (!sanitized) {
    console.warn('⚠️  JWT_EXPIRES_IN is empty after sanitization. Using default: 7d');
    return DEFAULT_JWT_EXPIRES_IN;
  }

  // Validate format: should be a number followed by a time unit (s, m, h, d, w, y)
  // Or just a number (seconds)
  const timeSpanRegex = /^(\d+)([smhdwy]?)$/i;
  const match = sanitized.match(timeSpanRegex);

  if (!match) {
    console.warn(`⚠️  Invalid JWT_EXPIRES_IN format: "${expiresIn}". Using default: 7d`);
    console.warn('   Valid formats: "7d", "24h", "60m", "3600s", "1w", "1y"');
    return DEFAULT_JWT_EXPIRES_IN;
  }

  const [, number, unit] = match;

  // If no unit specified, it's seconds (must be a number)
  if (!unit) {
    return number; // Return as string number (seconds)
  }

  // Validate unit
  if (!VALID_TIME_SPANS.includes(unit.toLowerCase())) {
    console.warn(`⚠️  Invalid time unit in JWT_EXPIRES_IN: "${unit}". Using default: 7d`);
    return DEFAULT_JWT_EXPIRES_IN;
  }

  return `${number}${unit.toLowerCase()}`;
};

/**
 * Validate JWT configuration at startup
 * This should be called when the server starts to ensure JWT_SECRET is available
 * @throws Error if JWT_SECRET is not defined
 */
export const validateJWTConfig = (): void => {
  if (!process.env.JWT_SECRET) {
    console.error('\n❌ CRITICAL ERROR: JWT_SECRET is not defined in environment variables');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('💡 JWT_SECRET is required for authentication to work.');
    console.error('');
    console.error('To fix this:');
    console.error('1. Create a .env file in the server directory if it doesn\'t exist');
    console.error('2. Add this line to your .env file:');
    console.error('   JWT_SECRET=your-super-secret-key-here-make-it-long-and-random');
    console.error('');
    console.error('For production, use a strong random string (at least 32 characters).');
    console.error('You can generate one using: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  // Validate JWT_SECRET strength (at least 32 characters recommended)
  const secret = process.env.JWT_SECRET.trim();
  if (secret.length < 32) {
    console.warn('\n⚠️  WARNING: JWT_SECRET is too short (less than 32 characters)');
    console.warn('   For production, use a longer secret key for better security.\n');
  }

  // Validate and sanitize JWT_EXPIRES_IN
  const expiresIn = sanitizeExpiresIn(process.env.JWT_EXPIRES_IN);
  console.log(`✅ JWT configuration validated successfully`);
  console.log(`   JWT_EXPIRES_IN: ${expiresIn}`);
};

/**
 * Get JWT secret safely
 * @returns JWT secret (trimmed and sanitized)
 * @throws Error if JWT_SECRET is not defined
 */
const getJWTSecret = (): string => {
  const secret = process.env.JWT_SECRET?.trim();

  if (!secret) {
    // This should never happen if validateJWTConfig() is called at startup
    console.error('❌ JWT_SECRET is not available. Server configuration error.');
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return secret;
};

/**
 * Get JWT expiration time safely
 * @param customExpiry - Optional custom expiry (e.g., '1d' for admin)
 * @returns Sanitized expiration time
 */
const getJWTExpiresIn = (customExpiry?: string): string => {
  // Priority: customExpiry > JWT_EXPIRES_IN > default
  if (customExpiry) {
    return sanitizeExpiresIn(customExpiry);
  }

  return sanitizeExpiresIn(process.env.JWT_EXPIRES_IN);
};

/**
 * Sign a JWT token (Production-Safe)
 * @param payload - User ID and role
 * @param customExpiry - Optional custom expiry (e.g., '1d' for admin)
 * @returns JWT token
 * 
 * Features:
 * - Sanitizes JWT_SECRET (removes whitespace/quotes)
 * - Sanitizes JWT_EXPIRES_IN (validates format)
 * - Uses safe default if JWT_EXPIRES_IN is invalid
 * - Prevents crashes from malformed environment variables
 * - Logs warnings for invalid configurations
 */
export const signToken = (payload: JWTPayload, customExpiry?: string): string => {
  try {
    const secret = getJWTSecret();
    const expiresIn = getJWTExpiresIn(customExpiry);

    const token = jwt.sign(payload, secret, {
      expiresIn,
      issuer: 'himalayan-pizza-api',
      audience: 'himalayan-pizza-client'
    });

    return token;
  } catch (error) {
    // Log detailed error for debugging
    console.error('❌ Error signing JWT token:', error);

    if (error instanceof Error) {
      console.error('Error message:', error.message);

      // Provide helpful error messages
      if (error.message.includes('expiresIn')) {
        console.error('💡 JWT_EXPIRES_IN format is invalid.');
        console.error('   Valid formats: "7d", "24h", "60m", "3600s", "1w", "1y"');
        console.error(`   Current value: "${process.env.JWT_EXPIRES_IN}"`);
        console.error('   Using default: 7d');

        // Retry with default value
        const secret = getJWTSecret();
        return jwt.sign(payload, secret, {
          expiresIn: DEFAULT_JWT_EXPIRES_IN,
          issuer: 'himalayan-pizza-api',
          audience: 'himalayan-pizza-client'
        });
      }
    }

    throw error;
  }
};

/**
 * Verify a JWT token
 * @param token - JWT token to verify
 * @returns Decoded payload
 */
export const verifyToken = (token: string): JWTPayload => {
  const secret = getJWTSecret();

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