const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Installing The Himalayan Pizza Backend...\n');

try {
  // Check if package.json exists
  if (!fs.existsSync('package.json')) {
    console.error('❌ package.json not found. Make sure you are in the server directory.');
    process.exit(1);
  }

  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Check if .env exists
  if (!fs.existsSync('.env')) {
    console.log('📝 Creating .env file from .env.example...');
    if (fs.existsSync('.env.example')) {
      fs.copyFileSync('.env.example', '.env');
      console.log('✅ .env file created. Please update it with your configuration.');
    } else {
      console.log('⚠️  .env.example not found. Please create .env manually.');
    }
  }

  console.log('\n✅ Installation complete!');
  console.log('\n🔧 Next steps:');
  console.log('1. Update .env with your MongoDB URI and JWT secret');
  console.log('2. Make sure MongoDB is running');
  console.log('3. Run: npm run dev');
  console.log('\n🌟 Happy coding!');

} catch (error) {
  console.error('❌ Installation failed:', error.message);
  process.exit(1);
}