const express = require('express');
const { getMarketPrice, getMarketCap , getCoinImage } = require('../services/dexService');
const router = express.Router();

//Get market price
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

//Get market cap
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

//Get Coin Image
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


//Get all coin info
router.get('/full', async (req, res) => {
    try {
        const ca = req.query.address;
        const img = await getCoinImage(ca);
        const price = await getMarketPrice(ca);
        const market_cap = await getMarketCap(ca);

        res.json({ image : img,
                   price : price,
                   market_cap : market_cap
         });
    } catch (error) {
        console.error('Error fetching coin data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
