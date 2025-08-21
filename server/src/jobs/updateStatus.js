const mongoose = require('mongoose');
const { connection } = require('../utils/solConfig.js');
const MultiSender = require('../models/MultiSender');
const Recipient = require('../models/MultiSenderWallets.js');
const cron = require('node-cron');

// Helper function to delay execution
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const getTransactionWithRetry = async (signature, retries = 5, delayMs = 500) => {
    // console.log(`Fetching transaction for signature ${signature}`);
    let attempt = 0;
    // console.log(`Fetching transaction for signature ${signature}`);
    while (attempt < retries) {
        try {
            const transaction = await connection.getTransaction(signature, {
                commitment: 'confirmed',
                maxSupportedTransactionVersion: 0,
            });
            return transaction;
        } catch (error) {
            if (error.message.includes('429')) {
                const waitTime = delayMs * Math.pow(2, attempt);
                console.warn(`Server responded with 429 Too Many Requests. Retrying after ${waitTime}ms delay...`);
                await delay(waitTime);
                attempt++;
            } else {
                throw error;
            }
        }
    }

    throw new Error(`Failed to fetch transaction after ${retries} retries`);
};

const updateRecipientStatus = async () => {
    const PQueue = (await import('p-queue')).default;
    const queue = new PQueue({ concurrency: 10, interval: 1000, intervalCap: 10 });



    const pendingRecipients = await Recipient.find({ status: 'pending' });

    // Group recipients by MultiSender ID
    const recipientsByMultiSenderId = pendingRecipients.reduce((acc, recipient) => {
        if (!acc[recipient.multiSenderId]) {
            acc[recipient.multiSenderId] = [];
        }
        acc[recipient.multiSenderId].push(recipient);
        return acc;
    }, {});

    // Fetch all MultiSender records at once
    const multiSenderIds = Object.keys(recipientsByMultiSenderId);
    const multiSenders = await MultiSender.find({ _id: { $in: multiSenderIds } });

    // Create a map of MultiSender records by ID
    const multiSenderMap = multiSenders.reduce((acc, multiSender) => {
        acc[multiSender._id] = multiSender;
        return acc;
    }, {});

    // Cache for transactions to avoid duplicate API calls
    const transactionCache = {};

    // Counter for API calls
    let apiCallCounter = 0;
    // Collect all unique signatures
    const uniqueSignatures = new Set();
    for (const multiSender of multiSenders) {
        for (const signature of multiSender.signatures) {
            uniqueSignatures.add(signature);
        }
    }
    // Fetch transactions for all unique signatures
    const transactionPromises = Array.from(uniqueSignatures).map(signature =>
        queue.add(() => getTransactionWithRetry(signature).then(transaction => {
            transactionCache[signature] = transaction;
            apiCallCounter++;
        }))
    );

    // Wait for all transactions to be fetched
    await Promise.all(transactionPromises);

    for (const multiSenderId of multiSenderIds) {
        const multiSender = multiSenderMap[multiSenderId];

        if (!multiSender) {
            console.error(`MultiSender record not found for ID ${multiSenderId}`);
            continue;
        }

        for (const recipient of recipientsByMultiSenderId[multiSenderId]) {
            let transactionFound = false;

            for (const signature of multiSender.signatures) {
                if (!transactionCache[signature]) {
                    transactionCache[signature] = queue.add(() => {
                        apiCallCounter++;  // Increment the counter for each API call
                        return getTransactionWithRetry(signature);
                    });
                }

                const transaction = await transactionCache[signature];
                if (transaction) {
                    const recipientAccount = transaction.transaction.message.accountKeys.find(
                        accountKey => accountKey.toString() === recipient.walletAddress || accountKey.toString() === recipient.associatedTokenAddress
                    );

                    if (recipientAccount) {
                        recipient.status = 'completed';
                        recipient.transactionSignature = signature;
                        transactionFound = true;
                        break;
                    }
                }
            }

            if (!transactionFound) {
                recipient.status = 'failed';
            }

            await recipient.save();
        }
    }

    // Log the total number of API calls made
    // console.log(`Total API calls made: ${apiCallCounter}`);
};

// Schedule the cron job to run every 2 minutes
cron.schedule('*/15 * * * *', () => {
    // console.log('Running cron job to process pending recipients');
    updateRecipientStatus();
});

// For testing purposes, run every 20 seconds
// cron.schedule('*/58 * * * * *', () => {
//     console.log('Running cron job to process pending recipients (test mode)');
//     updateRecipientStatus();
// });