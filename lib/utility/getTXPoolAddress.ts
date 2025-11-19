import { get } from "../../utils/api.js";

/**
 * Fetches the transaction pool address from the public API endpoint.
 * Returns the address as a string or throws an error if the request fails.
 *
 * Returns:
 *   The transaction pool address as a string.
 *
 * Raises:
 *   Throws an error if the request fails.
 */
export const getTXPoolAddress = async () => {
  try {
    return await get<{
      address: string;
    }>("/pub/txpool-address");
  } catch (err) {
    console.error("Error fetching TX Pool Address:", err);
    throw err;
  }
};
