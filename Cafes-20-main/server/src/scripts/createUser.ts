import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User';
import readline from 'readline';

// Load environment variables
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createUser() {
  try {
    console.log('🔧 User Creation Tool\n');

    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/himalayan-pizza';
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected!\n');

    // Get user details
    const name = await question('Enter name: ');
    const email = await question('Enter email: ');
    const password = await question('Enter password (min 6 chars): ');
    const roleInput = await question('Enter role (user/admin) [default: user]: ');
    const role = roleInput.toLowerCase() === 'admin' ? 'admin' : 'user';

    // Validate inputs
    if (!name || name.length < 2) {
      console.log('❌ Name must be at least 2 characters');
      process.exit(1);
    }

    if (!email || !email.includes('@')) {
      console.log('❌ Invalid email address');
      process.exit(1);
    }

    if (!password || password.length < 6) {
      console.log('❌ Password must be at least 6 characters');
      process.exit(1);
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User with this email already exists');
      process.exit(1);
    }

    // Create user
    console.log('\n🔄 Creating user...');
    const user = new User({
      name,
      email,
      password,
      role
    });

    await user.save();

    console.log('\n✅ User created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 User Details:');
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   ID: ${user._id}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating user:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the script
createUser();
