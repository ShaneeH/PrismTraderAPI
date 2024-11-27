const express = require('express');
const { PublicKey } = require('@solana/web3.js'); 
const { getTokenData , getWalletBalance , getWalletTokens, getWalletPortfolio, getPortfolio, getPortfolio2 } = require('../services/blockChainService');
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


router.post('/portfolio', async (req, res) => {
    const { wallet } = req.body; // Expecting the wallet address in the body of the request

    if (!wallet) {
        return res.status(400).json({ error: 'Wallet address is required' });
    }

    const portfolio = await getPortfolio(wallet);

    if (portfolio.length > 0) {
        res.status(200).json(portfolio); // Send back the portfolio data
    } else {
        res.status(404).json({ error: 'No token accounts found for this wallet' });
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
