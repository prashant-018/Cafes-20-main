// Test script to verify auth endpoints are working
const testAuth = async () => {
  const baseURL = 'http://localhost:5000/api';
  
  console.log('🧪 Testing Authentication Endpoints...\n');

  // Test 1: Health check
  try {
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await fetch(`${baseURL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.message);
  } catch (error) {
    console.log('❌ Health check failed:', e