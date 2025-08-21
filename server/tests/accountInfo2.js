const { PublicKey, Connection } = require('@solana/web3.js');

// Wrap your asynchronous code in an async function
async function main() {
    const connection = new Connection('https://api.mainnet-beta.solana.com');
    let mint = await connection.getParsedAccountInfo(
        new PublicKey('249uXZ4eoSGzZdw4qS9CGobGoa5bw7wLyMytcx2YHwMR')
    );

    // all the token data is here
    console.log(mint.value.data.parsed);
}

// Call the async function
main();
