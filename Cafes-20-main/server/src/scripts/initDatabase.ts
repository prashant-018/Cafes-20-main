import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Import models to ensure they're registered
import '../models/Admin';
import '../models/User';
import '../models/Settings';
import '../models/MenuImageSimple';

const initDatabase = async () => {
  try {
    console.log('🚀 Starting database initialization...\n');

    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/himalayan-pizza';
    console.log('📡 Connecting to MongoDB...');
    console.log('URI:', mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')); // Hide password

    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected!\n');

    // Get database name
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    const dbName = db.databaseName;
    console.log(`📊 Database Name: ${dbName}\n`);

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('📁 Existing Collections:');
    if (collections.length === 0) {
      console.log('   (No collections yet)\n');
    } else {
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
      console.log('');
    }

    // Create initial collections if they don't exist
    console.log('🔨 Creating initial collections...\n');

    const collectionsToCreate = [
      { name: 'settings', model: 'Settings' },
      { name: 'admins', model: 'Admin' },
      { name: 'users', model: 'User' },
      { name: 'menuimagesimples', model: 'MenuImageSimple' }
    ];

    for (const col of collectionsToCreate) {
      try {
        const exists = collections.find(c => c.name === col.name);
        if (!exists) {
          await db.createCollection(col.name);
          console.log(`   ✅ Created collection: ${col.name}`);
        } else {
          console.log(`   ℹ️  Collection already exists: ${col.name}`);
        }
      } catch (error) {
        console.log(`   ⚠️  Could not create ${col.name}:`, error);
      }
    }

    console.log('\n✅ Database initialization complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Refresh MongoDB Compass');
    console.log('   2. You should now see the "himalayan-pizza" database');
    console.log('   3. Start your backend server: npm run dev\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
};

// Run initialization
initDatabase();
