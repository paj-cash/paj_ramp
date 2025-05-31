import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import nacl from 'tweetnacl';

export type Payload = {
  publicKey: string;
  accountId: string;
  timestamp: string;
};

/**
 * Verifies the signature of the given payload using the provided public key.
 * Returns true if the signature is valid, false otherwise.
 *
 * Returns:
 *   boolean - Indicates whether the signature is valid.
 *
 * Raises:
 *   Throws an error if the payload is invalid or if the verification process fails.
 */
export function verifySignature(
  payload: Payload,
  signatureBase58: string,
  publicKey: PublicKey
): boolean {
  const messageBytes = new TextEncoder().encode(JSON.stringify(payload));
  const signature = bs58.decode(signatureBase58);
  const publicKeyBytes = publicKey.toBytes();
  return nacl.sign.detached.verify(messageBytes, signature, publicKeyBytes);
}
