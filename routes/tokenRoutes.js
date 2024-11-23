const express = require('express');
const { getTokenData } = require('../services/tokenService');
const router = express.Router();

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
