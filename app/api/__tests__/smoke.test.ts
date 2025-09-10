// This is a placeholder for a smoke test file.
// In a local development environment, you could run this with a tool like `ts-node`
// to make live requests to your running Next.js application's API endpoints.

const API_BASE_URL = 'http://localhost:3000/api';

async function testGenerateEndpoint() {
  console.log('--- Testing POST /api/images/generate ---');
  try {
    const response = await fetch(`${API_BASE_URL}/images/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'a test prompt for a robot' }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`API returned error: ${JSON.stringify(data)}`);
    }
    console.log('✅ Generate endpoint returned success:', data);
    return true;
  } catch (error) {
    console.error('❌ Generate endpoint test failed:', error);
    return false;
  }
}


async function testArtifactsEndpoint() {
    console.log('--- Testing GET /api/artifacts ---');
    try {
      const response = await fetch(`${API_BASE_URL}/artifacts`);
      const data = await response.json();
       if (!response.ok) {
        throw new Error(`API returned error: ${JSON.stringify(data)}`);
    }
      console.log('✅ Artifacts endpoint returned success:', data);
      return true;
    } catch (error) {
      console.error('❌ Artifacts endpoint test failed:', error);
      return false;
    }
  }

async function runSmokeTests() {
  console.log('🚀 Starting API smoke tests...');
  const results = await Promise.all([
    testGenerateEndpoint(),
    testArtifactsEndpoint(),
  ]);
  
  const allPassed = results.every(Boolean);
  if (allPassed) {
    console.log('🎉 All smoke tests passed!');
  } else {
    console.error('🔥 Some smoke tests failed.');
    // In a CI/CD environment, you would exit with a non-zero code
    // process.exit(1);
  }
}

// To run this file: `ts-node app/api/__tests__/smoke.test.ts`
// Make sure your dev server (`next dev`) is running first.
// runSmokeTests();
