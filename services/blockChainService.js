const axios = require('axios');
const { Connection, PublicKey, clusterApiUrl } = require('@solana/web3.js');
const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';
const connection = new Connection(clusterApiUrl('mainnet-beta'));
const { getCoinAll, checkCoinListedDEX } = require('../services/dexService');


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


async function getWalletTokens(wallet) {
    console.log('getWallet HIT');
    const publicKey = new PublicKey(wallet);

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
    //Step One get a List of all the Tokens from the Wallet
    //This is Done via the Solana RPC API

    const solanaAPI_URL = 'https://api.mainnet-beta.solana.com';

    const body = {
        jsonrpc: "2.0",
        id: 1,
        method: "getTokenAccountsByOwner",
        params: [wallet, { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" }, { encoding: "jsonParsed" }]
    };

    try {
        const result = [];
        const response = await axios.post(solanaAPI_URL, body);

        if (response.data && response.data.result) {
            console.log('Success at getPortfolio');

            // Fetch token accounts
            const tokens = response.data.result.value;

            // Process tokens: filter out empty balances and extract relevant info
            const processedData = tokens
                .filter(item => item.account.data.parsed.info.tokenAmount.amount !== "0")
                .map(item => ({
                    mint: item.account.data.parsed.info.mint,
                    tokenAmount: item.account.data.parsed.info.tokenAmount.amount,
                    lamports: item.account.lamports,
                    pubkey: item.pubkey
                }));

            // Prepare parallel requests for faster End User Requests
            const tokenPromises = processedData.map(async (e) => {
                const ca = e.mint;

                // Check if the coin is listed on DexScreener
                const isListed = await checkCoinListedDEX(ca);

                //If the Coins is On Dex Screener we then use there API for more INFO on the coin
                if (isListed) {

                    // This Method is from dexService.js
                    const data = await getCoinAll(ca);

                   //WE then Combine Data from Solana and DEX API into one JSON
                    if (data && data.coin_img && data.price && data.market_cap) {
                        return {

                            //These values are from DEX API
                            name: data.name,
                            img: data.coin_img,
                            price: data.price,
                            mc: data.market_cap,

                            //These values are from Solana API
                            ca: ca,
                            qty: e.tokenAmount

                        };
                    }
                }
                return null; // Return null for unlisted coins
            });

            // Resolve all token promises in parallel
            const resolvedTokens = await Promise.all(tokenPromises);

            // Filter out null results
            result.push(...resolvedTokens.filter(item => item !== null));

            console.log(result);
            return result;
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
async function getWalletBalance(wallet) {
    const publicKey = new PublicKey(wallet);
    const balance = await connection.getBalance(publicKey);
    return balance / 1e9; // Convert lamports to SOL
}

module.exports = { getTokenData, getWalletBalance, getWalletTokens, getPortfolio };