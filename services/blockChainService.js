const axios = require('axios');
const { Connection, PublicKey, clusterApiUrl } = require('@solana/web3.js');
const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';
const connection = new Connection(clusterApiUrl('mainnet-beta'));
//import Moralis from 'moralis';
const Moralis = require("moralis");
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


async function getWalletTokens(walletAddress) {
    console.log('getWallet HIT');
    const publicKey = new PublicKey(walletAddress);

    try {
        // Fetch all token accounts owned by the user
        const tokenAccounts = await connection.getTokenAccountsByOwner(publicKey, {
            programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") // Token Program ID
        });

        // Check if there are no token accounts
        if (tokenAccounts.value.length === 0) {
            console.log("No token accounts found for this wallet.");
            return []; // Return an empty array if no token accounts found
        }

        // Map over the accounts and extract token details
        const tokens = tokenAccounts.value.map(({ pubkey, account }) => {
            const data = account.data;
            if (!data.parsed || !data.parsed.info) {
                console.log('Data or parsed info is missing for account:', pubkey.toString());
                return null; // Skip this account if data is missing
            }

            const mint = data.parsed.info.mint; // Mint address
            const amount = data.parsed.info.tokenAmount.amount; // Raw balance (smallest unit)
            const decimals = data.parsed.info.tokenAmount.decimals; // Decimals for token

            const balance = parseFloat(amount) / Math.pow(10, decimals);

            return {
                tokenAccount: pubkey.toString(), // Token account address
                mint, // Mint address of the token
                balance, // Human-readable balance
                decimals, // Decimals for the token
            };
        }).filter(token => token !== null); // Filter out null values

        console.log("Tokens in Wallet:", tokens);
        return tokens;
    } catch (error) {
        console.error("Error fetching tokens:", error);
    }
}





async function getPortfolio(wallet) {
    const solanaAPI_URL = 'https://api.mainnet-beta.solana.com';

    const body = {
        jsonrpc: "2.0",
        id: 1,
        method: "getTokenAccountsByOwner",
        params: [
            wallet,
            {
                programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            },
            {
                encoding: "jsonParsed"
            }
        ]
    };

    try {
        const response = await axios.post(solanaAPI_URL, body);

        if (response.data && response.data.result) {
            console.log('Success at getPortfolio');
            
            // Fetch token names and additional details
            const tokens = response.data.result.value;

            //Get all the Tokens from that Wallet that are not null
            const processedData = tokens
            .filter(item => item.account.data.parsed.info.tokenAmount.amount !== "0")
            .map(item => ({
              mint: item.account.data.parsed.info.mint,
              tokenAmount: item.account.data.parsed.info.tokenAmount.amount,
              lamports: item.account.lamports,
              pubkey: item.pubkey
            }));
            
            return processedData;

        } else {
            console.error('No token accounts found');
            return [];
        }
    } catch (error) {
        console.error('Error with getPortfolio:', error);
        return [];
    }
}






//Fetch the Wallet Balance of a Wallet
async function getWalletBalance(walletAddress) {
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    return balance / 1e9; // Convert lamports to SOL
}




module.exports = { getTokenData, getWalletBalance, getWalletTokens,  getPortfolio };