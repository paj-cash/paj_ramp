import { get } from "../../../utils/api.js";

type BankType = {
  id: string;
  name: string;
  country: string;
};
/**
 * Fetches a list of banks from the public API endpoint.
 * Returns an array of bank objects or throws an error if the request fails.
 *
 * Returns:
 *   An array of objects, each containing id, name, and country of a bank.
 *
 * Raises:
 *   Throws an error if the request fails.
 */
export const getBanks = async (token: string) => {
  try {
    return await get<BankType[]>(
      `/pub/bank`,
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (err) {
    console.error("Error fetching Banks:", err);
    throw err;
  }
};
