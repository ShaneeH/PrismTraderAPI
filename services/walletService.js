const { Connection, PublicKey, clusterApiUrl } = require('@solana/web3.js');

const connection = new Connection(clusterApiUrl('mainnet-beta'));

// Get wallet balance
async function getWalletBalance(walletAddress) {
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    return balance / 1e9; // Convert lamports to SOL
}

module.exports = { getWalletBalance };
