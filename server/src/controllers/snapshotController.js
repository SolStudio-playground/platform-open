const Holder = require('../models/Holders');
const Snapshot = require('../models/Snapshot');
const { connection } = require('../utils/solConfig');
const web3 = require('@solana/web3.js');
const verifyTransaction = require('../utils/verifyTransaction');
const { LAMPORTS_PER_SOL } = require('@solana/web3.js');
const uploadCSV = require('../actions/uplaodCSV');
const { parseBalance } = require('../utils/functions');
let fetch;

// Dynamically import fetch at the start of your application or function
async function loadDependencies() {
    fetch = (await import('node-fetch')).default;
}

// Ensure to call loadDependencies in your application's startup routine
loadDependencies().then(() => {
    console.log('Dependencies loaded');
});



const earliestTransactionCache = {};  // Cache to store the earliest transaction dates

async function getFirstTokenTransactionDate(address, mintAddress) {
    const cacheKey = `${address}-${mintAddress}`;
    if (earliestTransactionCache[cacheKey]) {
        return earliestTransactionCache[cacheKey];
    }

    const publicKey = new web3.PublicKey(address);
    const tokenMint = new web3.PublicKey(mintAddress);

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, { mint: tokenMint });
    let earliestDate = null;

    for (const { pubkey } of tokenAccounts.value) {
        const transactionSignatures = await connection.getConfirmedSignaturesForAddress2(pubkey, { limit: 1000 });

        for (const signatureInfo of transactionSignatures) {
            const transaction = await connection.getTransaction(signatureInfo.signature, {
                commitment: 'confirmed',
                maxSupportedTransactionVersion: 0
            });

            if (transaction && transaction.meta && transaction.meta.postTokenBalances) {
                let transactionDate = new Date(signatureInfo.blockTime * 1000);
                if (!earliestDate || transactionDate < earliestDate) {
                    earliestDate = transactionDate;
                }
            }
        }
    }

    if (earliestDate) {
        earliestTransactionCache[cacheKey] = earliestDate;  // Cache the result
    }

    return earliestDate;
}


async function fetchAndSaveTokenHolders(mintAddress, minimumBalance = 0, holderSince = new Date(0), decimals, snapshotId) {
    let page = 1;
    let batchCount = 0;
    let currentBatch = [];
    let holderSinceDate = new Date(holderSince);

    while (true) {
        const response = await fetch(process.env.HELIUS_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                jsonrpc: "2.0",
                method: "getTokenAccounts",
                id: "helius-test",
                params: { page, limit: 1000, mint: mintAddress },
            }),
        });

        const data = await response.json();
        // Log the token accounts received from the API

        if (!data.result || data.result.token_accounts.length === 0) {
            if (currentBatch.length > 0) {
                console.log(`Processing the last batch with ${currentBatch.length} entries.`);
                await Holder.insertMany(currentBatch);
                currentBatch = [];
            }
            break;
        }


        // (x funciton) Prepare and process the data ==> Biggie 
        let preparedData = data.result.token_accounts.map(account => ({
            snapshot: snapshotId,
            address: account.owner,
            balance: parseBalance(account.amount, decimals),
            holderSince: holderSinceDate  // Use the holderSinceDate from request
        }));
        // console.log("Data before filtering:", preparedData);

        // Filter the data based on minimum balance and log after filtering
        let filteredData = preparedData.filter(account => account.balance >= minimumBalance);
        // console.log("Data after filtering:", filteredData);
        currentBatch.push(...filteredData);

        if (currentBatch.length >= 5000) {
            await Holder.insertMany(currentBatch);
            currentBatch = []; // Reset the batch
        }
        page++;
    }
    return snapshotId;
};


// replace x function with the below function to get the holderSinceDate
// for (const account of data.result.token_accounts) {
//     let actualHolderSinceDate = await getFirstTokenTransactionDate(account.owner, mintAddress);
//     let balance = parseBalance(account.amount, decimals);

//     // Add to batch only if the holder meets the criteria
//     if (balance >= minimumBalance && actualHolderSinceDate && actualHolderSinceDate <= holderSinceDate) {
//         currentBatch.push({
//             snapshot: snapshot._id,
//             address: account.owner,
//             balance: balance,
//             holderSince: actualHolderSinceDate
//         });
//     }

