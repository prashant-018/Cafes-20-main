import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

async function testAuth() {
  try {
    console.log('🔧 Testing Authentication System\n');

    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/himalayan-pizza';
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected!\n');

    // Test 1: Check if any users exist
    console.log('📊 Test 1: Checking existing users...');
    const userCount = await User.countDocuments();
    console.log(`   Found ${userCount} users in database\n`);

    if (userCount > 0) {
      const users = await User.find().select('+password').limit(5);
      console.log('   Sample users:');
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. Email: ${user.email}`);
        console.log(`      Name: ${user.name}`);
        console.log(`      Role: ${user.role}`);
        console.log(`      Has Password: ${!!user.password}`);
        console.log(`      Password Hash Length: ${user.password?.length || 0}`);
        console.log(`      Password starts with $2: ${user.password?.startsWith('$2') || false}`);
        console.log('');
      });
    }

    // Test 2: Create a test user
    console.log('📊 Test 2: Creating test user...');
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'test123456';

    try {
      const testUser = new User({
        name: 'Test User',
        email: testEmail,
        password: testPassword,
        role: 'user'
      });

      await testUser.save();
      console.log('   ✅ Test user created successfully');
      console.log(`   Email: ${testEmail}`);
      console.log(`   Password: ${testPassword}\n`);

      // Test 3: Retrieve and verify password
      console.log('📊 Test 3: Testing password verification...');
      const retrievedUser = await User.findOne({ email: testEmail }).select('+password');

      if (!retrievedUser) {
        console.log('   ❌ Could not retrieve test user');
        return;
      }

      console.log('   User retrieved successfully');
      console.log(`   Password hash: ${retrievedUser.password.substring(0, 20)}...`);
      console.log(`   Hash length: ${retrievedUser.password.length}`);

      // Test password comparison
      const isValid = await retrievedUser.comparePassword(testPassword);
      console.log(`   Password comparison result: ${isValid ? '✅ VALID' : '❌ INVALID'}`);

      // Test with wrong password
      const isInvalid = await retrievedUser.comparePassword('wrongpassword');
      console.log(`   Wrong password test: ${!isInvalid ? '✅ CORRECTLY REJECTED' : '❌ INCORRECTLY ACCEPTED'}`);

      // Test 4: Direct bcrypt comparison
      console.log('\n📊 Test 4: Direct bcrypt comparison...');
      const directCompare = await bcrypt.compare(testPassword, retrievedUser.password);
      console.log(`   Direct bcrypt.compare result: ${directCompare ? '✅ VALID' : '❌ INVALID'}`);

      // Clean up test user
      await User.deleteOne({ email: testEmail });
      console.log('\n   🧹 Test user cleaned up');

    } catch (error: any) {
      console.error('   ❌ Error creating test user:', error.message);
    }

    // Test 5: Check for existing user to test login
    console.log('\n📊 Test 5: Testing with existing user (if any)...');
    const existingUser = await User.findOne().select('+password');

    if (existingUser) {
      console.log(`   Found user: ${existingUser.email}`);
      console.log('   Try logging in with this email and the password you used during registration');
      console.log(`   Password hash format: ${existingUser.password.substring(0, 7)}...`);
      console.log(`   Hash is bcrypt format: ${existingUser.password.startsWith('$2') ? '✅ YES' : '❌ NO'}`);
    } else {
      console.log('   No existing users found. Please register a new user first.');
    }

    console.log('\n✅ Authentication test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n📡 MongoDB connection closed');
    process.exit(0);
  }
}

testAuth();
