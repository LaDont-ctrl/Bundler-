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
exports.MoneyMover = exports.CLI = void 0;
const readline = __importStar(require("readline"));
const moneyMover_1 = require("./moneyMover");
Object.defineProperty(exports, "MoneyMover", { enumerable: true, get: function () { return moneyMover_1.MoneyMover; } });
class CLI {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
    question(prompt) {
        return new Promise((resolve) => {
            this.rl.question(prompt, resolve);
        });
    }
    async run() {
        console.log('🚀 Solana Money Mover');
        console.log('Transfer all SOL and tokens worth >$5 to another wallet\n');
        try {
            const privateKey = await this.question('Enter your BS58 private key: ');
            if (!privateKey.trim()) {
                console.log('❌ Private key is required');
                return;
            }
            const destinationWallet = await this.question('Enter destination wallet address: ');
            if (!destinationWallet.trim()) {
                console.log('❌ Destination wallet is required');
                return;
            }
            const rpcUrl = await this.question('Enter RPC URL (press Enter for default): ');
            const finalRpcUrl = rpcUrl.trim() || 'https://rpc.helius.xyz/?api-key=YOUR_API_KEY';
            console.log('\n🔍 Initializing...');
            const moneyMover = new moneyMover_1.MoneyMover(privateKey, finalRpcUrl);
            const walletInfo = await moneyMover.getWalletInfo();
            console.log(`📊 Wallet: ${walletInfo.publicKey}`);
            console.log(`💰 SOL Balance: ${walletInfo.solBalance.toFixed(4)} SOL`);
            console.log(`🪙 Token Accounts: ${walletInfo.tokenCount}`);
            const confirm = await this.question('\n⚠️  This will transfer ALL assets worth >$5. Continue? (y/N): ');
            if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
                console.log('❌ Transfer cancelled');
                return;
            }
            console.log('\n🚀 Starting transfer...');
            const result = await moneyMover.transferAllAssets(destinationWallet);
            if (result.success) {
                console.log('\n✅ Transfer successful!');
                console.log(`📝 Transaction signature: ${result.signature}`);
                console.log(`💰 Total value transferred: $${result.totalValue.toFixed(2)}`);
                console.log(`📦 Items transferred: ${result.transferredItems.length}`);
                console.log("Explorer: https://solscan.io/tx/" + result.signature);
                for (const item of result.transferredItems) {
                    if (item.type === 'SOL') {
                        console.log(`  • ${item.amount.toFixed(4)} SOL ($${item.value.toFixed(2)})`);
                    }
                    else {
                        console.log(`  • ${item.amount} tokens (${item.mint}) - $${item.value.toFixed(2)}`);
                    }
                }
            }
            else {
                console.log('\n❌ Transfer failed!');
                console.log(`Error: ${result.error}`);
            }
        }
        catch (error) {
            console.error('\n💥 Unexpected error:', error);
        }
        finally {
            this.rl.close();
        }
    }
}
exports.CLI = CLI;
if (require.main === module) {
    const cli = new CLI();
    cli.run().catch(console.error);
}
//# sourceMappingURL=index.js.map