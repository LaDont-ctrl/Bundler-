export declare class PriceService {
    private static instance;
    private priceCache;
    private readonly CACHE_DURATION;
    private constructor();
    static getInstance(): PriceService;
    getTokenPrice(mint: string): Promise<number>;
    getSOLPrice(): Promise<number>;
}
//# sourceMappingURL=priceService.d.ts.map