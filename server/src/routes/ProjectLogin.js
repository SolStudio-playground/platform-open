const express = require('express');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const { PublicKey } = require('@solana/web3.js');

const ProjectOwner = require('../models/ProjectOwner');
const Token = require('../models/Token');
const { fetchTokens } = require('../actions/fetchTokens');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();
const { checkDomain } = require('../middleware/domain.js');
const nacl = require('tweetnacl');
const validateToken = require('../utils/validateToken.js');


router.post('/login', async (req, res) => {
    const { walletAddress, message, signature } = req.body;
  
    if (!walletAddress || !message || !signature) {
      return res.status(400).json({ message: "Wallet address, message, and signature are required" });
    }
  
    try {
      const pubKey = new PublicKey(walletAddress);
      const encodedMessage = new TextEncoder().encode(message);
      const decodedSignature = Buffer.from(signature, 'base64');
      const decodedPublicKey = pubKey.toBuffer();
  
      // Verify the signature
      const isVerified = nacl.sign.detached.verify(encodedMessage, decodedSignature, decodedPublicKey);
  
      if (!isVerified) {
        return res.status(403).json({ message: "Invalid signature" });
      }
  
      // Use findOneAndUpdate with upsert to atomically upsert a projectOwner
      const projectOwner = await ProjectOwner.findOneAndUpdate(
        { walletAddress },
        { $setOnInsert: { walletAddress, projects: [] } },
        { new: true, upsert: true, runValidators: true }
      );
  
      // Payload creation and token generation remains the same
      const payload = { walletAddress, role: 'projectOwner', id: projectOwner._id };
      const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
      res.status(200).json({ message: "Logged in successfully", accessToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred", error });
    }
  });

  router.post('/validate-token', (req, res) => {
    const { token } = req.body;
  
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }
  
    const isValid = validateToken(token);
    if (isValid) {
      return res.status(200).json({ isValid: true });
    } else {
      return res.status(401).json({ isValid: false });
    }
  });



// const limiter = rateLimit({
//     windowMs: 2 * 60 * 1000, // 2 minutes
//     max: 1, // Accept 1 request per 2 minutes
// });

router.get('/refreshTokens/:walletAddress', authenticateToken, checkDomain, async (req, res) => {
    const { walletAddress } = req.params;
    const { id: userId } = req.user; // Assuming this is the id of the logged-in ProjectOwner

    if (!walletAddress) {
        return res.status(400).json({ message: "Wallet address is required" });
    }

    try {
        let projectOwner = await ProjectOwner.findOne({ walletAddress });
        if (!projectOwner) {
            return res.status(404).json({ message: "Project owner not found" });
        }

        console.log("fetching tokens",walletAddress, userId);

        const newTokenIds = await fetchTokens(walletAddress, userId);
        console.log("newTokenIds",newTokenIds);
        // Ensure no duplication and update the projectOwner with new tokens only
        const uniqueNewTokenIds = [...new Set(newTokenIds)];
        const updatedProjects = Array.from(new Set([...projectOwner.projects.map(id => id.toString()), ...uniqueNewTokenIds]));
        // Update the projectOwner's projects if there are new tokens
        if (newTokenIds.length > 0) {
            projectOwner.projects = updatedProjects;
            await projectOwner.save();
        }

        res.status(200).json({ message: "Projects refetched successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred", error });
    }
}
);



module.exports = router;
