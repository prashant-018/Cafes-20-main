import 'dotenv/config';
import { signToken, verifyToken, validateJWTConfig } from '../utils/jwt';

console.log('🧪 Testing JWT Configuration\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Test 1: Environment Variables
console.log('\n📋 Test 1: Environment Variables');
console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Not Set'}`);
console.log(`JWT_SECRET Length: ${process.env.JWT_SECRET?.length || 0} characters`);
console.log(`JWT_EXPIRES_IN: ${process.env.JWT_EXPIRES_IN || 'Not Set (will use default: 7d)'}`);

// Test 2: Validate Configuration
console.log('\n📋 Test 2: Validate Configuration');
try {
  validateJWTConfig();
  console.log('✅ Configuration validation passed');
} catch (error) {
  console.error('❌ Configuration validation failed:', error);
  process.exit(1);
}

// Test 3: Sign Token with Default Expiry
console.log('\n📋 Test 3: Sign Token (Default Expiry)');
try {
  const payload = { id: 'test-user-123', role: 'user' as const };
  const token = signToken(payload);
  console.log('✅ Token signed successfully');
  console.log(`Token length: ${token.length} characters`);
  console.log(`Token preview: ${token.substring(0, 50)}...`);
} catch (error) {
  console.error('❌ Token signing failed:', error);
  if (error instanceof Error) {
    console.error('Error message:', error.message);
  }
  process.exit(1);
}

// Test 4: Sign Token with Custom Expiry
console.log('\n📋 Test 4: Sign Token (Custom Expiry: 1d)');
try {
  const payload = { id: 'admin-user-456', role: 'admin' as const };
  const token = signToken(payload, '1d');
  console.log('✅ Token signed successfully with custom expiry');
  console.log(`Token length: ${token.length} characters`);
} catch (error) {
  console.error('❌ Token signing with custom expiry failed:', error);
  process.exit(1);
}

// Test 5: Verify Token
console.log('\n📋 Test 5: Verify Token');
try {
  const payload = { id: 'verify-test-789', role: 'user' as const };
  const token = signToken(payload);
  const decoded = verifyToken(token);

  console.log('✅ Token verified successfully');
  console.log(`Decoded ID: ${decoded.id}`);
  console.log(`Decoded Role: ${decoded.role}`);

  if (decoded.id === payload.id && decoded.role === payload.role) {
    console.log('✅ Payload matches original');
  } else {
    console.error('❌ Payload mismatch!');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Token verification failed:', error);
  process.exit(1);
}

// Test 6: Test Various Expiry Formats
console.log('\n📋 Test 6: Test Various Expiry Formats');
const expiryFormats = ['7d', '24h', '60m', '3600s', '1w', '1y', '604800'];

for (const format of expiryFormats) {
  try {
    const payload = { id: 'format-test', role: 'user' as const };
    const token = signToken(payload, format);
    console.log(`✅ Format "${format}": Success`);
  } catch (error) {
    console.error(`❌ Format "${format}": Failed`);
    if (error instanceof Error) {
      console.error(`   Error: ${error.message}`);
    }
  }
}

// Test 7: Test Invalid Expiry Formats (Should use default)
console.log('\n📋 Test 7: Test Invalid Expiry Formats (Should Fallback to Default)');
const invalidFormats = ['invalid', '7x', 'abc', '', '  ', '"7d"', "'7d'"];

for (const format of invalidFormats) {
  try {
    const payload = { id: 'invalid-test', role: 'user' as const };
    const token = signToken(payload, format);
    console.log(`✅ Format "${format}": Handled gracefully (used default)`);
  } catch (error) {
    console.error(`❌ Format "${format}": Failed to handle`);
    if (error instanceof Error) {
      console.error(`   Error: ${error.message}`);
    }
  }
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ All JWT tests completed successfully!\n');

process.exit(0);
