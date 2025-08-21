const { Keypair } = require('@solana/web3.js');
const bs58 = require('bs58');
const fs = require('fs');
const path = require('path');

console.log('Generating new shop wallet for NFT Pass minting...\n');

// Generate new keypair
const keypair = Keypair.generate();

// Get wallet details
const publicKey = keypair.publicKey.toString();
const privateKeyBase58 = bs58.encode(keypair.secretKey);
const privateKeyArray = Array.from(keypair.secretKey);

console.log('=== WALLET DETAILS ===\n');
console.log('Public Key (Wallet Address):');
console.log(publicKey);
console.log('\nPrivate Key (Base58):');
console.log(privateKeyBase58);
console.log('\n=== IMPORTANT ===\n');
console.log('1. Save the private key (Base58) in your .env.local file as SHOP_PRIVATE_KEY');
console.log('2. Fund this wallet with at least 0.1 SOL for transaction fees');
console.log('3. NEVER share or commit your private key to version control');
console.log('\n=== NEXT STEPS ===\n');
console.log('1. Copy this to your .env.local file:');
console.log(`SHOP_PRIVATE_KEY=${privateKeyBase58}`);
console.log('\n2. Send SOL to your shop wallet:');
console.log(`   Wallet Address: ${publicKey}`);
console.log('\n3. Your shop wallet will:');
console.log('   - Receive USDC payments from NFT mints');
console.log('   - Sign NFT minting transactions');
console.log('   - Pay transaction fees (needs SOL)');

// Optionally save to a secure file (for backup)
const walletInfo = {
  publicKey,
  privateKeyBase58,
  privateKeyArray,
  generatedAt: new Date().toISOString(),
  purpose: 'Solstudio NFT Pass Shop Wallet'
};

const outputPath = path.join(__dirname, `shop-wallet-${Date.now()}.json`);
fs.writeFileSync(outputPath, JSON.stringify(walletInfo, null, 2));

console.log(`\nWallet info saved to: ${outputPath}`);
console.log('⚠️  Keep this file secure and delete it after saving the key in .env.local'); 