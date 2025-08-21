const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userAddress: { type: String },
    tokenAddress: { type: String, required: true },
    amount: { type: Number, required: true },
    transactionType: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    signature: { type: String, required: true, unique: true },
    networkFee: { type: Number }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;