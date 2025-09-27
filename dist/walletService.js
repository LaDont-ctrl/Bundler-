"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const bs58 = __importStar(require("bs58"));
class WalletService {
    constructor(privateKey, rpcUrl = 'https://rpc.helius.xyz/?api-key=YOUR_API_KEY') {
        this.connection = new web3_js_1.Connection(rpcUrl, 'confirmed');
        const privateKeyBytes = bs58.decode(privateKey);
        this.wallet = web3_js_1.Keypair.fromSecretKey(privateKeyBytes);
    }
    getWalletPublicKey() {
        return this.wallet.publicKey;
    }
    async getSOLBalance() {
        const balance = await this.connection.getBalance(this.wallet.publicKey);
        return balance / web3_js_1.LAMPORTS_PER_SOL;
    }
    async getTokenAccounts() {
        const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(this.wallet.publicKey, { programId: spl_token_1.TOKEN_PROGRAM_ID });
        const tokens = [];
        for (const account of tokenAccounts.value) {
            const accountInfo = account.account.data.parsed.info;
            const mint = accountInfo.mint;
            const balance = accountInfo.tokenAmount.uiAmount;
            const decimals = accountInfo.tokenAmount.decimals;
            if (balance > 0) {
                tokens.push({
                    mint,
                    symbol: '',
                    name: '',
                    decimals,
                    price: 0,
                    value: 0,
                    balance: balance.toString()
                });
            }
        }
        return tokens;
    }
    async estimateTransactionFee(instructionCount = 1, newAccountsCount = 0) {
        const baseFee = 5000;
        const instructionFee = 5000;
        const rentExemption = 2039280;
        const totalLamports = baseFee + (instructionCount * instructionFee) + (newAccountsCount * rentExemption);
        return totalLamports / web3_js_1.LAMPORTS_PER_SOL;
    }
    async createTransferTransaction(destinationWallet, solAmount, tokenTransfers) {
        const transaction = new web3_js_1.Transaction();
        if (solAmount > 0) {
            transaction.add(web3_js_1.SystemProgram.transfer({
                fromPubkey: this.wallet.publicKey,
                toPubkey: destinationWallet,
                lamports: Math.floor(solAmount * web3_js_1.LAMPORTS_PER_SOL)
            }));
        }
        for (const tokenTransfer of tokenTransfers) {
            const destinationTokenAccount = await (0, spl_token_1.getAssociatedTokenAddress)(new web3_js_1.PublicKey(tokenTransfer.mint), destinationWallet);
            let needsNewAccount = true;
            try {
                await (0, spl_token_1.getAccount)(this.connection, destinationTokenAccount);
                needsNewAccount = false;
            }
            catch {
                needsNewAccount = true;
            }
            if (needsNewAccount) {
                transaction.add((0, spl_token_1.createAssociatedTokenAccountInstruction)(this.wallet.publicKey, destinationTokenAccount, destinationWallet, new web3_js_1.PublicKey(tokenTransfer.mint)));
            }
            transaction.add((0, spl_token_1.createTransferInstruction)(tokenTransfer.sourceAccount, destinationTokenAccount, this.wallet.publicKey, Math.floor(tokenTransfer.amount * Math.pow(10, tokenTransfer.decimals)) // Convert to smallest unit using correct decimals
            ));
        }
        return transaction;
    }
    async sendTransaction(transaction) {
        const latestBlockhash = await this.connection.getLatestBlockhash();
        transaction.recentBlockhash = latestBlockhash.blockhash;
        transaction.feePayer = this.wallet.publicKey;
        const signature = await (0, web3_js_1.sendAndConfirmTransaction)(this.connection, transaction, [this.wallet]);
        return signature;
    }
    async getTokenAccountAddress(mint) {
        return await (0, spl_token_1.getAssociatedTokenAddress)(new web3_js_1.PublicKey(mint), this.wallet.publicKey);
    }
}
exports.WalletService = WalletService;
//# sourceMappingURL=walletService.js.map