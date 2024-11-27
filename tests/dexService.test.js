const axios = require('axios');
const { getMarketPrice, getMarketCap, getCoinImage } = require('../services/dexService');

jest.mock('axios');

describe('getCoinImage', () => {
    it('should return the image URL for a valid token address', async () => {
        const contractAddress = '0x123';
        const imageUrl = 'https://example.com/image.png';
        const mockResponse = {
            data: {
                pairs: [
                    {
                        baseToken: { address: contractAddress },
                        info: { imageUrl }
                    }
                ]
            }
        };

        axios.get.mockResolvedValue(mockResponse);

        const result = await getCoinImage(contractAddress);
        expect(result).toBe(imageUrl);
    });

    it('should throw an error if the token address is not found', async () => {
        const contractAddress = '0x123';
        const mockResponse = {
            data: {
                pairs: []
            }
        };

        axios.get.mockResolvedValue(mockResponse);

        await expect(getCoinImage(contractAddress)).rejects.toThrow(`Data not found for token address: ${contractAddress} at URL: https://api.dexscreener.com/latest/dex/tokens/${contractAddress}`);
    });

    it('should throw an error if the image URL is not found', async () => {
        const contractAddress = '0x123';
        const mockResponse = {
            data: {
                pairs: [
                    {
                        baseToken: { address: contractAddress },
                        info: {}
                    }
                ]
            }
        };

        axios.get.mockResolvedValue(mockResponse);

        await expect(getCoinImage(contractAddress)).rejects.toThrow(`Image not found for token address: ${contractAddress}`);
    });

    jest.mock('axios');

    describe('dexService', () => {
        describe('getMarketPrice', () => {
            it('should return the market price for a valid token address', async () => {
                const contractAddress = '0x123';
                const priceUsd = '100.00';
                const mockResponse = {
                    data: {
                        pairs: [
                            {
                                baseToken: { address: contractAddress },
                                priceUsd
                            }
                        ]
                    }
                };

                axios.get.mockResolvedValue(mockResponse);

                const result = await getMarketPrice(contractAddress);
                expect(result).toBe(priceUsd);
            });

            it('should throw an error if the price is not found', async () => {
                const contractAddress = '0x123';
                const mockResponse = {
                    data: {
                        pairs: [
                            {
                                baseToken: { address: contractAddress }
                            }
                        ]
                    }
                };

                axios.get.mockResolvedValue(mockResponse);

                await expect(getMarketPrice(contractAddress)).rejects.toThrow(`Price not found for token address: ${contractAddress}`);
            });

            it('should throw an error if the token address is not found', async () => {
                const contractAddress = '0x123';
                const mockResponse = {
                    data: {
                        pairs: []
                    }
                };

                axios.get.mockResolvedValue(mockResponse);

                await expect(getMarketPrice(contractAddress)).rejects.toThrow(`Data not found for token address: ${contractAddress} at URL: https://api.dexscreener.com/latest/dex/tokens/${contractAddress}`);
            });
        });

        describe('getMarketCap', () => {
            it('should return the market cap for a valid token address', async () => {
                const contractAddress = '0x123';
                const marketCap = '1000000';
                const mockResponse = {
                    data: {
                        pairs: [
                            {
                                baseToken: { address: contractAddress },
                                marketCap
                            }
                        ]
                    }
                };

                axios.get.mockResolvedValue(mockResponse);

                const result = await getMarketCap(contractAddress);
                expect(result).toBe(marketCap);
            });

            it('should throw an error if the market cap is not found', async () => {
                const contractAddress = '0x123';
                const mockResponse = {
                    data: {
                        pairs: [
                            {
                                baseToken: { address: contractAddress }
                            }
                        ]
                    }
                };

                axios.get.mockResolvedValue(mockResponse);

                await expect(getMarketCap(contractAddress)).rejects.toThrow(`Market cap not found for token address: ${contractAddress}`);
            });

            it('should throw an error if the token address is not found', async () => {
                const contractAddress = '0x123';
                const mockResponse = {
                    data: {
                        pairs: []
                    }
                };

                axios.get.mockResolvedValue(mockResponse);

                await expect(getMarketCap(contractAddress)).rejects.toThrow(`Data not found for token address: ${contractAddress} at URL: https://api.dexscreener.com/latest/dex/tokens/${contractAddress}`);
            });
        });

        describe('getCoinImage', () => {
            it('should return the image URL for a valid token address', async () => {
                const contractAddress = '0x123';
                const imageUrl = 'https://example.com/image.png';
                const mockResponse = {
                    data: {
                        pairs: [
                            {
                                baseToken: { address: contractAddress },
                                info: { imageUrl }
                            }
                        ]
                    }
                };

                axios.get.mockResolvedValue(mockResponse);

                const result = await getCoinImage(contractAddress);
                expect(result).toBe(imageUrl);
            });

            it('should throw an error if the token address is not found', async () => {
                const contractAddress = '0x123';
                const mockResponse = {
                    data: {
                        pairs: []
                    }
                };

                axios.get.mockResolvedValue(mockResponse);

                await expect(getCoinImage(contractAddress)).rejects.toThrow(`Data not found for token address: ${contractAddress} at URL: https://api.dexscreener.com/latest/dex/tokens/${contractAddress}`);
            });

            it('should throw an error if the image URL is not found', async () => {
                const contractAddress = '0x123';
                const mockResponse = {
                    data: {
                        pairs: [
                            {
                                baseToken: { address: contractAddress },
                                info: {}
                            }
                        ]
                    }
                };

                axios.get.mockResolvedValue(mockResponse);

                await expect(getCoinImage(contractAddress)).rejects.toThrow(`Image not found for token address: ${contractAddress}`);
            });
        });
    });
});