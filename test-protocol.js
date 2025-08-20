import axios from "axios";

// Test both HTTP and HTTPS to see which one works
async function testProtocols() {
  const urls = [
    "https://api-staging.paj.cash",
    "http://api-staging.paj.cash",
    "https://api.paj.cash",
    "http://api.paj.cash"
  ];

  for (const url of urls) {
    try {
      console.log(`\n🔍 Testing: ${url}`);
      
      const response = await axios.get(`${url}/pub/rate`, {
        timeout: 5000,
        validateStatus: () => true // Don't throw on any status code
      });
      
      console.log(`✅ SUCCESS: ${url}`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Protocol: ${url.startsWith('https') ? 'HTTPS' : 'HTTP'}`);
      
    } catch (error) {
      console.log(`❌ FAILED: ${url}`);
      console.log(`   Error: ${error.message}`);
      
      if (error.code === 'ECONNREFUSED') {
        console.log(`   Reason: Connection refused (server not running or wrong port)`);
      } else if (error.message.includes('wrong version number')) {
        console.log(`   Reason: Protocol mismatch (HTTPS client to HTTP server)`);
      } else if (error.message.includes('ENOTFOUND')) {
        console.log(`   Reason: Domain not found`);
      }
    }
  }
}

console.log("🚀 Testing PAJ API protocols...");
testProtocols().catch(console.error);
