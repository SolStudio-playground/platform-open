const mongoose = require('mongoose');

const AirdropClaimSchema = new mongoose.Schema({
    airdropId: { type: mongoose.Schema.Types.ObjectId, ref: 'AirdropOrder', required: true },
    userAddress: { type: String, required: true },
    transactionSignature: { type: String },
    claimedAt: { type: Date, default: Date.now },
    claimed: { type: Boolean, default: false },  // Indicates if the claim has been successfully processed
    processing: { type: Boolean, default: false }  // Indicates if the claim is currently being processed
});

const AirdropClaim = mongoose.model('AirdropClaim', AirdropClaimSchema);
module.exports = AirdropClaim;
