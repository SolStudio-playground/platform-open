const web3 = require('@solana/web3.js');
const splToken = require('@solana/spl-token');
const fs = require('fs');
const { connection } = require('../utils/solConfig.js');
const { ComputeBudgetProgram } = require('@solana/web3.js');
const { parseBalance } = require('../utils/functions.js');

function loadWalletKey(keypairFile) {
    if (!keypairFile || keypairFile === '') {
        throw new Error('Keypair is required!');
    }
    return web3.Keypair.fromSecretKey(
        new Uint8Array(JSON.parse(fs.readFileSync(keypairFile).toString()))
    );
}

async function sendSPLToken(keypairFile, toPublicKeyStr, amount, mintAddressStr) {

    const fromWallet = loadWalletKey(keypairFile);
    const toPublicKey = new web3.PublicKey(toPublicKeyStr);
    const mintPublicKey = new web3.PublicKey(mintAddressStr);

    // Fetch the recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();

    const fromTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mintPublicKey,
        fromWallet.publicKey
    );

    const toTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mintPublicKey,
        toPublicKey
    );

    const computeBudgetInstruction = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 150000,
    });

    // Create and sign a transaction
    const transaction = new web3.Transaction();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromWallet.publicKey;

    const transferInstruction = splToken.createTransferInstruction(
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        amount
    );

    transaction.add(transferInstruction);
    transaction.add(computeBudgetInstruction);

    // Sign transaction
    const signedTransaction = await web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [fromWallet],
        { commitment: 'confirmed' }
    );
    // console.log('Token SPL Transaction', signedTransaction);

    return signedTransaction;
}

module.exports = { sendSPLToken };
