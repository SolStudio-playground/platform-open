const axios = require('axios');
const { Connection, PublicKey } = require('@solana/web3.js');
const Token = require('../models/Token');
const { checkAuthorities } = require('./checkAuthorities');

require('dotenv').config();

// const mongoose = require('mongoose');
// const TokenOrder = mongoose.model('TokenOrder', {});

async function getSupply(mintAddress) {

    try {
        const endpoint = process.env.HELIUS_URL;
        // const endpoint = process.env.HELIUS_URL_DEV;
        const connection = new Connection(endpoint);

        const tokenSupplyInfo = await connection.getTokenSupply(new PublicKey(mintAddress));
        return tokenSupplyInfo.value;
    } catch (error) {
        console.error("Error fetching token supply for mint address:", mintAddress, error);
        return null;
    }
}

async function fetchTokens(walletAddress, userId) {
    // console.log("Fetching tokens for wallet address:", walletAddress);
    const endpoint = process.env.HELIUS_URL;
    const axiosConfig = { headers: { "Content-Type": "application/json" } };
    const requestData = {
        jsonrpc: "2.0",
        id: 'my-id',
        method: "getAssetsByAuthority",
        params: {
            authorityAddress: walletAddress,
            page: 1, // Starts at 1
            limit: 1000
        },
    };
    const tokenIds = [];

    try {
        const response = await axios.post(endpoint, requestData, axiosConfig);
        console.log("response",response.data);
        // console.log("Response from Helius:", response.data);
        const connection = new Connection(endpoint);
        
        for (const asset of response.data.result.items) {
            // console.log(asset)
            const { id: tokenAddress } = asset;
            // First, check if the token already exists
            let token = await Token.findOne({ tokenAddress });
            const authorities = await checkAuthorities(connection, tokenAddress);
            if (!token) {
                const tokenSupply = await getSupply(tokenAddress);
                if (!tokenSupply) {
                    continue;
                }
                token = new Token({
                    tokenAddress,
                    program: 1,
                    programName: asset?.ownership?.ownership_model,
                    tokenName: asset.content?.metadata?.name,
                    tokenSymbol: asset.content?.metadata?.symbol,
                    tokenAddress: asset.id,
                    tokenPictureUrl: asset.content?.files[0]?.uri,
                    tokenSupply: tokenSupply.uiAmount || 0,
                    decimals: tokenSupply.decimals || 0,
                    metadata: {
                        name: asset.content?.metadata?.name,
                        symbol: asset.content?.metadata?.symbol,
                        uri: asset.content?.json_uri,
                    },
                    mutable: asset.mutable,
                    user: userId,
                    description: asset.content?.metadata?.description,
                    freezeAddress: authorities.hasFreezeAuthority,
                    mintAuthority: authorities.hasMintAuthority,
                    mintAccount: authorities.mintAuthority,
                    freezeAccount: authorities.freezeAccount,
                });

                await token.save();
            } else {
                // If the token exists, update its information except for the tokenSupply
                await Token.updateOne({ tokenAddress }, {
                    $set: {
                        program: 1,
                        programName: asset?.ownership?.ownership_model,
                        tokenName: asset.content?.metadata?.name,
                        tokenSymbol: asset.content?.metadata?.symbol,
                        tokenAddress: asset.id,
                        tokenPictureUrl: asset.content?.files[0]?.uri,
                        metadata: {
                            name: asset.content?.metadata?.name,
                            symbol: asset.content?.metadata?.symbol,
                            uri: asset.content?.json_uri,
                        },
                        mutable: asset.mutable,
                        user: userId,
                        description: asset.content?.metadata?.description,
                        freezeAddress: authorities.hasFreezeAuthority,
                        mintAuthority: authorities.hasMintAuthority,
                        mintAccount: authorities.mintAuthority,
                        freezeAccount: authorities.freezeAccount,

                    }
                });
            }

            tokenIds.push(token._id.toString());
        }

    } catch (error) {
        console.error("Error fetching assets with Axios:", error);
    }
    return tokenIds;
}



async function updateAllTokens() {
    const endpoint = process.env.HELIUS_URL;
    const connection = new Connection(endpoint);

    try {
        const tokens = await Token.find({});  // Fetch all tokens from your database
        for (const token of tokens) {
            const mintAddress = token.tokenAddress;
            const tokenSupplyInfo = await connection.getTokenSupply(new PublicKey(mintAddress));
            const authorities = await checkAuthorities(connection, mintAddress);

            if (tokenSupplyInfo) {
                await Token.updateOne({ _id: token._id }, {
                    $set: {
                        tokenSupply: tokenSupplyInfo.value.uiAmount || 0,
                        decimals: tokenSupplyInfo.value.decimals || 0,
                        freezeAddress: authorities.hasFreezeAuthority,
                        mintAuthority: authorities.hasMintAuthority,
                        mintAccount: authorities.mintAuthority,
                        freezeAccount: authorities.freezeAccount,
                    }
                });
                console.log(`Updated token ${token.tokenAddress}`);
            }
        }
    } catch (error) {
        console.error("Error updating tokens:", error);
    }
}


module.exports = { fetchTokens, updateAllTokens };