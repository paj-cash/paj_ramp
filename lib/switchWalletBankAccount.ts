import { patch } from '../utils/api.js';
import { getWalletBody } from '../utils/getWalletBody.js';
import { WalletType } from './getWallet.js';

export const switchWalletBankAccount = async (
  token: string,
  accountId: string
) => {
  try {
    const body = await getWalletBody(accountId);
    if (!body) {
      throw new Error('Failed to get wallet body');
    }
    console.log(body)

    const response = await patch<WalletType>(`/pub/wallet`, body, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  } catch (err) {
    console.error('Error switching wallet bank account:', err);
    throw err;
  }
};
