const express = require('express');
const { getMarketPrice, getMarketCap , getCoinImage, getCoinAll} = require('../services/dexService');
const router = express.Router();

//These are the Routes that Send Requests to the DexScreener API

//Get the Market Price in USD for a Coin
router.get('/price', async (req, res) => {
    try {
        const ca = req.query.address;
        const price = await getMarketPrice(ca);

        res.json({ price_usd: price });
    } catch (error) {
        console.error('Error fetching market price:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Get the Market Cap in USD for a Coin
router.get('/mc', async (req, res) => {
    try {
        const ca = req.query.address;
        const price = await getMarketCap(ca);

        res.json({ market_cap: price });
    } catch (error) {
        console.error('Error fetching market cap:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Get the Image for a Coin 
router.get('/img', async (req, res) => {
    try {
        const ca = req.query.address;
        const img = await getCoinImage(ca);

        res.json({ image : img });
    } catch (error) {
        console.error('Error fetching coin image:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET ALL THE COIN DATA
router.get('/all', async (req, res) => {
    try {
        const { address } = req.query;

        if (!address) {
            return res.status(400).json({ error: 'Address is required' });
        }

        const coinData = await getCoinAll(address);

        return res.status(200).json(coinData);

    } catch (error) {
        console.error('Error fetching coin data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
