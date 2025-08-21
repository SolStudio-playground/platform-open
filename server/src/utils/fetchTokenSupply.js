const web3 = require("@solana/web3.js");

async function fetchSPLTokenTotalSupply(mintAddress) {
  // Initialize the connection to the Solana blockchain
  const connection = new web3.Connection("https://api.mainnet-beta.solana.com");

  try {
    // Fetch the total supply of the specified SPL token
    const tokenSupply = await connection.getTokenSupply(new web3.PublicKey(mintAddress));
    return tokenSupply.value; // This object contains the total supply and other details
  } catch (error) {
    console.error(`Failed to fetch total supply for token ${mintAddress}:`, error);
    return null;
  }
}

module.exports = fetchSPLTokenTotalSupply;