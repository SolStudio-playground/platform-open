const fs = require('fs');
const path = require('path');

// Example NFT metadata for Solstudio Platform Pass
const metadata = {
  name: "Solstudio Platform Pass",
  symbol: "SOLXPASS",
  description: "Exclusive access pass to premium features on the Solstudio platform. This NFT grants holders advanced tools, priority support, and early access to new features.",
  image: "https://arweave.net/YOUR_IMAGE_URI", // Replace with your uploaded image URI
  external_url: "https://solstudio.so",
  attributes: [
    {
      trait_type: "Pass Type",
      value: "Premium"
    },
    {
      trait_type: "Access Level",
      value: "Full Platform"
    },
    {
      trait_type: "Benefits",
      value: "Priority Support"
    },
    {
      trait_type: "Valid Until",
      value: "Lifetime"
    }
  ],
  properties: {
    files: [
      {
        uri: "https://arweave.net/YOUR_IMAGE_URI", // Replace with your uploaded image URI
        type: "image/png"
      }
    ],
    category: "image",
    creators: [
      {
        address: "YOUR_CREATOR_WALLET_ADDRESS", // Replace with your wallet address
        share: 100
      }
    ]
  }
};

// Save metadata to file
const metadataPath = path.join(__dirname, 'nft-metadata.json');
fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

console.log('NFT metadata created at:', metadataPath);
console.log('\nNext steps:');
console.log('1. Upload your NFT image to Arweave or IPFS');
console.log('2. Update the "image" and "files.uri" fields with the uploaded image URI');
console.log('3. Upload the metadata JSON file to Arweave or IPFS');
console.log('4. Use the metadata URI in your .env file as NEXT_PUBLIC_NFT_METADATA_URI');
console.log('\nFor Arweave upload, you can use:');
console.log('- Bundlr: https://bundlr.network/');
console.log('- ArDrive: https://ardrive.io/');
console.log('- Akord: https://akord.com/');
console.log('\nFor IPFS upload, you can use:');
console.log('- Pinata: https://pinata.cloud/');
console.log('- NFT.Storage: https://nft.storage/');
console.log('- Web3.Storage: https://web3.storage/'); 