function parseBalance(balance, decimals) {
    return Math.floor(parseFloat(balance) * Math.pow(10, decimals));
}



module.exports = {
    parseBalance
};