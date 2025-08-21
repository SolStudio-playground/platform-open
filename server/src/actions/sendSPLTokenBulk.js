const web3 = require('@solana/web3.js');
const fs = require('fs');
const { connection } = require('../utils/solConfig.js');
const { getAssociatedTokenAddress, createTransferInstruction, createAssociatedTokenAccountInstruction } = require('@solana/spl-token');
const { ComputeBudgetProgram } = require('@solana/web3.js');
const Recipient = require('../models/MultiSenderWallets.js');
const { limitedSendBundle, getTipAccounts } = require('../utils/jitoUtils.js');
const bs58 = require('bs58');
const chunkArray = require('../utils/chunkArray.js');

function loadWalletKey(keypairFile) {
    if (!keypairFile || keypairFile === '') {
        throw new Error('Keypair is required!');
    }
    return web3.Keypair.fromSecretKey(
        new Uint8Array(JSON.parse(fs.readFileSync(keypairFile).toString()))
    );
};

async function simulateTransaction(tx) {
    try {
        const simulationResult = await connection.simulateTransaction(tx);
        // console.log("Simulation result:", simulationResult);
        return simulationResult;
    } catch (error) {
        console.error('Simulation failed:', error);
        throw error;
    }
}


async function sendSPLTokens(keypairFile, recipients, mintAddressStr, decimals, transactionRecord, senderWallet) {
    const fromWallet = loadWalletKey(keypairFile);
    const mintPublicKey = new web3.PublicKey(mintAddressStr);
    // console.log('it is here');

    const fromTokenAccount = await getAssociatedTokenAddress(
        mintPublicKey,
        fromWallet.publicKey
    );

    let transactions = [];
    let transaction = new web3.Transaction();
    transaction.feePayer = fromWallet.publicKey;

    const results = [];
    const maxInstructionsPerTransaction = 20;

    let existingAccountsCount = 0;
    let newAccountsCount = 0;
    const recipientDocs = [];

    for (const recipient of recipients) {
        const toPublicKey = new web3.PublicKey(recipient.walletAddress);
        const parsedAmount = Math.floor(recipient.amount * Math.pow(10, decimals));

        const toTokenAccountAddress = await getAssociatedTokenAddress(
            mintPublicKey,
            toPublicKey
        );

        const accountInfo = await connection.getAccountInfo(toTokenAccountAddress);
        if (!accountInfo) {
            transaction.add(
                createAssociatedTokenAccountInstruction(
                    fromWallet.publicKey,
                    toTokenAccountAddress,
                    toPublicKey,
                    mintPublicKey,
                    web3.TOKEN_PROGRAM_ID,
                    web3.ASSOCIATED_TOKEN_PROGRAM_ID
                )
            );
            newAccountsCount++;
        } else {
            existingAccountsCount++;
        }

        transaction.add(
            createTransferInstruction(
                fromTokenAccount,
                toTokenAccountAddress,
                fromWallet.publicKey,
                parsedAmount,
                [],
                web3.TOKEN_PROGRAM_ID
            )
        );

        recipientDocs.push({
            walletAddress: recipient.walletAddress,
            associatedTokenAddress: toTokenAccountAddress.toBase58(),
            amount: recipient.amount,
            multiSenderId: transactionRecord._id,
        });

        if (transaction.instructions.length >= maxInstructionsPerTransaction) {
            transactions.push(transaction);
            transaction = new web3.Transaction();
            transaction.feePayer = fromWallet.publicKey;

        }
    }

    if (transaction.instructions.length > 0) {
        transactions.push(transaction);
    }

    try {
        // Get tip accounts
        const tipAccounts = await getTipAccounts();
        const tipAmount = web3.LAMPORTS_PER_SOL * 0.0001; // Example tip amount of 0.01 SOL

        const { blockhash } = await connection.getLatestBlockhash();

        // Sign transactions and capture signatures
        const transactionSignatures = [];
        for (const tx of transactions) {
            // console.log('Signing transaction:', tx);
            tx.recentBlockhash = blockhash;
            tx.sign(fromWallet);
            transactionSignatures.push(tx.signature);

            // Simulate transaction before adding it to the bundle
            // await simulateTransaction(tx);
        }

        // Convert transactions to base-58 encoded strings using bs58
        const encodedTransactions = transactions.map(tx => bs58.encode(tx.serialize()));

        // Split transactions into chunks of 4 (to include the tip transaction in each chunk)
        const transactionChunks = chunkArray(encodedTransactions, 4);

        // Send each chunk as a separate bundle, including the tip transaction
        for (const chunk of transactionChunks) {
            // console.log('Sending bundle:', chunk)
            // Get a new blockhash if needed
            const { blockhash: newBlockhash } = await connection.getLatestBlockhash();

            // Add a new tip transaction for each bundle
            const randomTipAccount = tipAccounts[Math.floor(Math.random() * tipAccounts.length)];
            const tipInstruction = web3.SystemProgram.transfer({
                fromPubkey: fromWallet.publicKey,
                toPubkey: new web3.PublicKey(randomTipAccount),
                lamports: tipAmount,
            });

            let tipTransaction = new web3.Transaction().add(tipInstruction);
            tipTransaction.recentBlockhash = newBlockhash;
            tipTransaction.feePayer = fromWallet.publicKey;
            tipTransaction.sign(fromWallet);

            // Simulate tip transaction before adding it to the bundle
            // await simulateTransaction(tipTransaction);

            // Convert the tip transaction to base-58 encoded string
            const encodedTipTransaction = bs58.encode(tipTransaction.serialize());

            // Add the tip transaction to the current chunk
            chunk.push(encodedTipTransaction);

            // Send the bundle
            await limitedSendBundle(chunk);

            // Include the signatures in the results
            for (const signature of transactionSignatures) {
                const signatureBase58 = bs58.encode(signature);
                // console.log(`Adding signature: ${signatureBase58}`);
                results.push({ success: true, signature: signatureBase58 });
            }
        }

        await Recipient.insertMany(recipientDocs);

        const allSucceeded = results.every(result => result.success);
        transactionRecord.status = allSucceeded ? 'completed' : 'failed';
        transactionRecord.newAccountsCount = newAccountsCount;
        transactionRecord.existingAccountsCount = existingAccountsCount;
        await transactionRecord.save();

        // console.log(`Existing associated token accounts: ${existingAccountsCount}`);
        // console.log(`New associated token accounts created: ${newAccountsCount}`);

    } catch (error) {
        console.error('Transaction failed:', error.response ? error.response.data : error.message);
        results.push({ success: false, error: error.message });
    }

    return results;
}

async function retryTransaction(transaction, fromWallet) {
    try {
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;

        const signature = await web3.sendAndConfirmTransaction(
            connection,
            transaction,
            [fromWallet],
            { commitment: 'processed' }
        );
        return signature;
    } catch (error) {
        console.error('Retry transaction failed:', error);
        return null;
    }
};

async function calculateAssociatedAccountCreationFee() {
    const rentExemption = await connection.getMinimumBalanceForRentExemption(165);
    return rentExemption;
}

module.exports = { sendSPLTokens, calculateAssociatedAccountCreationFee };