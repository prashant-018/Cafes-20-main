import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    // Get MongoDB URI from environment variable
    const mongoURI = process.env.MONGODB_URI;

    // Validation: Ensure MONGODB_URI is set
    if (!mongoURI) {
      console.error('❌ MONGODB_URI is not defined in environment variables');
      console.error('💡 Please check your .env file');
      process.exit(1);
    }

    // Log connection attempt (hide password for security)
    const safeURI = mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
    console.log('\n🔄 Attempting to connect to MongoDB...');
    console.log(`📡 Connection URI: ${safeURI}`);

    // Extract database name from URI
    const dbNameMatch = mongoURI.match(/\/([^/?]+)(\?|$)/);
    const dbName = dbNameMatch ? dbNameMatch[1] : 'unknown';
    console.log(`📊 Database Name: ${dbName}`);

    // Connect to MongoDB with modern options
    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    // Success message
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`📂 Database: ${conn.connection.name}`);
    console.log(`🔌 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Unknown'}`);
    console.log('');

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      console.error('💡 Check your connection string and network access');
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
      console.log('🔄 Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully');
    });

    mongoose.connection.on('connected', () => {
      console.log('🔗 MongoDB connection established');
    });

  } catch (error) {
    console.error('\n❌ Failed to connect to MongoDB');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (error instanceof Error) {
      console.error('Error Message:', error.message);

      // Provide specific error guidance
      if (error.message.includes('ENOTFOUND')) {
        console.error('\n💡 DNS Error: Cannot resolve MongoDB host');
        console.error('   - Check your internet connection');
        console.error('   - Verify the cluster URL is correct');
      } else if (error.message.includes('authentication failed')) {
        console.error('\n💡 Authentication Error');
        console.error('   - Check username and password in connection string');
        console.error('   - Verify database user has correct permissions');
      } else if (error.message.includes('ETIMEDOUT')) {
        console.error('\n💡 Connection Timeout');
        console.error('   - Check if your IP is whitelisted in MongoDB Atlas');
        console.error('   - Verify network/firewall settings');
      } else {
        console.error('\n💡 General Connection Error');
        console.error('   - Verify MONGODB_URI in .env file');
        console.error('   - Check MongoDB Atlas cluster status');
        console.error('   - Ensure database user exists and has permissions');
      }
    } else {
      console.error('Unknown error:', error);
    }

    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(1);
  }
};

export default connectDB;