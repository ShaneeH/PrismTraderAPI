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

async function fetchTokenData(ca) {
    const url = `${DEX_URL}${ca}`;
    const response = await axios.get(url);
    const pair = response.data?.pairs?.find(pair => pair.baseToken.address === ca);


    if (!pair) {
        //throw new Error(`Data not found for token address: ${ca} at URL: ${url}`);
        console.log(ca , ' This pair not listed on DEX API');
    }

    return pair;
}

// Get market price
async function getMarketPrice(ca) {
    const pair = await fetchTokenData(ca);

    if (!pair.priceUsd) {
        throw new Error(`Price not found for token address: ${ca}`);
    }

    return pair.priceUsd;
}

// Get market cap
async function getMarketCap(ca) {
    const pair = await fetchTokenData(ca);

    if (!pair?.marketCap) {
        return { 
          message: "Pair may not be listed on DEX API",
          ca
        }};

    return pair.marketCap;
}

// Get coin image
async function getCoinImage(ca) {
    const pair = await fetchTokenData(ca);

    if (!pair.info || !pair.info.imageUrl) {
        throw new Error(`Image not found for token address: ${ca}`);
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
        
        if (res.name.length > 16) {
            let newString = res.name.substring(0, 16); // Take the first 16 characters
            res.name = newString; // Assign the truncated string back to res.name
        }
        
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
