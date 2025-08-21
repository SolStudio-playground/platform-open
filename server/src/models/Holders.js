const mongoose = require('mongoose');

const HolderSchema = new mongoose.Schema({
    snapshot: { type: mongoose.Schema.Types.ObjectId, ref: 'Snapshot' },
    address: { type: String, required: true },
    balance: { type: Number, required: true },
    holderSince: { type: Date }  // New field to store the holding start time

});

const Holder = mongoose.model('Holder', HolderSchema);
module.exports = Holder;
