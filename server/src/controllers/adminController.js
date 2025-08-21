const express = require('express');
const { PublicKey } = require('@solana/web3.js');
const nacl = require('tweetnacl');

const adminPublicKeys = [
    '2EfDpUecNSWrnEGTodJ9HLyKvVh2Knush5aRLhWvqkJk',
    '25fGaTT1CbLVSxrtnMW2xLWErsqHcPzhP1tv8Rrr6yYM',
    'BGuTS2LvaN3RQcsfffx5rMTPynNrN9bPK5Sjks6imipE'
    
];



exports.verifyAdmin = async (req, res) => {
    const { publicKey } = req.body;

    try {
        const pubKey = new PublicKey(publicKey);

        if (adminPublicKeys.includes(pubKey.toBase58())) {
            res.status(200).json({ isAdmin: true });
        } else {
            res.status(403).json({ isAdmin: false });
        }
    } catch (error) {
        res.status(500).json({ isAdmin: false, error: 'Error verifying admin' });
    }
};
