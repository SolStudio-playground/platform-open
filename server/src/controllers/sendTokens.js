const { sendSPLTokens } = require("../actions/sendSPLTokenBulk");
const ProjectOwner = require("../models/ProjectOwner");

async function getEligibleProjectOwners() {
    return await ProjectOwner.find({ 'projects.2': { $exists: true } });
}

const sendToken = async (req, res) => {
    const { tokenAddress, decimals, owners } = req.body;
    try {
        // const owners = await getEligibleProjectOwners();
        const keypairFile = '/Users/biggie/Documents/GitHub/parachut-deployment/server/wallet/Ts2bXzwGvBEafqkPxapoTjxCt6wXPBMDiPhUumAQXQr.json';
        const amount = 5000;
        const transactionSignature = await sendSPLTokens(keypairFile, owners, amount, tokenAddress, decimals);
        res.send(`Tokens sent successfully in one transaction: ${transactionSignature}`);
    } catch (error) {
        console.error('Failed to send tokens:', error);
        res.status(500).send('Failed to send tokens.');
    }
};

const getProjectOwners = async (req, res) => {
    try {
        const owners = await ProjectOwner.find({}, 'walletAddress -_id');
        res.json(owners);
    } catch (error) {
        console.error('Failed to retrieve project owners:', error);
        res.status(500).send('Failed to retrieve project owners.');
    }
};

module.exports = { sendToken, getProjectOwners };
