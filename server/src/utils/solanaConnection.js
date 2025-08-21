const web3 = require('@solana/web3.js');
const bs58 = require('bs58');
const splToken = require('@solana/spl-token');



async function getOrCreateTokenAccountWithRetry(connection, walletKeyPair, mintAddress, publicKey, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const tokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
                connection,
                walletKeyPair,
                mintAddress,
                publicKey
            );
            return tokenAccount; // Success
        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error);
            if (attempt === retries) {
                throw new Error('Failed to create or get token account after several attempts');
            }
        }
    }
}

async function main() {
    try {
        const decodedKey = bs58
        .decode('2HyWppQPkbm9MjyHtMe15jUiouhdbtdyxaNXGfAd3wZNiCeBCEuDAxiZQhhWYZeYsusUG4hZPWUUWKRToH24RVVp');
        const walletKeyPair = web3.Keypair.fromSecretKey(decodedKey);
        const connection = new web3.Connection(web3.clusterApiUrl('devnet'));
        // console.log("Wallet Address:", walletKeyPair)
        let solBalance = await connection.getBalance(walletKeyPair.publicKey);
        // console.log("Initial SOL Balance:", solBalance / web3.LAMPORTS_PER_SOL);

        // Mint address should be valid and exist on the specified network
        // const mintAddress = new web3.PublicKey('FpypPQScocHTCXuHFDLiW6TXqt9ann1Y86RgRCt47rz1');

        // Ensure the token account exists or create a new one
        // console.log("Mint Address:", mintAddress.toString());
        // try {
        //     const tokenAccount = await getOrCreateTokenAccountWithRetry(connection, walletKeyPair, mintAddress, walletKeyPair.publicKey);
        //     console.log("Minting to token account:", tokenAccount.address.toString());
        // } catch (accountError) {
        //     console.error("Failed to get or create the associated token account. Retrying...", accountError);
        //     // Optionally, implement a retry mechanism here
        // }
        
        // console.log("Minting to token account:", tokenAccount.address.toString());

        // await splToken.mintTo(
        //     connection,
        //     walletKeyPair,
        //     mintAddress,
        //     tokenAccount.address,
        //     walletKeyPair,
        //     100000000000
        // );

        // solBalance = await connection.getBalance(walletKeyPair.publicKey);
        // console.log("New SOL Balance:", solBalance / web3.LAMPORTS_PER_SOL);


        const secondKeyPair = 'FpypPQScocHTCXuHFDLiW6TXqt9ann1Y86RgRCt47rz1'
        console.log ("Second Key Pair", secondKeyPair)
        console.log("Wallet Key Pair", walletKeyPair.publicKey.toString())
        const transaction = new web3.Transaction().add(
            web3.SystemProgram.transfer({
                fromPubkey: walletKeyPair.publicKey,
                toPubkey: secondKeyPair,
                lamports: web3.LAMPORTS_PER_SOL * 0.1,
            })
        );

        const signature = await web3.sendAndConfirmTransaction(
            connection,
            transaction,
            [walletKeyPair]
        );
        console.log("SIGNATURE", signature);

    } catch (error) {
        console.error("Error occurred:", error);
    }
}

main();

// const privateKey = new
//     Uint8Array(bs58.decode(process.env["PRIVATE_KEY"]));


// const account = new web3.Keypair.fromSecretKey(privateKey);

// const account2 = web3.Keypair.generate();


// (async  () => {
//     const transaction = new web3.Transaction().add(
//         web3.SystemProgram.transfer({
//             fromPubkey: account.publicKey,
//             toPubkey: account2.publicKey,
//             lamports: 1000000,
//         })
//     );
// }

//     )