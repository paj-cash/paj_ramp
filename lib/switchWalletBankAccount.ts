import { patch } from "../utils/api.js";
import { getWalletBody } from "../utils/getWalletBody.js";
import { WalletType } from "./getWallet.js";

export const switchWalletBankAccount = async (
  apiKey: string,
  accountId: string,
  walletId: string,
  secretKey: Uint8Array
) => {
  try {
    const body = await getWalletBody(accountId, secretKey);
    if (!body) {
      throw new Error("Failed to get wallet body");
    }
    console.log(body);

    const response = await patch<WalletType>(`/pub/wallet/${walletId}`, body, {
      Authorization: `Bearer ${apiKey}`,
    });
    return response;
  } catch (err) {
    console.error("Error switching wallet bank account:", err);
    throw err;
  }
};