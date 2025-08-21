const mongoose = require('mongoose');

const SnapshotSchema = new mongoose.Schema({
    tokenAddress: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }, // Set to 30 days (1 month) for expiration
    status: {type : String, default: 'pending'},
    csvUrl: { type: String, default: null },
});

// Add a TTL index
SnapshotSchema.index({ "expiresAt": 1 }, { expireAfterSeconds: 0 });

const Snapshot = mongoose.model('Snapshot', SnapshotSchema);
module.exports = Snapshot;
