import { get } from '../../../utils/api.js';
import {
  Currency,
  TransactionStatus,
  TransactionType,
} from '../../../utils/enums.js';

export type TransactionResponse = {
  id: string;
  address: string;
  mint: string;
  currency: Currency;
  amount: number;
  usdcAmount: number;
  fiatAmount: number;
  sender: string;
  receipiant: string;
  rate: number;
  status: TransactionStatus;
  transactionType: TransactionType;
  createdAt: string | Date;
};

/**
 * The function `getTransaction` asynchronously fetches a transaction with a specified ID and handles
 * any errors that may occur.
 * @param {string} id - The `id` parameter in the `getTransaction` function is a string representing
 * the unique identifier of the transaction that you want to retrieve.
 * @returns The `getTransaction` function is returning the result of the `get` function called with the
 * endpoint `/pub/transactions/`. This function is fetching transaction data based on the provided
 * `id`.
 */
export const getTransaction = async (token: string, id: string) => {
  try {
    return await get<TransactionResponse>(
      `/pub/transactions/${id}`,
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (err) {
    console.error('Error fetching Transaction:', err);
    throw err;
  }
};
