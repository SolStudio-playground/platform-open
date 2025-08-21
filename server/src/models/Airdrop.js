const mongoose = require('mongoose');

const AirdropOrderSchema = new mongoose.Schema({
    snapshot: { type: mongoose.Schema.Types.ObjectId, ref: 'Snapshot' },
    minimumBalance: { type: Number },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectOwner' },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, default: 'pending' }, // Could be 'pending', 'active', 'completed'
    metadata: { type: Object }
});

const AirdropOrder = mongoose.model('AirdropOrder', AirdropOrderSchema);
module.exports = AirdropOrder;
