
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecipientSchema = new Schema({
    walletAddress: {
        type: String,
        required: true,
    },
    associatedTokenAddress: {
        type: String,
        required: true,
    },

    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    },
    transactionSignature: {
        type: String,
        default: '',
    },
    multiSenderId: {
        type: Schema.Types.ObjectId,
        ref: 'MultiSender',
        required: true,
    },
    refundTransactionSignature: {
        type: String,
        default: '',
    },
});

const Recipient = mongoose.model('Recipient', RecipientSchema);
module.exports = Recipient;
