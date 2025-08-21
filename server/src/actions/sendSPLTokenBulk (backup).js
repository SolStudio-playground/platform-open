const web3 = require('@solana/web3.js');
const fs = require('fs');
const { connection } = require('../utils/solConfig.js');
const { getAssociatedTokenAddress, createTransferInstruction, createAssociatedTokenAccountInstruction } = require('@solana/spl-token');
const { ComputeBudgetProgram } = require('@solana/web3.js');
const Recipient = require('../models/MultiSenderWallets.js');

function loadWalletKey(keypairFile) {
    if (!keypairFile || keypairFile === '') {
        throw new Error('Keypair is required!');
    }
    return web3.Keypair.fromSecretKey(
        new Uint8Array(JSON.parse(fs.readFileSync(keypairFile).toString()))
    );
}

async function sendSPLTokens(keypairFile, recipients, mintAddressStr, decimals, transactionRecord, senderWallet) {
    const fromWallet = loadWalletKey(keypairFile);
    const mintPublicKey = new web3.PublicKey(mintAddressStr);

    const fromTokenAccount = await getAssociatedTokenAddress(
        mintPublicKey,
        fromWallet.publicKey
    );

    let transactions = [];
    let transaction = new web3.Transaction();
    transaction.feePayer = fromWallet.publicKey;
    transaction.add(
        ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: 150000,
        })
    );

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
            transaction.add(
                ComputeBudgetProgram.setComputeUnitPrice({
                    microLamports: 150000,
                })
            );
        }
    }

    if (transaction.instructions.length > 0) {
        transactions.push(transaction);
    }

    try {
        for (const [index, tx] of transactions.entries()) {
            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
            tx.recentBlockhash = blockhash;

            try {
                const signature = await web3.sendAndConfirmTransaction(
                    connection,
                    tx,
                    [fromWallet],
                    { commitment: 'processed' }
                );

                transactionRecord.signatures.push(signature);
                results.push({ success: true, signature });

                // Insert recipient documents to the database after each successful transaction
                const recipientsInTransaction = recipientDocs.slice(index * maxInstructionsPerTransaction, (index + 1) * maxInstructionsPerTransaction);
                await Recipient.insertMany(recipientsInTransaction);
            } catch (error) {
                console.error('Transaction failed:', error);

                if (error instanceof web3.TransactionExpiredBlockheightExceededError) {
                    const retrySignature = await retryTransaction(tx, fromWallet);
                    if (retrySignature) {
                        transactionRecord.signatures.push(retrySignature);
                        results.push({ success: true, signature: retrySignature });
                    } else {
                        results.push({ success: false, error: error.message });
                    }
                } else {
                    results.push({ success: false, error: error.message });
                }
            }
        }

        const allSucceeded = results.every(result => result.success);
        transactionRecord.status = allSucceeded ? 'completed' : 'failed';
        await transactionRecord.save();

        // console.log(`Existing associated token accounts: ${existingAccountsCount}`);
        // console.log(`New associated token accounts created: ${newAccountsCount}`);

    } catch (error) {
        console.error('Transaction failed:', error);
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
