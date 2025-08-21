const { PublicKey } = require('@solana/web3.js');
const { MintLayout, freezeAccount } = require('@solana/spl-token');

async function checkAuthorities(connection, mintAddress) {
    try {
        const mintAccountInfo = await connection.getAccountInfo(new PublicKey(mintAddress));
        if (!mintAccountInfo) throw new Error("Mint account not found.");

        const mintData = MintLayout.decode(mintAccountInfo.data);
        return {
            hasMintAuthority: !!mintData.mintAuthorityOption,
            hasFreezeAuthority: !!mintData.freezeAuthorityOption,
            freezeAccount: mintData.mintAuthorityOption === 1 ? mintData.freezeAuthority.toBase58() : null,
            mintAuthority: mintData.mintAuthorityOption === 1 ? mintData.mintAuthority.toBase58() : null,
        };
    } catch (error) {
        console.error("Failed to fetch mint information:", error);
        return { hasMintAuthority: false, hasFreezeAuthority: false };
    }
}

module.exports = { checkAuthorities };