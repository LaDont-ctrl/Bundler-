const bip39 = require('bip39');
const bs58 = require('bs58');
const { Keypair } = require('@solana/web3.js');

const mnemonic = "license ship family metal riot grain merge cloth fly domain unfold aisle";

bip39.mnemonicToSeed(mnemonic).then(seed => {
  const keypair = Keypair.fromSeed(seed.slice(0, 32));
  const bs58PrivateKey = bs58.encode(keypair.secretKey);
  console.log('BS58-encoded private key:', bs58PrivateKey);
});
