const web3 = require("@solana/web3.js");
const bs58 = require("bs58");
const splToken = require("@solana/spl-token");

(async () => {
    // Connect to Solana Devnet
    const solana = new web3.Connection(web3.clusterApiUrl("devnet"));

    // Decode the provided secret key from base58
    const secretKeyBase58 = "2HyWppQPkbm9MjyHtMe15jUiouhdbtdyxaNXGfAd3wZNiCeBCEuDAxiZQhhWYZeYsusUG4hZPWUUWKRToH24RVVp";
    const secretKey = bs58.decode(secretKeyBase58);
    console.log(secretKey)

    // Initialize fromWallet with the decoded secret key
    const fromWallet = web3.Keypair.fromSecretKey(secretKey);

    // Array of wallet addresses to send SOL to
    const toWalletAddresses = [
        "FpypPQScocHTCXuHFDLiW6TXqt9ann1Y86RgRCt47rz1",
        "9TdBgZsULnF2cT5dHyZdAPc3vujrY4AbsLwW6SgtmGjY"
    ];

    // Mint address to check
    const mintAddress = "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr";
    const mintPublicKey = new web3.PublicKey(mintAddress);

    // Send SOL to each address in the toWalletAddresses array
    for (const address of toWalletAddresses) {
        const toWalletPublicKey = new web3.PublicKey(address);

        // Create the transaction for the current recipient
        const transaction = new web3.Transaction().add(
            web3.SystemProgram.transfer({
                fromPubkey: fromWallet.publicKey,
                toPubkey: toWalletPublicKey,
                lamports: web3.LAMPORTS_PER_SOL / 5000, // Adjust the amount of SOL to send
            })
        );

        // Sign and send the transaction
        const signature = await solana.sendTransaction(transaction, [fromWallet], {skipPreflight: false});
        console.log(`Transaction signature for ${address}:`, signature);

        // Check if the current recipient holds the token
        const tokenAccounts = await solana.getTokenAccountsByOwner(toWalletPublicKey, {mint: mintPublicKey});
        if (tokenAccounts.value.length > 0) {
            console.log(`Wallet ${address} holds tokens of mint address ${mintAddress}`);
            tokenAccounts.value.forEach(account => {
                const accountInfo = splToken.AccountLayout.decode(account.account.data);
                console.log(`Token account: ${account.pubkey.toBase58()}, Balance: ${accountInfo.amount}`);
            });
        } else {
            console.log(`Wallet ${address} does not hold tokens of mint address ${mintAddress}`);
        }
    }
})();
