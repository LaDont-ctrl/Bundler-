"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoneyMover = void 0;
const web3_js_1 = require("@solana/web3.js");
const walletService_1 = require("./walletService");
const priceService_1 = require("./priceService");
class MoneyMover {
    constructor(privateKey, rpcUrl) {
        this.MIN_VALUE_THRESHOLD = 5; // $5 minimum value
        this.walletService = new walletService_1.WalletService(privateKey, rpcUrl);
        this.priceService = priceService_1.PriceService.getInstance();
    }
    async transferAllAssets(destinationWallet) {
        try {
            console.log('Starting asset transfer process...');
            const destinationPubkey = new web3_js_1.PublicKey(destinationWallet);
            const solBalance = await this.walletService.getSOLBalance();
            console.log(`Current SOL balance: ${solBalance} SOL`);
            const tokenAccounts = await this.walletService.getTokenAccounts();
            console.log(`Found ${tokenAccounts.length} token accounts`);
            const solPrice = await this.priceService.getSOLPrice();
            console.log(`Current SOL price: $${solPrice}`);
            const solValue = solBalance * solPrice;
            console.log(`SOL value: $${solValue.toFixed(2)}`);
            const processedTokens = [];
            for (const token of tokenAccounts) {
                const price = await this.priceService.getTokenPrice(token.mint);
                const value = parseFloat(token.balance) * price;
                processedTokens.push({
                    ...token,
                    price,
                    value
                });
                console.log(`Token ${token.mint}: ${token.balance} tokens = $${value.toFixed(2)}`);
            }
            const valuableTokens = processedTokens.filter(token => token.value >= this.MIN_VALUE_THRESHOLD);
            let shouldTransferSOL = solValue >= this.MIN_VALUE_THRESHOLD;
            console.log(`Found ${valuableTokens.length} tokens worth >= $${this.MIN_VALUE_THRESHOLD}`);
            console.log(`SOL transfer needed: ${shouldTransferSOL}`);
            if (valuableTokens.length === 0 && !shouldTransferSOL) {
                return {
                    success: false,
                    error: 'No assets found worth more than $5',
                    transferredItems: [],
                    totalValue: 0
                };
            }
            const totalInstructions = valuableTokens.length * 2 + (shouldTransferSOL ? 1 : 0);
            const newAccountsCount = valuableTokens.length;
            const estimatedFee = await this.walletService.estimateTransactionFee(totalInstructions, newAccountsCount);
            console.log(`Estimated transaction fee: ${estimatedFee} SOL (${totalInstructions} instructions, ${newAccountsCount} new accounts)`);
            let finalSolAmount = 0;
            const feeReserve = estimatedFee * 1.2;
            if (shouldTransferSOL) {
                finalSolAmount = Math.max(0, solBalance - feeReserve);
            }
            if (solBalance < feeReserve) {
                return {
                    success: false,
                    error: `Insufficient SOL to cover transaction fees and rent exemption. Need at least ${feeReserve.toFixed(6)} SOL, have ${solBalance.toFixed(6)} SOL`,
                    transferredItems: [],
                    totalValue: 0
                };
            }
            if (solBalance < feeReserve + 0.001) {
                console.log('Warning: Very low SOL balance. Only transferring tokens, not SOL.');
                shouldTransferSOL = false;
                finalSolAmount = 0;
            }
            const tokenTransfers = [];
            const transferredItems = [];
            for (const token of valuableTokens) {
                const sourceAccount = await this.walletService.getTokenAccountAddress(token.mint);
                tokenTransfers.push({
                    mint: token.mint,
                    amount: parseFloat(token.balance),
                    sourceAccount,
                    decimals: token.decimals
                });
                transferredItems.push({
                    type: 'TOKEN',
                    amount: parseFloat(token.balance),
                    mint: token.mint,
                    value: token.value
                });
            }
            if (shouldTransferSOL && finalSolAmount > 0) {
                transferredItems.push({
                    type: 'SOL',
                    amount: finalSolAmount,
                    value: finalSolAmount * solPrice
                });
            }
            const transaction = await this.walletService.createTransferTransaction(destinationPubkey, finalSolAmount, tokenTransfers);
            console.log('Sending transaction...');
            const signature = await this.walletService.sendTransaction(transaction);
            const totalValue = transferredItems.reduce((sum, item) => sum + item.value, 0);
            console.log(`Transaction successful! Signature: ${signature}`);
            console.log(`Total value transferred: $${totalValue.toFixed(2)}`);
            return {
                success: true,
                signature,
                transferredItems,
                totalValue
            };
        }
        catch (error) {
            console.error('Transfer failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                transferredItems: [],
                totalValue: 0
            };
        }
    }
    async getWalletInfo() {
        const publicKey = this.walletService.getWalletPublicKey().toString();
        const solBalance = await this.walletService.getSOLBalance();
        const tokenAccounts = await this.walletService.getTokenAccounts();
        return {
            publicKey,
            solBalance,
            tokenCount: tokenAccounts.length
        };
    }
}
exports.MoneyMover = MoneyMover;
//# sourceMappingURL=moneyMover.js.map