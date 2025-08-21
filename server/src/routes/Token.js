const express = require('express');
const router = express.Router();

// middlewares
const { authenticateToken } = require('../middleware/auth.js');

// web3.js and spl-token imports
const { LAMPORTS_PER_SOL} = require('@solana/web3.js');
const bs58 = require("bs58");
// models
const ProjectOwner = require('../models/ProjectOwner.js');
const Order = require('../models/Orders.js');
const TransactionRecord = require('../models/Transaction.js');
const logActivity = require('../utils/logs.js');
const Token = require('../models/Token.js');
// utils 
const verifyTransaction = require('../utils/verifyTransaction.js');

// Change 'devnet' to 'mainnet-beta' when you're ready to switch ==> Biggie
const { connection } = require('../utils/solConfig.js');
// const { calculateOrderValue } = require('../utils/calculateOrderPrice.js');

const { checkDomain } = require('../middleware/domain.js');
const TokenOrder = require('../models/TokenOrder.js');
// our wallet address

router.post('/verifyPayment', checkDomain, authenticateToken, async (req, res) => {
    const { signature, orderId } = req.body;
    const userId = req.user.id;
    try {
        if (!signature || !orderId) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const order = await TokenOrder.findById(orderId).lean();
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        const expectedAmount = 0.125 * LAMPORTS_PER_SOL;

        // const oldTransaction = await TransactionRecord.findOne({ signature: signature });
        // if (oldTransaction) {
        //     return res.status(400).json({ message: 'Transaction already verified.' });
        // }


        const verificationResult = await verifyTransaction(signature, expectedAmount, userId);
        if (verificationResult.success) {
            await TokenOrder.findByIdAndUpdate(orderId, { status: 'active' });
            const newTransaction = new TransactionRecord({
                userAddress: verificationResult.userAddress,
                tokenAddress: order.tokenAddress,
                amount: verificationResult.balanceChange,
                transactionType: 'spl',
                signature: signature,
                networkFee: verificationResult.fee
            });
            await newTransaction.save();

            // const pool = await createSolanaPool(verificationResult.userAddress, connection);
            // log the activity of the verficationResult the success is false
            // await logActivity('transaction', 'transaction', newTransaction._id, verificationResult.message, verificationResult.userAddress);

            res.json({ message: 'Payment verified, order activated.', transaction: newTransaction });
        } else {
            res.status(400).json({ message: verificationResult.message });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred", error });
    }
});






router.get('/my-tokens', checkDomain, authenticateToken, async (req, res) => {
    try {
        // Assuming req.user._id is the ID of the ProjectOwner document
        const projectOwner = await ProjectOwner.findById(req.user.id).populate({
            path: 'projects',
            select: 'program programName tokenName tokenSymbol tokenAddress tokenPictureUrl tokenSupply decimals tags description websiteUrl twitterUrl telegramUrl discordUrl creator metadata user tokenStatus orderValue mintAuthority mutable freezeAddress freezeAccount mintAccount',
        });

        if (!projectOwner) {
            return res.status(404).json({ message: "Project owner not found" });
        }

        // Respond with the populated projects array which contains Token documents
        res.json(projectOwner.projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred", error });
    }
});


router.get('/token/:tokenAddress', checkDomain, async (req, res) => {
    try {
        const { tokenAddress } = req.params;
        const token = await Token.findOne({ tokenAddress });
        if (!token) {
            return res.status(404).json({ message: "Token not found" });
        }
        res.json(token);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred", error });
    }
});

router.put('/token/:tokenAddress', checkDomain, authenticateToken, async (req, res) => {
    try {
        const { tokenAddress } = req.params;
        const token = await Token.findOneAndUpdate({ tokenAddress }, req.body, { new: true });
        if (!token) {
            return res.status(404).json({ message: "Token not found" });
        }
        res.json(token);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred", error });
    }
});



// token list 
router.get('/tokensList', checkDomain, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const skipIndex = (page - 1) * limit;
        const totalTokens = await Token.countDocuments();
        const Tokens = await Token.find({})
            .sort({ createdAt: -1 })
            .skip(skipIndex)
            .limit(limit)
            .lean()

        const totalPages = Math.ceil(totalTokens / limit);


        if (!Tokens) {
            return res.status(404).json({ message: "Token not found" });
        }
        res.status(200).json({
            tokens: Tokens,
            totalPages,
            currentPage: page
        });


    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred", error });
    }
})


