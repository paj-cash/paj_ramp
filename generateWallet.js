import { Keypair } from '@solana/web3.js';
import fs from 'fs';

const keypair = Keypair.generate();
const secretKey = Array.from(keypair.secretKey);

fs.writeFileSync('wallet.json', JSON.stringify(secretKey));
console.log('✅ wallet.json generated successfully');
