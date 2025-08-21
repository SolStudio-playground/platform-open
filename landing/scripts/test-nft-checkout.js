const { PublicKey, Keypair } = require('@solana/web3.js');

// Test wallet address (replace with a wallet that has USDC)
const TEST_WALLET = 'YOUR_TEST_WALLET_ADDRESS';

async function testCheckout() {
  console.log('Testing NFT Checkout API...\n');

  const apiUrl = 'http://localhost:8085/api/nft-pass/checkout';
  
  try {
    // Test GET endpoint
    console.log('Testing GET endpoint...');
    const getResponse = await fetch(apiUrl);
    const getResult = await getResponse.json();
    console.log('GET Response:', getResult);

    // Test POST endpoint
    console.log('\nTesting POST endpoint...');
    const postResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account: TEST_WALLET
      })
    });

    const postResult = await postResponse.json();
    
    if (postResponse.ok) {
      console.log('✅ Transaction created successfully!');
      console.log('Message:', postResult.message);
      console.log('Transaction base64 length:', postResult.transaction.length);
      
      // Decode and inspect transaction
      const transactionBuffer = Buffer.from(postResult.transaction, 'base64');
      console.log('Transaction size:', transactionBuffer.length, 'bytes');
    } else {
      console.error('❌ Error:', postResult.error);
    }

  } catch (error) {
    console.error('Failed to call API:', error);
  }
}

// Check if wallet address is provided
if (TEST_WALLET === 'YOUR_TEST_WALLET_ADDRESS') {
  console.error('Please update TEST_WALLET with a valid wallet address that has USDC');
  console.log('\nUsage:');
  console.log('1. Edit this file and replace TEST_WALLET with your wallet address');
  console.log('2. Make sure the wallet has at least 10 USDC');
  console.log('3. Run: node scripts/test-nft-checkout.js');
} else {
  testCheckout();
} 