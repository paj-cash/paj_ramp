import { get } from "../../../utils/api.js";

export type WalletType = {
  id: string;
  publicKey: string;
  bankAccount: {
    id: string;
    accountName: string;
    accountNumber: string;
    bank: string;
  };
};

/**
 * Fetches wallet details for a given public key from the public API endpoint.
 * Returns the wallet information including bank account details or throws an error if the request fails.
 *
 * Args:
 *   publicKey: The public key of the wallet to fetch.
 *
 * Returns:
 *   An object containing wallet id, publicKey, and associated bank account details.
 *
 * Raises:
 *   Throws an error if the request fails.
 */
export const getWallet = async (publicKey: string) => {
  try {
    return await get<WalletType>(`/pub/wallet/${publicKey}`);
  } catch (err) {
    console.error("Error fetching wallet:", err);
    throw err;
  }
};
