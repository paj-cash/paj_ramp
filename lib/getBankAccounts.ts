import { get } from '../utils/api.js';

type GetBankAccountsType = {
  id: string;
  accountName: string;
  accountNumber: string;
  bank: string;
};

/**
 * Fetches a list of added bank accounts from the public API endpoint.
 * Returns an array of bank account objects or throws an error if the request fails.
 *
 * Returns:
 *   An array of objects, each containing id, accountName, accountNumber, and bank of a bank account.
 *
 * Raises:
 *   Throws an error if the request fails.
 */
export const getBankAccounts = async (token: string) => {
  try {
    return await get<GetBankAccountsType[]>(
      `/pub/bankaccount`,
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (err) {
    console.error('Error fetching bank accounts:', err);
    throw err;
  }
};
