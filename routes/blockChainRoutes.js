const express = require('express');
const { getTokenData , getWalletBalance } = require('../services/blockChainService');
const router = express.Router();


// Get wallet balance

router.get('/balance', async (req, res) => {
    console.log('Balance route hit'); // This should log when you hit the route
    const walletAddress = req.query.address;
    console.log('Wallet Address:', walletAddress);

    if (!walletAddress) {
        return res.status(400).send({ error: 'Wallet address is required' });
    }

    try {
        const balance = await getWalletBalance(walletAddress);
        res.json({
            wallet: walletAddress,
            balance,
        });
    } catch (error) {
        console.error('Error fetching balance:', error);
        res.status(500).send({ error: 'Server error' });
    }
});


// Fetch token data
router.get('/:ca', async (req, res) => {
 
    const contractAddress = req.params.ca;

    try {
        const tokenData = await getTokenData(contractAddress);
        res.json({
            success: true,
            tokenData,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});


module.exports = router;
