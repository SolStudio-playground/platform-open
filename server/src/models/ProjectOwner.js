const mongoose = require('mongoose');

const projectOwnerSchema = new mongoose.Schema({
    name: { type: String},
    email: { type: String},
    walletAddress: { type: String, required: true, unique: true },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Token' }] 
}, { timestamps: true });

const ProjectOwner = mongoose.model('ProjectOwner', projectOwnerSchema);
module.exports = ProjectOwner;
