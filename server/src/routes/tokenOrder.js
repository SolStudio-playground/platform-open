const express = require('express');
const router = express.Router();
const TokenOrder = require('../models/TokenOrder');
const { authenticateToken } = require('../middleware/auth')
const { checkDomain } = require('../middleware/domain.js');
;
const { token } = require('@metaplex-foundation/js');
// Create a new TokenOrder
router.post('/tokenOrder', authenticateToken, checkDomain, async (req, res) => {
    try {
        // const userId = req.user.id;
        // if (!userId) {
        //     return res.status(400).send({ error: 'User ID is required' });
        // }
        const tokenOrder = new TokenOrder({ ...req.body });
        await tokenOrder.save();
        res.status(201).send(tokenOrder);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Read all TokenOrders
router.get('/tokenOrders', authenticateToken, checkDomain, async (req, res) => {
    const userId = req.user.id;
    try {
        const tokenOrders = await TokenOrder.find({ user: userId, tokenStatus: 1 });
        res.send(tokenOrders);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Read a TokenOrder by ID
router.get('/tokenOrder/:tokenAddress', authenticateToken, checkDomain, async (req, res) => {
    const { tokenAddress } = req.params;
    try {
        const token = await TokenOrder.findOne({ tokenAddress });
        if (!token) {
            return res.status(404).json({ message: "Token not found" });
        }
        res.json(token);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred", error });
    }
});

// Update a TokenOrder by ID
router.put('/tokenOrder/:id', authenticateToken, checkDomain, async (req, res) => {
    const userId = req.user.id;
    try {
        const tokenOrder = await TokenOrder.findByIdAndUpdate(
            { _id: req.params.id, user: userId, tokenStatus: 1 },
            req.body,
            { new: true }
        );
        if (!tokenOrder) {
            return res.status(404).send();
        }
        res.send(tokenOrder);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a TokenOrder by ID
router.delete('/tokenOrder/:id', authenticateToken, checkDomain, async (req, res) => {
    const userId = req.user.id;
    try {
        const tokenOrder = await TokenOrder.findByIdAndUpdate(
            { _id: req.params.id, user: userId },
            { $set: { tokenStatus: 9 } },
            { new: true }
        )
        if (!tokenOrder) {
            return res.status(404).send();
        }
        res.send('TokenOrder deleted successfully');
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
