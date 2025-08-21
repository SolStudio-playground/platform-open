const { sendSPLToken } = require("../actions/sendSPLToken");
const AirdropOrder = require("../models/Airdrop");
const Holder = require("../models/Holders");
const Snapshot = require('../models/Snapshot');
const AirdropClaim = require("../models/AirdropClaim");
const { LAMPORTS_PER_SOL } = require("@solana/web3.js");

const { fetchAndSaveTokenHolders } = require('./snapshotController');
const verifyTransaction = require("../utils/verifyTransaction");
exports.createAirdropOrder = async (req, res) => {
    const { snapshotId, minimumBalance, metadata } = req.body;
    const createdBy = req.user.id;  // Assuming you have user authentication and `req.user.id` is the user's ID

    try {
        const newAirdropOrder = new AirdropOrder({
            snapshot: snapshotId,
            minimumBalance,
            createdBy,
            metadata
        });

        await newAirdropOrder.save();
        res.status(201).json({
            message: "Airdrop order created successfully!",
            airdropOrder: newAirdropOrder
        });
    } catch (error) {
        console.error('Failed to create airdrop order:', error);
        res.status(500).json({ message: "Error creating airdrop order", error: error.message });
    }
};

// Endpoint to check eligibility for all airdrops
exports.checkEligibility = async (req, res) => {
    const userAddress = req.user.walletAddress;
    try {
        const airdrops = await AirdropOrder.find({ status: 'active' }).populate('snapshot');

        let eligibleAirdrops = [];
        for (let airdrop of airdrops) {

            const holder = await Holder.findOne({
                snapshot: airdrop.snapshot._id,
                address: userAddress,
                balance: { $gte: airdrop.minimumBalance }
            });

            if (holder) {
                eligibleAirdrops.push({
                    airdropId: airdrop._id,
                    tokenAddress: airdrop.snapshot.tokenAddress,
                    minimumBalance: airdrop.minimumBalance,
                    metadata: airdrop.metadata
                });
            }
        }

        res.json({ eligibleAirdrops });
    } catch (error) {
        console.error('Error checking eligibility:', error);
        res.status(500).json({ message: "Error checking eligibility", error: error.message });
    }
};





// AirdropController.js

// Endpoint to claim airdrop

exports.claimAirdrop = async (req, res) => {
    const { airdropId, paymentSignature } = req.body;
    const userAddress = req.user.walletAddress

    let processingClaim;

    try {
        const expectedPayment = 0.001 * LAMPORTS_PER_SOL;
        const paymentResult = await verifyTransaction(paymentSignature, expectedPayment, userAddress);
        // console.log('Payment verification result:', paymentResult);

        if (!paymentResult.success) {
            return res.status(400).json({ message: "Payment verification failed: " + paymentResult.message });
        }
        // Check if the airdrop has already been claimed by the user, or is being processed
        const existingClaim = await AirdropClaim.findOne({
            airdropId,
            userAddress,
            $or: [{ claimed: true }, { processing: true }]
        });

        if (existingClaim) {
            return res.status(409).json({ message: "Airdrop has already been claimed or is currently being processed." });
        }

        // Mark the claim as processing to block concurrent operations
        processingClaim = await AirdropClaim.findOneAndUpdate(
            { airdropId, userAddress, claimed: { $ne: true } },
            { $set: { processing: true, claimedAt: new Date() } },
            { upsert: true, new: true }
        );

        // Check eligibility and get details for the airdrop
        const airdropOrder = await AirdropOrder.findById(airdropId).populate('snapshot');
        if (!airdropOrder || !airdropOrder.snapshot) {
            // If no airdrop found, remove processing lock
            await AirdropClaim.findByIdAndUpdate(processingClaim._id, { $set: { processing: false } });
            return res.status(404).json({ message: "Airdrop not found or snapshot missing." });
        }

        const mintAddress = airdropOrder.snapshot.tokenAddress;
        if (!mintAddress) {
            await AirdropClaim.findByIdAndUpdate(processingClaim._id, { $set: { processing: false } });
            return res.status(404).json({ message: "Token address is missing in the snapshot." });
        }

        const amount = 5000000;
        const walletKeyPath = '/Users/biggie/Documents/GitHub/parachut-deployment/server/wallet/Ts2bXzwGvBEafqkPxapoTjxCt6wXPBMDiPhUumAQXQr.json';
        const transactionSignature = await sendSPLToken(walletKeyPath, userAddress, amount, mintAddress);

        // Update the claim to reflect successful completion
        await AirdropClaim.findByIdAndUpdate(processingClaim._id, {
            $set: { claimed: true, processing: false, transactionSignature }
        });

        res.json({
            message: "Airdrop claimed successfully",
            transactionSignature
        });
    } catch (error) {
        // Ensure to clear processing if an error occurs
        if (processingClaim && processingClaim._id) {
            await AirdropClaim.findByIdAndUpdate(processingClaim._id, { $set: { processing: false } });
        }
        console.error('Error claiming airdrop:', error);
        res.status(500).json({ message: "Error claiming airdrop", error: error.message });
    }
};

// Controller to handle the snapshot creation
exports.createSnapshotAndAirdropOrder = async (req, res) => {
    const { mintAddress, minimumBalance, metadata, decimals, holderSince } = req.body;
    // const createdBy = '66130ce7c10b0191475b7169';  // User authentication assumed
    const createdBy = req.user.id;
    if (!mintAddress || !decimals) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const snapshot = new Snapshot({
            tokenAddress: mintAddress,
        });
        await snapshot.save();
        await fetchAndSaveTokenHolders(mintAddress, minimumBalance, holderSince, decimals, snapshot._id);
        // console.log(`Snapshot created with ID: ${snapshot._id}`);
        const newAirdropOrder = new AirdropOrder({
            snapshot: snapshot._id,
            minimumBalance,
            createdBy,
            metadata
        });

        await newAirdropOrder.save();
        res.status(201).json({
            message: "Snapshot and airdrop order created successfully!",
            airdropOrder: newAirdropOrder
        });
    } catch (error) {
        console.error('Failed to create snapshot or airdrop order:', error);
        res.status(500).json({ message: "Error creating snapshot or airdrop order", error: error.message });
    }
};

