
const mongoose = require('mongoose');


const openBookSchema = new mongoose.Schema({
    program: { type: Number, required: true, default: 1 }, // 1:Token Program, 2: 2022 Program
    baseMint: { type: String, required: true },
    quoteMint: { type: String, required: true },
    baseDecimals: { type: Number, required: true },
    quoteDecimals: { type: Number, required: true },
    lotSize: { type: Number, required: true },
    tickSize: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectOwner' },
    signatureForPayment: { type: String, required: true },
    signatureForOrder: [{ type: String }],
    marketId: { type: String },
    walletAddress: { type: String, required: true },
    status: { type: String, enum: ['pending', 'paid', 'completed','failed'], default: 'pending' },
    tokenAddress: { type: String, required: true },
});

const OpenBook = mongoose.model('OpenBook', openBookSchema);
module.exports = OpenBook