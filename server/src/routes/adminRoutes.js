const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.js');
const { checkDomain } = require('../middleware/domain.js');
const { verifyAdmin } = require('../controllers/adminController.js');

router.post('/verifyAdmin', authenticateToken, checkDomain, verifyAdmin);

module.exports = router;

