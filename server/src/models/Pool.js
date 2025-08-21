const mongoose = require('mongoose');

const poolSchema = new mongoose.Schema({
  creatorAddress: String,
  tokenAddress: String,
  depositAmount: Number,
  nftCollection: String,
  claimStatus: { type: Map, of: Boolean },
  privateKey: String,
});

const Pool = mongoose.model('Pool', poolSchema);

module.exports = Pool;
