const axios = require('axios');
const Bottleneck = require('bottleneck');

const limiter = new Bottleneck({
    minTime: 200 // Minimum time between requests in milliseconds (5 requests per second)
});

// Function to send bundle
async function sendBundle(transactions) {
    const response = await axios.post('https://mainnet.block-engine.jito.wtf/api/v1/bundles', {
        jsonrpc: "2.0",
        id: 1,
        method: "sendBundle",
        params: [transactions]
    }, {
        headers: {
            'Content-Type': 'application/json',
            // 'x-jito-auth': 'YOUR_API_KEY', // Uncomment and add your API key if needed
        }
    });
    return response.data.result;
}

// Wrap sendBundle function with rate limiter
const limitedSendBundle = limiter.wrap(sendBundle);

// Function to get bundle statuses
async function getBundleStatuses(bundleIds) {
    const response = await axios.post('https://mainnet.block-engine.jito.wtf/api/v1/bundles', {
        jsonrpc: "2.0",
        id: 1,
        method: "getBundleStatuses",
        params: [bundleIds]
    }, {
        headers: {
            'Content-Type': 'application/json',
            // 'x-jito-auth': 'YOUR_API_KEY', // Uncomment and add your API key if needed
        }
    });
    return response.data.result;
}

// Function to get tip accounts
async function getTipAccounts() {
    const response = await axios.post('https://mainnet.block-engine.jito.wtf/api/v1/bundles', {
        jsonrpc: "2.0",
        id: 1,
        method: "getTipAccounts",
        params: []
    }, {
        headers: {
            'Content-Type': 'application/json',
            // 'x-jito-auth': 'YOUR_API_KEY', // Uncomment and add your API key if needed
        }
    });
    return response.data.result;
}

module.exports = {
    limitedSendBundle,
    getBundleStatuses,
    getTipAccounts
};
