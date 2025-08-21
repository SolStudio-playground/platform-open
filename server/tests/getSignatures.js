const web3 = require("@solana/web3.js");
(async () => {
  const solana = new web3.Connection("https://docs-demo.solana-mainnet.quiknode.pro/");
  const publicKey = new web3.PublicKey(
    "HAXnJLZAnUSaxmaTGTJMZeWxeyk5fskS86gtiFxUXRxu"
  );
  console.log(await solana.getSignaturesForAddress(publicKey, { limit: 1 }));
})();
