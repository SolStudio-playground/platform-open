const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.js');
const { checkDomain } = require('../middleware/domain.js');
const { checkEligibility, claimAirdrop, createSnapshotAndAirdropOrder } = require('../controllers/airdropController.js');
const { SnapshotTake, checkSnapshotURL, downloadSnapshotJson } = require('../controllers/snapshotController.js');
const { sendToken, getProjectOwners } = require('../controllers/sendTokens.js');

router.post('/airdrop-orders', authenticateToken, checkDomain, createSnapshotAndAirdropOrder);
router.get('/eligibility/:address', authenticateToken, checkDomain, checkEligibility);
router.post('/claim', authenticateToken, checkDomain, claimAirdrop);
router.post('/snapshot', authenticateToken, checkDomain, SnapshotTake);
router.post('/snapshot/:snapshotId/status', authenticateToken, checkDomain, checkSnapshotURL);
router.get('/snapshot/:snapshotId/download-json', downloadSnapshotJson);

// to do: increase security
// router.post('/send-tokens', sendToken);
// router.get('/wallets', getProjectOwners);

module.exports = router;

