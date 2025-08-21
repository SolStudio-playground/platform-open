# NFT Pass Setup Guide

This guide will help you set up the NFT Pass minting functionality on your Solstudio platform.

## Overview

The NFT Pass feature allows users to mint an exclusive NFT that grants them access to premium features on the Solstudio platform. Users can pay with USDC to mint their pass.

## Features

- NFT minting with USDC payment
- Solana Pay QR code integration
- Wallet adapter integration
- Beautiful UI with payment options
- Transaction confirmation and tracking

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the `landing` directory with the following variables:

```env
# RPC Endpoint
NEXT_PUBLIC_RPC_ENDPOINT=https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY

# NFT Configuration
NEXT_PUBLIC_NFT_METADATA_URI=https://arweave.net/YOUR_METADATA_URI
NEXT_PUBLIC_NFT_PRICE=10

# Shop wallet private key (base58 encoded)
# This wallet will receive USDC payments and sign NFT minting transactions
SHOP_PRIVATE_KEY=YOUR_SHOP_WALLET_PRIVATE_KEY_BASE58
```

### 2. Generate Shop Wallet

You need a shop wallet that will:
- Receive USDC payments
- Sign NFT minting transactions

To generate a new wallet:

```javascript
const { Keypair } = require('@solana/web3.js');
const bs58 = require('bs58');

const keypair = Keypair.generate();
console.log('Public Key:', keypair.publicKey.toString());
console.log('Private Key (base58):', bs58.encode(keypair.secretKey));
```

⚠️ **Important**: Keep your private key secure and never commit it to version control!

### 3. Upload NFT Metadata

1. Run the metadata generation script:
   ```bash
   cd landing
   node scripts/upload-nft-metadata.js
   ```

2. Update the generated `nft-metadata.json` file with:
   - Your NFT image URI
   - Your creator wallet address

3. Upload the metadata to Arweave or IPFS using services like:
   - Bundlr (https://bundlr.network/)
   - Pinata (https://pinata.cloud/)
   - NFT.Storage (https://nft.storage/)

4. Update `NEXT_PUBLIC_NFT_METADATA_URI` in your `.env.local` with the uploaded metadata URI

### 4. Fund Your Shop Wallet

Your shop wallet needs SOL for transaction fees:
- Send at least 0.1 SOL to your shop wallet address
- This will cover NFT minting transaction fees

### 5. Prepare Test Wallet

Before testing, ensure your test wallet has:
- At least 0.02 SOL for transaction fees
- At least 10 USDC (or the amount set in NEXT_PUBLIC_NFT_PRICE)

To get USDC on mainnet:
- Buy from an exchange and withdraw to your wallet
- Use a DEX like Jupiter to swap SOL for USDC

To get USDC on devnet for testing:
- Visit https://spl-token-faucet.com/ to get devnet USDC

### 6. Test the Implementation

1. Start the landing page:
   ```bash
   cd landing
   npm run dev
   ```

2. Navigate to `/nft-pass` in your browser

3. Test both payment methods:
   - Connect wallet and mint directly
   - Scan QR code with a Solana Pay compatible wallet

## Customization

### Modify NFT Details

Edit `landing/src/app/api/nft-pass/checkout/route.ts`:

```typescript
const NFT_NAME = "Solstudio Platform Pass";
const NFT_SYMBOL = "SOLXPASS";
const PRICE_USDC = 10; // Price in USDC
```

### Update UI Content

Edit `landing/src/sections/nft-pass/MintNFTPass.tsx` to customize:
- Pass benefits list
- Pricing information
- UI styling

### Change Payment Token

To accept a different token instead of USDC:

1. Update `USDC_ADDRESS` in the checkout API
2. Ensure your shop wallet can receive the token
3. Update UI to reflect the new token

## Platform Control Integration

To integrate with your platform controls:

1. Store minted NFT addresses in your database
2. Check NFT ownership when users access premium features
3. Implement middleware in your client app to verify NFT ownership

Example verification:

```typescript
async function hasNFTPass(walletAddress: string): Promise<boolean> {
  const connection = new Connection(RPC_ENDPOINT);
  // Check if wallet owns any NFT from your collection
  // Implementation depends on your NFT structure
}
```

## Troubleshooting

### Common Issues

1. **"SHOP_PRIVATE_KEY not found"**
   - Ensure `.env.local` file exists with the correct variable

2. **Transaction fails**
   - Check shop wallet has enough SOL for fees
   - Verify user has enough USDC for payment
   - Ensure RPC endpoint is working

3. **QR code not showing**
   - Check browser console for errors
   - Ensure @solana/pay is installed correctly

### Support

For additional help:
- Check browser console for detailed error messages
- Verify all environment variables are set correctly
- Ensure all dependencies are installed

## Security Best Practices

1. **Never expose private keys**
   - Use environment variables
   - Never commit `.env.local` to git

2. **Validate transactions**
   - Always verify transaction signatures
   - Check payment amounts match expected values

3. **Monitor your shop wallet**
   - Track incoming payments
   - Set up alerts for unusual activity

4. **Use secure RPC endpoints**
   - Use authenticated RPC endpoints
   - Consider rate limiting

## Next Steps

1. Create an admin dashboard to:
   - View minted NFTs
   - Track revenue
   - Manage NFT metadata

2. Implement NFT verification in your platform
3. Add analytics to track minting activity
4. Consider adding multiple NFT tiers with different benefits 