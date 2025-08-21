const express = require('express');
const router = express.Router();


// middlewares
const { authenticateToken } = require('../middleware/auth.js');
const { checkDomain } = require('../middleware/domain.js');

// utils
const logActivity = require('../utils/logs.js');

// models
const OpenBook = require('../models/openBook.js');
const TransactionRecord = require('../models/Transaction.js');

const { LAMPORTS_PER_SOL } = require('@solana/web3.js');
const verifyTransaction = require('../utils/verifyTransaction.js');



router.post('/openBookOrder', authenticateToken, checkDomain, async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(400).send({ error: 'User ID is required' });
        }
        const openBook = new OpenBook({ ...req.body, user: userId });
        await openBook.save();
        res.status(201).send(openBook);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/openBooks', authenticateToken, checkDomain, async (req, res) => {
    const userId = req.user.id;
    try {
        const openBooks = await OpenBook.find({ user: userId });
        res.send(openBooks);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/openBook/:id', authenticateToken, checkDomain, async (req, res) => {
    const userId = req.user.id;
    try {
        const openBook = await OpenBook.findOne({ marketId: req.params.id, user: userId });
        if (!openBook) {
            return res.status(404).send();
        }
        res.send(openBook);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.put('/openBook/:id', authenticateToken, checkDomain, async (req, res) => {
    const userId = req.user.id;
    try {
        const openBook = await OpenBook.findOne({ _id: req.params.id, user: userId });
        if (!openBook) {
            return res.status(404).send();
        }
        Object.keys(req.body).forEach(key => openBook[key] = req.body[key]);
        await openBook.save();
        res.send(openBook);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/verifyOpenBookPayment', authenticateToken, checkDomain, async (req, res) => {
    const { signature, orderId, } = req.body;
    const userId = req.user.id;
    try {
        if (!signature || !orderId) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const order = await OpenBook.findById(orderId).lean();
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        const expectedAmount = LAMPORTS_PER_SOL * 0.2;

        // const oldTransaction = await TransactionRecord.findOne({ signature: signature });
        // if (oldTransaction) {
        //     return res.status(400).json({ message: 'Transaction already verified.' });
        // }


        const verificationResult = await verifyTransaction(signature, expectedAmount, userId);
        if (verificationResult.success) {
            await OpenBook.findByIdAndUpdate(orderId, { status: 'active' });
            const newTransaction = new TransactionRecord({
                userAddress: verificationResult.userAddress,
                tokenAddress: order.tokenAddress,
                amount: verificationResult.balanceChange,
                transactionType: verificationResult.transactionType === 'deposit' ? 'openBook' : 'withdraw',
                signature: signature,
                networkFee: verificationResult.fee
            });
            await newTransaction.save();

            // const pool = await createSolanaPool(verificationResult.userAddress, connection);
            // log the activity of the verficationResult the success is false
            // await logActivity('transaction', 'transaction', newTransaction._id, verificationResult.message, verificationResult.userAddress);
            await logActivity('transaction', 'openBookCreate', newTransaction._id, verificationResult.message, verificationResult.userAddress);

            res.json({ message: 'Payment verified, order activated.', transaction: newTransaction });
        } else if (!verificationResult.success) {
            res.status(400).json({ message: 'Transaction not found or does not meet the criteria after several attempts.' });
            await OpenBook.findByIdAndUpdate(orderId, { status: 'failed' });
            await logActivity('transaction', 'openBookCreate', signature, 'Transaction not found or does not meet the criteria after several attempts.', verificationResult.userAddress);
        }
        else {
            await OpenBook.findByIdAndUpdate(orderId, { status: 'failed' });
            res.status(400).json({ message: 'Transaction verification failed.' });
            await logActivity('transaction', 'openBookCreate', signature, 'Transaction verification failed.', verificationResult.userAddress);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred", error });
    }
});


module.exports = router;