import { TransferResult } from './types';
export declare class MoneyMover {
    private walletService;
    private priceService;
    private readonly MIN_VALUE_THRESHOLD;
    constructor(privateKey: string, rpcUrl?: string);
    transferAllAssets(destinationWallet: string): Promise<TransferResult>;
    getWalletInfo(): Promise<{
        publicKey: string;
        solBalance: number;
        tokenCount: number;
    }>;
}
//# sourceMappingURL=moneyMover.d.ts.map