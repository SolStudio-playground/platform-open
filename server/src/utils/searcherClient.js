require('dotenv').config();
const { Keypair, Connection, PublicKey } = require('@solana/web3.js');
const fs = require('fs');
const { searcherClient } = require('../sdk/block-engine/searcher');

const initSearcherClient = async () => {
  const blockEngineUrl = process.env.BLOCK_ENGINE_URL || '';
  const authKeypairPath = process.env.AUTH_KEYPAIR_PATH || '';
  const decodedKey = new Uint8Array(JSON.parse(fs.readFileSync(authKeypairPath).toString()));
  const keypair = Keypair.fromSecretKey(decodedKey);
  console.log('keypair', keypair.publicKey.toBase58());
  const accounts = (process.env.ACCOUNTS_OF_INTEREST || '').split(',').map(a => new PublicKey(a));
  console.log('accounts', accounts);
  const noAuth = process.env.NO_AUTH || '';

  const client = noAuth === 'true' ? searcherClient(blockEngineUrl, undefined) : searcherClient(blockEngineUrl, keypair);
  const rpcUrl = process.env.RPC_URL || '';
  const conn = new Connection(rpcUrl, 'confirmed');

  return { client, accounts, conn };
};

module.exports = { initSearcherClient };
