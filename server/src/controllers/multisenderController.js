require('dotenv').config();

const { sendSPLTokens, calculateAssociatedAccountCreationFee } = require('../actions/sendSPLTokenBulk');
const Holder = require('../models/Holders');
const MultiSender = require('../models/MultiSender');
const Snapshot = require('../models/Snapshot');
const { LAMPORTS_PER_SOL } = require('@solana/web3.js');
const verifyTransaction2 = require('../utils/verifyTransaction2');
const mongoose = require('mongoose');
const Recipient = require('../models/MultiSenderWallets');
const { refundSender } = require('../actions/refundSender');
const createTransactionRecord = require('../utils/createTransactionRecord');


const getSnapshotDetails = async (req, res) => {
  const { snapshotId } = req.params;

  try {
    const snapshot = await Snapshot.findById(snapshotId);

    if (!snapshot) {
      return res.status(404).json({ message: "Snapshot not found" });
    }

    const holders = await Holder.find({ snapshot: snapshotId }).select('address balance -_id').lean();
    const response = holders.map(holder => ({
      walletAddress: holder.address,
      amount: holder.balance,
    }));

    res.json(response);
  } catch (error) {
    console.error('Error retrieving snapshot details:', error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const getMultiSendersByUser = async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10 } = req.query;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid User ID format" });
  }

  try {
    const query = { createdBy: userId };

    const multiSenders = await MultiSender.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const totalMultiSenders = await MultiSender.countDocuments(query);

    res.status(200).json({
      multiSenders,
      totalMultiSenders,
    });
  } catch (error) {
    console.error('Error retrieving MultiSenders:', error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



const getMultiSenderStatus = async (req, res) => {
  const { id } = req.params;
  const { page, limit, walletAddress = '', status = '', transactionSignature = '' } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const multiSenderRecord = await MultiSender.findById(id, '-createdBy').lean();

    if (!multiSenderRecord) {
      return res.status(404).json({ message: "MultiSender record not found" });
    }

    const query = { multiSenderId: id };
    if (walletAddress) {
      query.walletAddress = { $in: walletAddress.split(',').map(addr => new RegExp(addr, 'i')) };
    }
    if (status) {
      query.status = { $in: status.split(',').map(stat => new RegExp(stat, 'i')) };
    }
    if (transactionSignature) {
      query.transactionSignature = { $in: transactionSignature.split(',').map(sig => new RegExp(sig, 'i')) };
    }

    const recipients = await Recipient.find(query)
      .select('walletAddress amount status transactionSignature')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const totalRecipients = await Recipient.countDocuments(query);

    multiSenderRecord.recipients = recipients;
    multiSenderRecord.totalRecipients = totalRecipients;

    res.status(200).json(multiSenderRecord);
  } catch (error) {
    console.error('Error retrieving MultiSender status:', error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


const verifyAndSendTokens = async (req, res) => {
  const { senderWallet, recipients, signature, tokenMintAddress, decimals, tokenName, tokenSymbol } = req.body;

  // Calculate the expected amount (total fees)
  const ASSOCIATED_ACCOUNT_CREATION_FEE = await calculateAssociatedAccountCreationFee();
  const PLATFORM_FEE_PER_WALLET = 0.001 * LAMPORTS_PER_SOL;
  const totalAssociatedAccountFees = recipients.length * ASSOCIATED_ACCOUNT_CREATION_FEE;
  const totalPlatformFees = recipients.length * PLATFORM_FEE_PER_WALLET;

  let transactionRecord;

  try {
    const verificationResult = await verifyTransaction2(signature, { associatedAccountFees: totalAssociatedAccountFees, platformFees: totalPlatformFees }, senderWallet);
    if (!verificationResult.success) {
      return res.status(400).json({
        success: false,
        message: verificationResult.message,
      });
    }


    // Create a MultiSender record in the database
    transactionRecord = new MultiSender({
      senderWallet,
      tokenAddress: tokenMintAddress,
      signatures: [],
      createdBy: req.user.id,
      tokenName,
      tokenSymbol,
    });
    transactionRecord.signatures.push(signature);

    await transactionRecord.save();

    // Send the response to the client with the transactionRecordId immediately
    res.status(200).json({
      success: true,
      transactionRecordId: transactionRecord._id,
      message: 'Transaction record created. Processing in the background.',
    });

    // Send SPL tokens in the background ==> Biggie
    const keypairFile = process.env.WALLET_PATH;
    const results = await sendSPLTokens(keypairFile, recipients, tokenMintAddress, decimals, transactionRecord, senderWallet);

    // Update the signatures in the transactionRecord ==> Biggie
    transactionRecord.signatures = results.map(r => r.signature).filter(Boolean);

    // Calculate success rate
    const successCount = results.filter(result => result.success).length;
    const successRate = successCount / results.length;
    const isSuccessThresholdMet = successRate >= 0.8;

    // Update the status of the MultiSender record based on the results
    transactionRecord.status = isSuccessThresholdMet ? 'completed' : 'failed';

    if (isSuccessThresholdMet && transactionRecord.existingAccountsCount > 0) {
      const refundAmount = transactionRecord.existingAccountsCount * ASSOCIATED_ACCOUNT_CREATION_FEE;
      const refundResult = await refundSender(keypairFile, senderWallet, refundAmount);

      if (refundResult.success) {
        transactionRecord.refundTransactionSignature = refundResult.signature;
      } else {
        console.error(`Refund failed: ${refundResult.error}`);
      }
    }
    await transactionRecord.save();

    const transactionResult = await createTransactionRecord(
      senderWallet,
      tokenMintAddress,
      verificationResult.platformWalletBalanceChange,
      'platform_fee',
      signature,
    );

    if (!transactionResult.success) {
      console.error('Failed to create platform fee transaction record:', transactionResult.error);
    }
  } catch (error) {
    console.error('Error processing transaction:', error);
    if (transactionRecord) {
      transactionRecord.status = 'failed';
      await transactionRecord.save();
    }
  }
};






module.exports = {
  getMultiSenderStatus,
  verifyAndSendTokens,
  getSnapshotDetails,
  getMultiSendersByUser,
};
