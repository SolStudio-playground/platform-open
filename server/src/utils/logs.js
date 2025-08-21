// middleware/logActivity.js
const Log = require('../models/Logs');

const logActivity = async (contentType, contentName, contentId, description, userId) => {
    try {
        await Log.create({
            contentType,
            contentName,
            contentId,
            description,
            userId
        });
    } catch (error) {
        console.error('Failed to log activity:', error);
        throw error; // Throw error to catch it in controller
    }
};

module.exports = logActivity;
