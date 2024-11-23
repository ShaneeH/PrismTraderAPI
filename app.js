// This is the Servers Entry Point
const express = require('express');
const cors = require('cors');
const blockChainRoutes = require('./routes/blockChainRoutes');
const dexRoutes = require('./routes/dexRoutes');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/blockChain', blockChainRoutes);
app.use('/dex', dexRoutes);

// Test the server online
app.get('/online', (req, res) => {
    const uptimeInSeconds = process.uptime();
    const uptimeInHours = (uptimeInSeconds / 3600).toFixed(2);
    res.send({
        hello: 'Express Server running online',
        uptime: `${uptimeInHours} hours`,
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});