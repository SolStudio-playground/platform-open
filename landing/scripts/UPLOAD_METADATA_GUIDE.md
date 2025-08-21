# How to Upload NFT Metadata to Arweave

## Step 1: Prepare Your NFT Image

First, you need an image for your NFT Pass. Create or design a premium-looking pass image (recommended: 1000x1000px PNG).

## Step 2: Upload Image to Arweave

### Option A: Using ArDrive Web App (Easiest)
1. Go to https://app.ardrive.io
2. Connect your wallet
3. Upload your NFT pass image
4. Get the Arweave URL (format: `https://arweave.net/TRANSACTION_ID`)

### Option B: Using Bundlr
```bash
npm install -g @bundlr-network/client

# Upload image
bundlr upload YOUR_IMAGE.png \
  --node https://node1.bundlr.network \
  --currency solana \
  --wallet ~/.config/solana/id.json
```

### Option C: Using Arweave directly
```bash
# Install arweave-deploy
npm install -g arweave-deploy

# Upload image
arweave deploy YOUR_IMAGE.png --key-file wallet.json
```

## Step 3: Update Metadata JSON

1. Open `solx-pass-metadata.json`
2. Replace `YOUR_IMAGE_URI_HERE` with your uploaded image URL
3. Update the creator address if needed (currently set to your shop wallet)

## Step 4: Upload Metadata JSON to Arweave

Use the same method as Step 2 to upload the JSON file:

```bash
# Example with Bundlr
bundlr upload solx-pass-metadata.json \
  --node https://node1.bundlr.network \
  --currency solana \
  --wallet ~/.config/solana/id.json
```

## Step 5: Update Your Environment Variables

Add the metadata URI to your `.env.local`:

```env
NEXT_PUBLIC_NFT_METADATA_URI=https://arweave.net/YOUR_METADATA_TRANSACTION_ID
```

## Free Alternatives to Arweave

### 1. NFT.Storage (Free, permanent)
```bash
# Upload via API
curl -X POST https://api.nft.storage/upload \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d @solx-pass-metadata.json
```

### 2. Pinata (Free tier available)
1. Sign up at https://pinata.cloud
2. Upload through their web interface
3. Use the IPFS gateway URL

### 3. Web3.Storage (Free)
1. Sign up at https://web3.storage
2. Upload files through their interface
3. Get the IPFS URL

## Example Costs
- Arweave: ~$0.01 - $0.10 per file (permanent storage)
- NFT.Storage: Free
- Pinata: Free up to 1GB
- Web3.Storage: Free

## Tips
1. Always upload the image first, then the metadata
2. Keep a backup of both files
3. Test the URLs in your browser to ensure they're accessible
4. Consider uploading multiple sizes of your image for different use cases 