const Transaction = require('../models/Transaction');

const createTransactionRecord = async (userAddress, tokenAddress, amount, transactionType, signature, networkFee = 0) => {
  const transactionRecord = new Transaction({
    userAddress,
    tokenAddress,
    amount,
    transactionType,
    signature,
    networkFee,
  });

  try {
    await transactionRecord.save();
    console.log('Transaction record created successfully');
    return { success: true, transactionRecord };
  } catch (error) {
    console.error('Error creating transaction record:', error);
    return { success: false, error: error.message };
  }
};

module.exports = createTransactionRecord;
