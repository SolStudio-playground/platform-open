// models/Log.js
const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    contentType: {
        type: String,
        required: true
    },
    contentName: {
        type: String,
        required: true
    },
    contentId: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

const Log = mongoose.model('Log', LogSchema);

module.exports = Log;
