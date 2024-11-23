const express = require('express');
const { getWalletBalance } = require('../services/walletService');
const router = express.Router();

// Get wallet balance
router.get('/balance', async (req, res) => {
    try {
        const walletAddress = req.query.address;

        if (!walletAddress) {
            return res.status(400).send({ error: 'Wallet address is required' });
        }

        const balance = await getWalletBalance(walletAddress);

        res.json({
            wallet: walletAddress,
            balance,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Server error' });
    }
});

module.exports = router;
