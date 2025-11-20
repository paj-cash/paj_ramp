import { post } from '../../../utils/api.js';

type AddBankAccountType = {
  id: string;
  accountName: string;
  accountNumber: string;
  bank: string;
};

/**
 * Adds a new bank account by sending the provided token, bank ID, and account number to the public API.
 * Returns the added bank account details or throws an error if the request fails.
 *
 * Args:
 *   token: The authentication token for the request.
 *   bankId: The ID of the bank.
 *   accountNumber: The bank account number to add.
 *
 * Returns:
 *   An object containing the new bank account's id, accountName, accountNumber, and bank.
 *
 * Raises:
 *   Throws an error if the request fails.
 */
export const addBankAccount = async (
  token: string,
  bankId: string,
  accountNumber: string
) => {
  try {
    return await post<AddBankAccountType>(
      '/pub/bank-account',
      {
        bankId,
        accountNumber,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (err) {
    console.error('Error adding bank account:', err);
    throw err;
  }
};
