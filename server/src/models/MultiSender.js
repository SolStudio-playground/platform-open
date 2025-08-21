const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MultiSenderSchema = new Schema({
  senderWallet: {
    type: String,
    required: true,
  },
  tokenAddress: {
    type: String,
    required: true,
  },
  tokenName: {
    type: String,
  },
  tokenSymbol: {
    type: String,
  },
  signatures: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  newAccountsCount: {
    type: Number,
    default: 0,
  },
  existingAccountsCount: {
    type: Number,
    default: 0,
  },
  refundTransactionSignature: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'ProjectOwner',
    required: true,
  },
});

MultiSenderSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const MultiSender = mongoose.model('MultiSender', MultiSenderSchema);
module.exports = MultiSender;
