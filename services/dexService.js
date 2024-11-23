const axios = require('axios');

const DEX_URL = 'https://api.dexscreener.com/latest/dex/tokens/';

// Helper Function used in my getFunction to fetch and parse the pair data
// The API response from DEX is quite messy, and this function helps get the pair we want.

async function fetchTokenData(contractAddress) {
    const url = `${DEX_URL}${contractAddress}`;
    const response = await axios.get(url);
    const pair = response.data.pairs.find(pair => pair.baseToken.address === contractAddress);

    if (!pair) {
        throw new Error(`Data not found for token address: ${contractAddress} at URL: ${url}`);
    }

    return pair;
}

// Get market price
async function getMarketPrice(contractAddress) {
    const pair = await fetchTokenData(contractAddress);

    if (!pair.priceUsd) {
        throw new Error(`Price not found for token address: ${contractAddress}`);
    }

    return pair.priceUsd;
}

// Get market cap
async function getMarketCap(contractAddress) {
    const pair = await fetchTokenData(contractAddress);

    if (!pair.marketCap) {
        throw new Error(`Market cap not found for token address: ${contractAddress}`);
    }

    return pair.marketCap;
}

// Get coin image
async function getCoinImage(contractAddress) {
    const pair = await fetchTokenData(contractAddress);

    if (!pair.info || !pair.info.imageUrl) {
        throw new Error(`Image not found for token address: ${contractAddress}`);
    }

    return pair.info.imageUrl;
}

module.exports = { getMarketPrice, getMarketCap, getCoinImage };
