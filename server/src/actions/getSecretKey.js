const fs = require('fs');
const bs58 = require('bs58');
const web3 = require('@solana/web3.js');

function loadWalletKey(keypairFile) {
    try {
        const secretKeyJSON = fs.readFileSync(keypairFile, { encoding: 'utf8' });
        const secretKey = Uint8Array.from(JSON.parse(secretKeyJSON));
        return secretKey;
    } catch (error) {
        console.error("Failed to load wallet key:", error);
        throw error;
    }
}

function convertSecretKeyToBase58(keypairFile) {
    const secretKey = loadWalletKey(keypairFile);
    const keypair = web3.Keypair.fromSecretKey(secretKey);
    const base58PrivateKey = bs58.encode(keypair.secretKey);
    console.log("Base58 Encoded Private Key:", base58PrivateKey);
    return base58PrivateKey;
}

// Replace '/path/to/your/wallet.json' with the path to your wallet's JSON file
convertSecretKeyToBase58('/Users/biggie/Documents/GitHub/parachut-deployment/server/wallet/PctJCpjmqVraHmdkXz1Eidsp1hPqgCwmqWWV9GT1wAa.json');
