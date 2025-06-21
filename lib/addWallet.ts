import { post } from "../utils/api.js";
import { getWalletBody } from "../utils/getWalletBody.js";
import { WalletType } from "./getWallet.js";

/**
 * Adds a new wallet for the user.
 * Returns the added wallet object or throws an error if the request fails.
 *
 * Returns:
 *   An object containing id, accountName, accountNumber, and bank of the bank account.
 *
 * Raises:
 *   Throws an error if the wallet file is not found or if the secret key is invalid.
 */
export const addWallet = async (
  apiKey: string,
  accountId: string,
  secretKey: Uint8Array
) => {
  try {
    const body = await getWalletBody(accountId, secretKey);
    if (!body) {
      throw new Error("Failed to get wallet body");
    }

    const response = await post<WalletType>("/pub/wallet", body, {
      Authorization: `Bearer ${apiKey}`,
    });
  } catch (err) {
    console.error("Error adding wallet:", err);
    throw err;
  }
};
