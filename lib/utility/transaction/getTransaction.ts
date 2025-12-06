import { get } from "../../../utils/api.js";
import { TransactionStatus, TransactionType } from "../../../utils/enums.js";
import { OnrampOrder } from "../../on_ramp/createOrder.js";
import { OfframpOrder } from "../../off_ramp/directCreateOrder.js";

export interface PajTransaction extends OnrampOrder, OfframpOrder {
  signature: string;
  status: TransactionStatus;
  transactionType: TransactionType;
  createdAt: string | Date;
  usdcAmount: number;
}

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
    return await get<PajTransaction>(
      `/pub/transactions/${id}`,
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (err) {
    console.error("Error fetching Transaction:", err);
    throw err;
  }
};
