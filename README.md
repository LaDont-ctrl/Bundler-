# Solana Wallet Drainer

⚠️ **LEGAL DISCLAIMER: This tool is for LEGITIMATE purposes only. Do NOT use for malicious activities, theft, or unauthorized access to wallets. Only use with wallets you own or have explicit permission to access.**

A TypeScript program that transfers all SOL and SPL tokens worth more than $5 from one wallet to another in a single transaction. Designed for legitimate wallet consolidation, migration, or emergency fund transfers.

## 🚨 **IMPORTANT WARNINGS**

- **ONLY use with wallets you OWN**
- **NEVER use for theft or unauthorized access**
- **Always verify destination addresses**
- **Test with small amounts first**
- **This tool is for legitimate purposes only**

## Features

- 🔄 **Single Transaction**: Transfers all assets in one transaction
- 💰 **Value Filtering**: Only transfers tokens worth more than $5
- ⚡ **Fee Management**: Automatically accounts for transaction fees
- 🛡️ **Error Prevention**: Prevents insufficient balance errors
- 🔑 **BS58 Support**: Accepts private keys in BS58 format
- 📊 **Price Integration**: Fetches real-time token prices from free APIs
- 🎯 **Token Support**: Handles all SPL tokens

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd solana-money-mover
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Usage

### Command Line Interface

Run the program:
```bash
npm start
```

Or run directly with TypeScript:
```bash
npm run dev
```

### Programmatic Usage

```typescript
import { MoneyMover } from './src/moneyMover';

const moneyMover = new MoneyMover(privateKey, rpcUrl);
const result = await moneyMover.transferAllAssets(destinationWallet);

if (result.success) {
  console.log(`Transfer successful! Signature: ${result.signature}`);
  console.log(`Total value transferred: $${result.totalValue}`);
} else {
  console.log(`Transfer failed: ${result.error}`);
}
```

## Input Requirements

### Private Key Format
The program expects a **BS58-encoded private key**. You can convert your private key to BS58 format using:

```javascript
const bs58 = require('bs58');
const privateKeyBytes = [/* your private key bytes */];
const bs58PrivateKey = bs58.encode(privateKeyBytes);
```

### Destination Wallet
Provide a valid Solana wallet address (public key) where you want to transfer the assets.

## How It Works

1. **Wallet Analysis**: Scans the source wallet for all SOL and SPL tokens
2. **Price Fetching**: Gets current prices from free APIs (CoinGecko, Binance, DexScreener)
3. **Value Calculation**: Calculates USD value of each asset
4. **Filtering**: Identifies assets worth more than $5
5. **Fee Estimation**: Estimates transaction fees and reserves SOL for fees
6. **Transaction Building**: Creates a single transaction with all transfers
7. **Execution**: Sends the transaction to the Solana network

## Safety Features

- ✅ **Fee Reservation**: Automatically reserves SOL for transaction fees
- ✅ **Value Threshold**: Only transfers assets worth more than $5
- ✅ **Error Handling**: Comprehensive error handling and validation
- ✅ **Confirmation**: CLI asks for confirmation before executing transfers
- ✅ **Transaction Signing**: Proper transaction signing and verification

## Configuration

### RPC Endpoints
- **Default**: `https://rpc.helius.xyz/?api-key=YOUR_API_KEY` (Helius RPC)
- **Custom**: You can specify any Solana RPC endpoint
- **Recommended**: Use Helius for better performance and reliability

### Value Threshold
The minimum value threshold is set to $5 by default. You can modify this in the `MoneyMover` class.

## Error Handling

The program handles various error scenarios:
- Insufficient SOL for fees
- Invalid wallet addresses
- Network connectivity issues
- Token account creation failures
- Transaction failures

## Security Considerations

⚠️ **CRITICAL SECURITY NOTES**:
- **NEVER share your private key**
- **ONLY use with wallets you own**
- **Test with small amounts first**
- **Use a dedicated wallet for transfers**
- **Verify destination addresses carefully**
- **Keep your private key secure**
- **This tool is for legitimate purposes only**

## Legal and Ethical Use

This tool is designed for legitimate purposes such as:
- ✅ Wallet consolidation
- ✅ Emergency fund transfers
- ✅ Account migration
- ✅ Legitimate business operations
- ✅ Personal wallet management

**FORBIDDEN USES:**
- ❌ Unauthorized access to wallets
- ❌ Theft or fraud
- ❌ Malicious activities
- ❌ Accessing others' private keys
- ❌ Any illegal activities

## Dependencies

- `@solana/web3.js`: Solana Web3 library
- `@solana/spl-token`: SPL token program interactions
- `axios`: HTTP client for price API calls
- `bs58`: Base58 encoding/decoding
- `typescript`: TypeScript compiler

## Development

### Building
```bash
npm run build
```

### Running Tests
```bash
npm test
```

### Type Checking
```bash
npx tsc --noEmit
```

## License

MIT License - see LICENSE file for details.

## Disclaimer

This software is provided "as is" without warranty. Use at your own risk. 

**LEGAL NOTICE**: This tool is for legitimate purposes only. Users are responsible for ensuring they have proper authorization to access any wallets they use with this tool. The developers are not responsible for any misuse of this software.

**Always test with small amounts before using with significant funds.** 