const { Metaplex, keypairIdentity } = require('@metaplex-foundation/js');
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const bs58 = require('bs58');

// Your base-58 encoded secret key
const secretKeyString = '2HyWppQPkbm9MjyHtMe15jUiouhdbtdyxaNXGfAd3wZNiCeBCEuDAxiZQhhWYZeYsusUG4hZPWUUWKRToH24RVVp';
const secretKey = bs58.decode(secretKeyString);
const wallet = Keypair.fromSecretKey(secretKey);

const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet));

// Ensure mintAddress is a PublicKey object
// const mintAddress = new PublicKey('o1Mw5Y3n68o8TakZFuGKLZMGjm72qv4JeoZvGiCLEvK');

async function getTokenDetails(mintAddress) {
    try {
        const mintPublicKey = new PublicKey(mintAddress);
        const nft = await metaplex.nfts().findByMint({ mintAddress: mintPublicKey });
        return nft;
    } catch (error) {
        console.error('Error fetching NFT details:', error);
    }
}

module.exports = getTokenDetails;











// const express = require('express');
// const { Connection, PublicKey } = require('@solana/web3.js');
// const mongoose = require('mongoose');
// const ProjectOwner = require('../models/ProjectOwner');
// const Token = require('../models/Token');
// const fetchTokenDetails = require('../utils/fetchTokenData');
// const { Metaplex, keypairIdentity } = require('@metaplex-foundation/js');

// const router = express.Router();
// const solanaConnection = new Connection("https://api.mainnet-beta.solana.com");

// const Bottleneck = require('bottleneck');

// const solanaRateLimiter = new Bottleneck({
//     minTime: 100, // Minimum time between each request
//     maxConcurrent: 1, // Maximum number of concurrent requests
//     reservoir: 100, // Initial number of jobs the limiter can handle
//     reservoirRefreshAmount: 100,
//     reservoirRefreshInterval: 10 * 1000, // Refresh rate for the reservoir
// });

// // Wrap your Solana connection calls with the limiter
// async function fetchSPLTokenTotalSupply(solanaConnection, tokenAddress) {
//   return solanaRateLimiter.schedule(() =>
//     solanaConnection.getTokenSupply(new PublicKey(tokenAddress))
//   ).catch(error => {
//     // Check if the error is due to rate limiting
//     if (error.response && error.response.status === 429 && error.response.headers['retry-after']) {
//       const retryAfter = parseInt(error.response.headers['retry-after']) * 1000; // Convert seconds to milliseconds
//       console.log(`Rate limited. Retrying after ${retryAfter} milliseconds...`);
//       // Retry after the specified duration
//       return new Promise(resolve => setTimeout(resolve, retryAfter)).then(() => fetchSPLTokenTotalSupply(solanaConnection, tokenAddress));
//     } else {
//       throw error; // Rethrow other errors
//     }
//   });
// }


// router.post('/login', async (req, res) => {
//     const { walletAddress } = req.body;

//     try {
//         let projectOwner = await ProjectOwner.findOne({ walletAddress });
//         if (!projectOwner) {
//             projectOwner = new ProjectOwner({ walletAddress, projects: [] });
//         }

//         const tokenAccounts = await solanaRateLimiter.schedule(() =>
//             solanaConnection.getParsedTokenAccountsByOwner(
//                 new PublicKey(walletAddress),
//                 { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') }
//             )
//         );

//         for (const { account } of tokenAccounts.value) {
//             const tokenAddress = account.data.parsed.info.mint;
//             let token = await Token.findOne({ tokenAddress });
//             if (!token) {
//                 const totalSupplyResponse = await fetchSPLTokenTotalSupply(solanaConnection, tokenAddress);
//                 const totalSupply = parseInt(totalSupplyResponse.value.amount); // Extracting the numerical value

//                 token = new Token({
//                     tokenAddress,
//                     totalSupply
//                 });

//                 await token.save();
//             }

//             if (!projectOwner.projects.includes(token._id)) {
//                 projectOwner.projects.push(token._id);
//             }
//         }

//         await projectOwner.save();

//         res.status(200).json({ message: "Logged in successfully", projectOwner, tokens: tokenAccounts.value });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "An error occurred", error });
//     }
// });

// module.exports = router;
