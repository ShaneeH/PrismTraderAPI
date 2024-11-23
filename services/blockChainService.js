const axios = require('axios');
const { Connection, PublicKey, clusterApiUrl } = require('@solana/web3.js');
const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';
const connection = new Connection(clusterApiUrl('mainnet-beta'));

// Fetch token data from Solana Blockchain
async function getTokenData(contractAddress) {
    const payload = {
        jsonrpc: '2.0',
        id: 1,
        method: 'getAccountInfo',
        params: [
            contractAddress,
            { encoding: 'jsonParsed' },
        ],
    };

    try {
        const response = await axios.post(SOLANA_RPC_URL, payload);
        if (response.data && response.data.result) {
            return response.data.result;
        } else {
            throw new Error('No data found for the given contract address.');
        }
    } catch (error) {
        console.error(`Error fetching token data: ${error.message}`);
        throw error;
    }
}

async function getWalletBalance(walletAddress) {
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    return balance / 1e9; // Convert lamports to SOL
}


module.exports = { getTokenData, getWalletBalance };