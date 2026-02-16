/**
 * Environment Variable Validation Utility
 * Validates all required environment variables at server startup
 */

interface EnvValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate all required environment variables
 * @returns Validation result with errors and warnings
 */
export const validateEnvironment = (): EnvValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required variables
  const requiredVars = [
    { name: 'MONGODB_URI', description: 'MongoDB connection string' },
    { name: 'JWT_SECRET', description: 'JWT secret key for authentication' }
  ];

  // Optional but recommended variables
  const recommendedVars = [
    { name: 'JWT_EXPIRES_IN', description: 'JWT token expiration time', default: '7d' },
    { name: 'NODE_ENV', description: 'Environment (development/production)', default: 'development' },
    { name: 'PORT', description: 'Server port', default: '5000' },
    { name: 'CLIENT_URL', description: 'Frontend URL for CORS', default: 'http://localhost:8080' }
  ];

  console.log('\n🔍 Validating Environment Variables...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Check required variables
  requiredVars.forEach(({ name, description }) => {
    if (!process.env[name]) {
      errors.push(`${name} is not defined (${description})`);
      console.error(`❌ ${name}: NOT FOUND - ${description}`);
    } else {
      console.log(`✅ ${name}: Found`);

      // Additional validation for specific variables
      if (name === 'JWT_SECRET' && process.env[name]!.length < 32) {
        warnings.push(`${name} is too short (less than 32 characters). Use a longer secret for better security.`);
      }

      if (name === 'MONGODB_URI' && !process.env[name]!.startsWith('mongodb')) {
        errors.push(`${name} appears to be invalid (should start with 'mongodb://' or 'mongodb+srv://')`);
      }
    }
  });

  // Check recommended variables
  console.log('\n📋 Optional Variables:');
  recommendedVars.forEach(({ name, description, default: defaultValue }) => {
    if (!process.env[name]) {
      warnings.push(`${name} is not defined. Using default: ${defaultValue}`);
      console.warn(`⚠️  ${name}: Not set (using default: ${defaultValue})`);
    } else {
      console.log(`✅ ${name}: ${process.env[name]}`);
    }
  });

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Display summary
  if (errors.length > 0) {
    console.error('❌ Environment Validation Failed!\n');
    console.error('Missing Required Variables:');
    errors.forEach(error => console.error(`   • ${error}`));
    console.error('\n💡 To fix this:');
    console.error('   1. Create a .env file in the server directory');
    console.error('   2. Copy .env.example to .env');
    console.error('   3. Fill in all required values\n');
  }

  if (warnings.length > 0 && errors.length === 0) {
    console.warn('⚠️  Environment Validation Warnings:\n');
    warnings.forEach(warning => console.warn(`   • ${warning}`));
    console.warn('');
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ All environment variables validated successfully!\n');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Validate environment and exit if invalid
 * Use this at server startup to ensure all required variables are present
 */
export const validateEnvironmentOrExit = (): void => {
  const result = validateEnvironment();

  if (!result.isValid) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('🚨 Server cannot start due to missing environment variables');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(1);
  }
};
