const { LAMPORTS_PER_SOL } = require('@solana/web3.js');
const web3 = require('@solana/web3.js');
const { connection } = require('../utils/solConfig');
const Recipient = require('../models/MultiSenderWallets');

const FEE_PER_FAILED_TX = 0.001 * LAMPORTS_PER_SOL; // Example fee per failed transaction

async function calculateAndRefundFees(failedRecipients, senderWallet, fromWallet) {
    console.log('failedRecipients:', failedRecipients);
    if (failedRecipients.length === 0) {
        console.log('No failed recipients. No refund transaction will be sent.');
        return;
    }

    const refundAmount = failedRecipients.length * FEE_PER_FAILED_TX;
    console.log(`Refunding ${refundAmount} lamports to ${senderWallet}`);

    // Refund logic here, for example, send the refund to the senderWallet
    const transaction = new web3.Transaction().add(
        web3.SystemProgram.transfer({
            fromPubkey: fromWallet.publicKey,
            toPubkey: new web3.PublicKey(senderWallet),
            lamports: refundAmount,
        })
    );

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromWallet.publicKey;

    try {
        const signature = await web3.sendAndConfirmTransaction(
            connection,
            transaction,
            [fromWallet]
        );
        console.log(`Refund transaction signature: ${signature}`);

        // Update recipients with refund transaction signature
        for (const recipientId of failedRecipients) {
            await Recipient.findByIdAndUpdate(
                recipientId,
                { $set: { refundTransactionSignature: signature } }
            );
        }
    } catch (error) {
        console.error('Refund transaction failed:', error);
    }
}

module.exports = calculateAndRefundFees;
