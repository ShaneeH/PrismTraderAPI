const axios = require('axios');

const DEX_URL = 'https://api.dexscreener.com/latest/dex/tokens/';

async function checkCoinListedDEX(ca) {
    const url = `${DEX_URL}${ca}`;
    const response = await axios.get(url);
    const pair = response.data?.pairs?.find(pair => pair.baseToken.address === ca);


    if (!pair) {
        
        return false;
    }

    return true;
}

// Helper Function used in my getFunction to fetch and parse the pair data
// The API response from DEX is quite messy, and this function helps get the pair we want.

async function fetchTokenData(contractAddress) {
    const url = `${DEX_URL}${contractAddress}`;
    const response = await axios.get(url);
    const pair = response.data?.pairs?.find(pair => pair.baseToken.address === contractAddress);


    if (!pair) {
        //throw new Error(`Data not found for token address: ${contractAddress} at URL: ${url}`);
        console.log(contractAddress , ' This pair not listed on DEX API');
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

    if (!pair?.marketCap) {
        return { 
          message: "Pair may not be listed on DEX API",
          contractAddress
        }};

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

async function getCoinAll(ca) {
    try {
        // Fetch token data
        const pair = await fetchTokenData(ca);

        // Ensure pair and pair.info exist before accessing properties
        if (!pair || !pair.info || !pair.info.imageUrl) {
            return {
                'msg': `${ca} - Coin may not be listed on DEX`
            };
        }

        // Return the necessary information if all checks pass
        let res = {
            'name' : pair.baseToken.name,
            'coin_img': pair.info.imageUrl,
            'price': pair.priceUsd,
            'market_cap': pair.marketCap
        };

        return res;

    } catch (error) {
        // Handle errors, such as network issues or unexpected results
        console.error(`Error fetching coin data for ${ca}:`, error);
        return {
            'msg': `Error fetching data for ${ca}`
        };
    }
}


module.exports = { fetchTokenData, getMarketPrice, getMarketCap, getCoinImage, getCoinAll , checkCoinListedDEX};