module.exports = router;




//////////////////////////////////////////////////////////////////////////////

// // Function to create metadata for the token ()
// const tokenName = "Biggie Brik";
// const symbol = "BRK";
// const uri = {
//     "name": "Biggie Brik",
//     "symbol": "BRK",
//     "description": "This is just a test not more !",
//     "image": "https://www.circle.com/hs-fs/hubfs/sundaes/USDC.png?width=540&height=540&name=USDC.png",
//     "attributes": []
// }

// async function createSolanaPool(userPublicKeyStr, connection) {
//     // Generate a new keypair for the pool's mint
//     const poolMint = Keypair.generate();

//     // Convert user public key string to PublicKey
//     const myWalletPublicKey = new PublicKey(MY_WALLET_ADDRESS);

//     // Decode the secret key of the payer account
//     const secretKeyBase58 = "2HyWppQPkbm9MjyHtMe15jUiouhdbtdyxaNXGfAd3wZNiCeBCEuDAxiZQhhWYZeYsusUG4hZPWUUWKRToH24RVVp";
//     const secretKey = bs58.decode(secretKeyBase58);
//     const payer = Keypair.fromSecretKey(secretKey);
//     console.log('payer', payer.publicKey);
//     try {
//         // Create the new token mint (pool)
//         let mint = await createMint(
//             connection,
//             payer,
//             payer.publicKey, // Assuming payer is also the mint authority
//             null, // No freeze authority
//             9, // Decimals
//         );
//         console.log('mint', mint.toBase58());

//         // Create an associated token account for the user (this could represent the pool's creator share)

//         const mintInfoBefore = await getMint(
//             connection,
//             mint
//         )

//         console.log('info mintInfoBefore', mintInfoBefore.supply);

//         const tokenAccount = await getOrCreateAssociatedTokenAccount(
//             connection,
//             payer,
//             mint,
//             payer.publicKey,
//             TOKEN_PROGRAM_ID
//         )

//         console.log('userTokenAccount', tokenAccount.address.toBase58());

//         const tokenAccountInfo = await getAccount(
//             connection,
//             tokenAccount.address
//         )

//         // await createTokenMetadata(connection, payer, mint, tokenName, symbol, uri);

//         console.log('acount info', tokenAccountInfo.amount);


//         await mintTo(
//             connection,
//             payer,
//             mint,
//             tokenAccount.address,
//             payer,
//             100000000000 // because decimals for the mint are set to 9 
//         );



//         const mintInfo = await getMint(
//             connection,
//             mint
//         )

//         console.log(mintInfo.supply);

//         // Hash the private key of the poolMint before storing
//         // const salt = bcrypt.genSaltSync(10);
//         // const hashedPrivateKey = await bcrypt.hashSync(bs58.encode(poolMint.secretKey), salt);












//         // Save pool details in your MongoDB
//         const poolDetails = await createPool({
//             creatorAddress: userPublicKeyStr,
//             tokenAddress: mint.toBase58(),
//             depositAmount: 0, // Example initial deposit amount
//             nftCollection: 'YourNftCollectionName',
//             privateKey: mint.secretKey,
//         });


//         return {
//             poolMint: mint.toBase58(),
//             userTokenAccount: tokenAccount.address.toBase58(),
//             poolDetails
//         };
//     } catch (error) {
//         console.error("Error creating Solana pool:", error);
//         throw error; // Rethrow or handle as needed
//     }
// }




// // Function to create a new pool in MongoDB
// async function createPool(poolData) {
//     const newPool = new Pool(poolData);
//     await newPool.save();
//     return newPool;
// }


