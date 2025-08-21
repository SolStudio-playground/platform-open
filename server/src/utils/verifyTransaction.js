// Function to verify the transaction
const { connection } = require('../utils/solConfig.js');
const logActivity = require('./logs.js');
const MY_WALLET_ADDRESS = "Pcht7ptpQ79fbE7yuiDMFaW8JW7cxXniumqjSbVdZDp"; // to do: change it to our wallet address ==> Biggie
const { LAMPORTS_PER_SOL } = require('@solana/web3.js');


async function verifyTransaction(signature, expectedAmount, userId) {
    const maxAttempts = 10;
    const attemptInterval = 20000; // 20 seconds

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

            for (let i = 0; i < accountKeys.length; i++) {
                if (accountKeys[i].toString() === MY_WALLET_ADDRESS) {
                    const balanceChange = postBalances[i] - preBalances[i];
                    if (balanceChange >= expectedAmount) {
                        logActivity('transaction', 'verification', signature, 'Transaction verified successfully.', accountKeys[i].toString());
                        return {
                            success: true,
                            message: 'Transaction verified successfully.',
                            balanceChange: balanceChange / LAMPORTS_PER_SOL,
                        };
                    }
                    const message = `Expected amount does not match. Expected: ${expectedAmount / LAMPORTS_PER_SOL} SOL, Received: ${balanceChange / LAMPORTS_PER_SOL} SOL`;
                    logActivity('transaction', 'verification', signature, message, accountKeys[i].toString());
                    return { success: false, message };
                }
            }
            return { success: false, message: 'Wallet address not involved in the transaction.' };
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

module.exports = verifyTransaction;
