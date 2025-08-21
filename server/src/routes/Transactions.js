
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction.js');
const { authenticateToken } = require('../middleware/auth')
const { checkDomain } = require('../middleware/domain.js');


// verifyPayment
const verifyTransaction = require('../utils/verifyTransaction.js');




// public

router.post('/transaction', checkDomain, authenticateToken, async (req, res) => {
    try {
        const { amount, signature, tokenAddress, userAddress, transactionType } = req.body
        const userId = req.user.id;
        if (!userId) {
            return res.status(400).send({ error: 'User ID is required' });
        }
        await verifyTransaction(signature, amount, userId);
        const ttransaction = new Transaction({
            amount,
            signature,
            tokenAddress,
            userAddress,
            transactionType
        });
        await ttransaction.save();
        res.status(201).send('transaction created');
    } catch (error) {
        res.status(400).send(error);
    }
});


// get transaction by signature
router.get('/transaction/:signature', checkDomain, authenticateToken, async (req, res) => {
    const { signature } = req.params;
    try {
        const transaction = await Transaction.findOne({ signature }).select('tokenAddress signature userAddress');
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred", error });
    }
});


module.exports = router; 