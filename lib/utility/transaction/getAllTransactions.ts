import { get } from "../../../utils/api.js";
import { PajTransaction } from "./getTransaction.js";

/**
 * The function getAllTransactions fetches all transactions from a specified endpoint and handles any
 * errors that occur.
 * @returns The `getAllTransactions` function is returning the result of the `get` function called with
 * the '/pub/transactions' endpoint. The result is expected to be of type `PajTransaction[]`. If
 * successful, the function will return the transactions data. If an error occurs during the API call,
 * it will be caught, logged to the console, and rethrown.
 */
export const getAllTransactions = async (token: string) => {
  try {
    return await get<PajTransaction[]>(
      "/pub/transactions",
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (err) {
    console.error("Error fetching Transactions:", err);
    throw err;
  }
};
