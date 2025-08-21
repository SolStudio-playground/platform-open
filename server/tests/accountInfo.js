const web3 = require("@solana/web3.js");
(async () => {
  const publicKey = new web3.PublicKey(
    "249uXZ4eoSGzZdw4qS9CGobGoa5bw7wLyMytcx2YHwMR"
  );
  const solana = new web3.Connection("https://docs-demo.solana-mainnet.quiknode.pro/");
  console.log(await solana.getAccountInfo(publicKey));
})();
