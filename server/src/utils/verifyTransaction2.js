// Function to verify the transaction
const { connection } = require('../utils/solConfig.js');
const logActivity = require('./logs.js');
const MY_WALLET_ADDRESS = "PctJCpjmqVraHmdkXz1Eidsp1hPqgCwmqWWV9GT1wAa";
const PLATFORM_WALLET_ADDRESS = "Pcht7ptpQ79fbE7yuiDMFaW8JW7cxXniumqjSbVdZDp";
const { LAMPORTS_PER_SOL } = require('@solana/web3.js');

async function verifyTransaction2(signature, expectedAmount, userId) {
    const maxAttempts = 20;
    const attemptInterval = 3000; // 20 seconds

    console.log('Verifying transaction:', signature);

    for (let attempts = 0; attempts < maxAttempts; attempts++) {
        try {
            console.log(`Attempt ${attempts + 1}: Trying to fetch transaction.`);
            const transaction = await connection.getTransaction(signature, {
                commitment: 'confirmed',
                maxSupportedTransactionVersion: 0,
            });

            if (!transaction || !transaction.meta) {
                throw new Error('Transaction not found or not confirmed yet');
            }

            const accountKeys = transaction.transaction.message.accountKeys;
            const preBalances = transaction.meta.preBalances;
            const postBalances = transaction.meta.postBalances;

            let myWalletBalanceChange = 0;
            let platformWalletBalanceChange = 0;

            for (let i = 0; i < accountKeys.length; i++) {
                if (accountKeys[i].toString() === MY_WALLET_ADDRESS) {
                    myWalletBalanceChange = postBalances[i] - preBalances[i];
                }
                if (accountKeys[i].toString() === PLATFORM_WALLET_ADDRESS) {
                    platformWalletBalanceChange = postBalances[i] - preBalances[i];
                }
            }

            if (myWalletBalanceChange >= expectedAmount.associatedAccountFees && platformWalletBalanceChange >= expectedAmount.platformFees) {
                logActivity('transaction', 'verification', signature, 'Transaction verified successfully.', userId);
                return {
                    success: true,
                    message: 'Transaction verified successfully.',
                    myWalletBalanceChange: myWalletBalanceChange / LAMPORTS_PER_SOL,
                    platformWalletBalanceChange: platformWalletBalanceChange / LAMPORTS_PER_SOL,
                };
            }

            const message = `Expected amounts do not match. Expected: Associated Fees ${expectedAmount.associatedAccountFees / LAMPORTS_PER_SOL} SOL, Platform Fees ${expectedAmount.platformFees / LAMPORTS_PER_SOL} SOL. Received: Associated Fees ${myWalletBalanceChange / LAMPORTS_PER_SOL} SOL, Platform Fees ${platformWalletBalanceChange / LAMPORTS_PER_SOL} SOL`;
            logActivity('transaction', 'verification', signature, message, userId);
            return { success: false, message };
        } catch (error) {
            console.error(`Attempt ${attempts + 1} failed:`, error);
            if (attempts < maxAttempts - 1) {
                console.log(`Waiting ${attemptInterval / 1000} seconds before retrying...`);
                await new Promise(resolve => setTimeout(resolve, attemptInterval));
            } else {
                logActivity('transaction', 'error', signature, 'Transaction verification attempts exceeded.', userId);
                return { success: false, message: 'Transaction verification attempts exceeded.' };
            }
        }
    }

    const message = 'Transaction not found or does not meet the criteria after several attempts.';
    logActivity('transaction', 'error', signature, message, userId);
    return { success: false, message };
};

module.exports = verifyTransaction2;
