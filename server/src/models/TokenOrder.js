
const mongoose = require('mongoose');


const MetadataSchema = new mongoose.Schema({
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    uri: { type: String, required: true },
}, { _id: false });
const TokenOrderSchema = new mongoose.Schema({
    program: {type: Number, required: true}, // 1:Token Program, 2: 2022 Program
    programName: { type: String, required: true },
    tokenName: { type: String, required: true },
    tokenSymbol: { type: String, required: true },
    tokenAddress: { type: String, required: true },
    tokenPictureUrl: { type: String},
    tokenSupply: { type: Number, required: true },
    decimals: { type: Number, required: true, default: 0 },
    tags: { type: Array },
    description: { type: String },
    websiteUrl: { type: String },
    twitterUrl: { type: String },
    telegramUrl: { type: String },
    discordUrl: { type: String },
    creator: { type: Object },
    metadata: { type: MetadataSchema, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectOwner'},
    tokenStatus: { type: Number, default: 1 },
    orderValue: { type: Number},
    enableFreeze: { type: Boolean, default: false },
    isImmutable: { type: Boolean, default: false },
    revokeAuthority: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'paid', 'completed'], default: 'pending' },
    signature: { type: String, required: true },

});

const TokenOrder = mongoose.model('TokenOrder', TokenOrderSchema);
module.exports = TokenOrder;
