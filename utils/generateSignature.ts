import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { Payload } from './verifySignature.js';

/**
 * Generates a signature for the given payload using the provided secret key.
 * Returns the generated signature as a base58-encoded string.
 *
 * Returns:
 *   The generated signature as a base58-encoded string.
 *
 * Raises:
 *   Throws an error if the payload is invalid or if the signing process fails.
 */
export function generateSignature(
  payload: Payload,
  secretKey: Uint8Array
): string {
  const message = JSON.stringify(payload);
  const signature = nacl.sign.detached(
    new TextEncoder().encode(message),
    secretKey
  );
  return bs58.encode(signature);
}