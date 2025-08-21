const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  projectOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectOwner', required: true },
  amount: { type: Number, required: true },
  uniqueAddress: { type: String, required: true },
  recipients: [{ type: String }], // List of wallet addresses
  status: { type: String, enum: ['pending', 'paid', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  orderType: { type: String, required: true, enum: ['tokenOrder', 'nftOrder', 'otherOrderType'] }, // Define all possible order types here
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
