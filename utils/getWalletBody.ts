import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { Keypair } from '@solana/web3.js';
import { verifySignature, Payload } from '../utils/verifySignature.js';
import { generateSignature } from '../utils/generateSignature.js';

/**
 * Generates a signature, verifies it and returns the wallet body.
 * Returns an object containing the payload and signature.
 *
 * Returns:
 *   An object containing the payload and signature.
 *
 * Raises:
 *   Throws an error if the wallet file is not found or if the secret key is invalid.
 */
export const getWalletBody = async (accountId: string) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const walletPath = resolve(__dirname, '../../wallet.json');
    const secretKeyRaw = fs.readFileSync(walletPath, 'utf8');
    const secretKeyArray = JSON.parse(secretKeyRaw);

    if (!Array.isArray(secretKeyArray) || secretKeyArray.length !== 64) {
      throw new Error('Invalid secret key: must be an array of 64 numbers.');
    }

    const secretKey = Uint8Array.from(secretKeyArray);
    const keypair = Keypair.fromSecretKey(secretKey);

    let timestamp = new Date().toISOString();

    const payload: Payload = {
      publicKey: keypair.publicKey.toString(),
      accountId,
      timestamp,
    };

    const signature = generateSignature(payload, keypair.secretKey);
    const isValid = verifySignature(payload, signature, keypair.publicKey);
    const body = {
      payload,
      signature,
    };
    if (isValid) {
      return body;
    }
  } catch (err) {
    console.error('Error getting wallet body:', err);
  }
};
