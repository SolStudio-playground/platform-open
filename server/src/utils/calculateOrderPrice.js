const { getMinimumBalanceForRentExemptMint } = require('@solana/spl-token');


async function calculateOrderValue(connection, orderType) {
    const lamportsForRentExemption = await getMinimumBalanceForRentExemptMint(connection);
    
    let multiplier;
    switch (orderType) {
        case 'tokenCreation':
            multiplier = 10; // For token creation, multiply the rent-exempt fee by 10.
            break;
        case 'service':
            multiplier = 2; // Assume a different multiplier for service orders for illustration.
            break;
        default:
            throw new Error('Unsupported order type');
    }

    const orderValue = lamportsForRentExemption * multiplier;
    return orderValue;
}


async function calculateTokenOrderPrice(orderDetails) {
    // Example calculation based on tokenSupply and a fixed rate
    // You might need to fetch additional data from your database here
    const fixedRatePerToken = 0.01; // Example fixed rate per token
    const price = orderDetails.tokenSupply * fixedRatePerToken;
    return price;
}

async function calculateNFTOrderPrice(calculateOrderValue) {
    // Example calculation for NFTOrder
    // This is purely illustrative; adjust according to your business logic
    const basePrice = 100; // Base price for any NFT order
    const premiumMultiplier = orderDetails.isPremium ? 1.5 : 1; // Premium orders cost more
    const price = basePrice * premiumMultiplier;
    return price;
}


module.exports = { calculateOrderValue };