//     if (currentBatch.length >= 5000) {
//         await Holder.insertMany(currentBatch);
//         console.log(`Processed batch ${batchCount++} successfully with ${currentBatch.length} entries.`);
//         currentBatch = [];  // Reset the batch
//     }
// }



async function verifyAndProcessTokenHolders(signature, mintAddress, minimumBalance, holderSince, decimals, userId, snapshotId) {
    const snapShotIdtoString = snapshotId.toString();
    try {
        const expectedAmount = LAMPORTS_PER_SOL * 0.09;
        const verifyPayment = await verifyTransaction(signature, expectedAmount, userId);

        if (!verifyPayment.success) {
            await Snapshot.findByIdAndUpdate(snapshotId, { status: 'failed' }, { new: true });
            console.error('Verification failed:', verifyPayment.message);
            return;
        }
        if (verifyPayment.success) {
            await fetchAndSaveTokenHolders(mintAddress, minimumBalance, holderSince, decimals, snapshotId);
            const holdersData = await Holder.find({ snapshot: snapshotId })
                .select('address balance holderSince -_id')
                .lean();
            const csvUrl = await uploadCSV(holdersData, `snapshot_${snapShotIdtoString}.csv`);
            await Snapshot.findByIdAndUpdate(snapshotId, { status: 'completed', csvUrl: csvUrl }, { new: true });
        } else {
            await Snapshot.findByIdAndUpdate(snapshotId, { status: 'failed' }, { new: true });
        }
    } catch (error) {
        console.error('Error during processing:', error);
        await Snapshot.findByIdAndUpdate(snapshotId, { status: 'failed' }, { new: true });
    }
}


// snapshot end point
const SnapshotTake = async (req, res) => {
    const { mintAddress, minimumBalance, holderSince, decimals, signature } = req.body;
    const userId = req.user.id;

    if (!mintAddress || !decimals) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        // Create snapshot record immediately
        const snapshot = new Snapshot({
            tokenAddress: mintAddress,
        });
        await snapshot.save();

        // Respond to the client immediately with the snapshotId
        res.json({ message: "Snapshot process started.", snapshotId: snapshot._id });

        // Continue processing in the background
        verifyAndProcessTokenHolders(signature, mintAddress, minimumBalance, holderSince, decimals, userId, snapshot._id);
    } catch (error) {
        console.error('Error initializing snapshot process:', error);
        return res.status(500).json({ message: "Error initializing snapshot process", error: error.message });
    }
};

// Get the status of the snapshot
const checkSnapshotURL = async (req, res) => {
    const { snapshotId } = req.params;

    try {
        const snapshot = await Snapshot.findById(snapshotId);
        if (!snapshot) {
            return res.status(404).json({ message: "Snapshot not found" });
        }

        if (snapshot.status === 'completed' && snapshot.csvUrl) {
            return res.json({ status: 'completed', csvUrl: snapshot.csvUrl });
        } else if (snapshot.status === 'failed') {
            return res.status(500).json({ status: 'failed', message: 'Snapshot processing failed' });
        } else {
            return res.json({ status: 'processing' });
        }
    } catch (error) {
        console.error('Error retrieving snapshot status:', error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const downloadSnapshotJson = async (req, res) => {
    const { snapshotId } = req.params;

    try {
        const snapshot = await Snapshot.findById(snapshotId);
        if (!snapshot) {
            return res.status(404).json({ message: "Snapshot not found" });
        }

        const holders = await Holder.find({ snapshot: snapshotId }).select('address balance -_id').lean();
        const response = holders.map(holder => ({
            walletAddress: holder.address,
            amount: holder.balance,
        }));

        res.setHeader('Content-Disposition', `attachment; filename="snapshot_${snapshotId}.json"`);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(response, null, 2));
    } catch (error) {
        console.error('Error downloading snapshot JSON:', error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


module.exports = {
    fetchAndSaveTokenHolders,
    SnapshotTake,
    checkSnapshotURL,
    downloadSnapshotJson
};


