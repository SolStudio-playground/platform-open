const web3 = require('@solana/web3.js');
const { connection } = require('../utils/solConfig.js');
const fs = require('fs');


const loadWalletKey = (keypairFile) => {
    if (!keypairFile || keypairFile === '') {
        throw new Error('Keypair is required!');
    }
    return web3.Keypair.fromSecretKey(
        new Uint8Array(JSON.parse(fs.readFileSync(keypairFile).toString()))
    );
};

const refundSender = async (keypairFile, senderWallet, refundAmount) => {
    const fromWallet = loadWalletKey(keypairFile);
    const senderPublicKey = new web3.PublicKey(senderWallet);

    const computeBudgetInstruction = web3.ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 40000, 
    });


    const transaction = new web3.Transaction().add(
        computeBudgetInstruction,
        web3.SystemProgram.transfer({
            fromPubkey: fromWallet.publicKey,
            toPubkey: senderPublicKey,
            lamports: refundAmount,
        })
    );

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromWallet.publicKey;
    transaction.sign(fromWallet);

    try {
        const signature = await web3.sendAndConfirmTransaction(connection, transaction, [fromWallet]);
        return { success: true, signature };
    } catch (error) {
        console.error('Refund transaction failed:', error);
        return { success: false, error: error.message };
    }
};

module.exports = { refundSender };
