const mpl = require("@metaplex-foundation/mpl-token-metadata");
const web3 = require("@solana/web3.js");
const fs = require("fs");
const bs58 = require("bs58");
const { createUmi, signerIdentity } = require("@metaplex-foundation/umi");
const { fromWeb3JsKeypair } = require("@metaplex-foundation/umi-web3js-adapters");

import { mplTokenMetadata, MPL_TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";

function loadWalletKey(keypairFile) {
    // Decode the secret key of the payer account from Base58 encoding
    const secretKeyBase58 = "2HyWppQPkbm9MjyHtMe15jUiouhdbtdyxaNXGfAd3wZNiCeBCEuDAxiZQhhWYZeYsusUG4hZPWUUWKRToH24RVVp";
    const secretKey = bs58.decode(secretKeyBase58);
    const payer = web3.Keypair.fromSecretKey(secretKey);
    return payer;
}

const INITIALIZE = true;


async function main() {
    console.log("let's name some tokens!");
    const myKeypair = loadWalletKey("payer.json");
    const mint = new web3.PublicKey("FLxMBGHScNWSVGic1wLb2bf6Kvd7GwyorWzxh7hXVc2G");
    const umi = createUmi('https://api.devnet.solana.com');
    const signer = fromWeb3JsKeypair(umi, fromWeb3JsKeypair(myKeypair));

    umi.use(signerIdentity(signer, true))


    const seed1 = Buffer.from("metadata", "utf-8");
    const seed2 = Buffer.from(mpl.PROGRAM_ID.toBytes());
    const seed3 = Buffer.from(mint.toBytes());
    const [metadataPDA, _bump] = web3.PublicKey.findProgramAddressSync([seed1, seed2, seed3], MPL_TOKEN_METADATA_PROGRAM_ID);
    const accounts = {
        metadata: metadataPDA,
        mint,
        mintAuthority: myKeypair.publicKey,
        payer: myKeypair.publicKey,
        updateAuthority: myKeypair.publicKey,
    };
    const dataV2 = {
        name: "Biggie Brik",
        symbol: "BRK",
        uri: "https://shdw-drive.genesysgo.net/ArP7jjhVZsp7vkzteU7mpKA1fyHRhv4ZBz6gR7MJ1JTC/metadata.json",
        sellerFeeBasisPoints: 0,
        creators: null,
        collection: null,
        uses: null
    };
    let ix;

    if (INITIALIZE) {
        const args = {
            createMetadataAccountArgsV3: {
                data: dataV2,
                isMutable: true,
                collectionDetails: null
            }
        };
        ix = mpl.createCreateMetadataAccountV3Instruction(accounts, args);
    } else {
        const args = {
            updateMetadataAccountArgsV2: {
                data: dataV2,
                isMutable: true,
                updateAuthority: myKeypair.publicKey,
                primarySaleHappened: true
            }
        };
        ix = mpl.createUpdateMetadataAccountV2Instruction(accounts, args);
    }
    const tx = new web3.Transaction();
    tx.add(ix);
    const connection = new web3.Connection("https://api.mainnet-beta.solana.com");
    const txid = await web3.sendAndConfirmTransaction(connection, tx, [myKeypair]);
    console.log(txid);
}

main();
