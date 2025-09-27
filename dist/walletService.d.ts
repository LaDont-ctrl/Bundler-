import { PublicKey, Transaction } from '@solana/web3.js';
import { TokenInfo } from './types';
export declare class WalletService {
    private connection;
    private wallet;
    constructor(privateKey: string, rpcUrl?: string);
    getWalletPublicKey(): PublicKey;
    getSOLBalance(): Promise<number>;
    getTokenAccounts(): Promise<TokenInfo[]>;
    estimateTransactionFee(instructionCount?: number, newAccountsCount?: number): Promise<number>;
    createTransferTransaction(destinationWallet: PublicKey, solAmount: number, tokenTransfers: Array<{
        mint: string;
        amount: number;
        sourceAccount: PublicKey;
        decimals: number;
    }>): Promise<Transaction>;
    sendTransaction(transaction: Transaction): Promise<string>;
    getTokenAccountAddress(mint: string): Promise<PublicKey>;
}
//# sourceMappingURL=walletService.d.ts.map