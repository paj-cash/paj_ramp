import { get } from '../../../utils/api.js';

type ResolveBankAccountType = {
  accountName: string;
  accountNumber: string;
  bank: {
    id: string;
    name: string;
    code: string;
    country: string;
  };
};

/**
 * Resolves and fetches bank account details for a given bank ID and account number from the public API.
 * Returns the account name, account number, and bank details or throws an error if the request fails.
 *
 * Args:
 *   bankId: The ID of the bank.
 *   accountNumber: The bank account number to resolve.
 *
 * Returns:
 *   An object containing accountName, accountNumber, and bank details (id, name, code, country).
 *
 * Raises:
 *   Throws an error if the request fails.
 */
export const resolveBankAccount = async (
  token: string,
  bankId: string,
  accountNumber: string
) => {
  try {
    return await get<ResolveBankAccountType>(
      `/pub/bank-account/confirm/?bankId=${bankId}&accountNumber=${accountNumber}`,
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (err) {
    console.error('Error resolving bank account:', err);
    throw err;
  }
};
