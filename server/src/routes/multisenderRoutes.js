const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.js');
const { checkDomain } = require('../middleware/domain.js');
const { getSnapshotDetails, verifyAndSendTokens, getMultiSenderStatus, getMultiSendersByUser } = require('../controllers/multisenderController.js');

// router.post('/multisender/snapshot/:snapshotId', checkDomain, authenticateToken, getSnapshotDetails);
router.post('/multisender/verifyAndSend', checkDomain, authenticateToken, verifyAndSendTokens);


// get request
router.get('/multisender/:id/status', checkDomain, authenticateToken, getMultiSenderStatus);
router.get('/multisender/getMultiSendersByUser', checkDomain, authenticateToken, getMultiSendersByUser);
module.exports = router;

