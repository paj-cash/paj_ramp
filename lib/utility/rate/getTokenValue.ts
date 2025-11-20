import { get } from '../../../utils/api.js';

type TokenValueType = {
  amount: number;
  usdcValue: number;
  mint: string;
};

/**
 * The function `getTokenValue` asynchronously fetches the value of a token based on the specified
 * amount and token mint.
 * @param {number} amount - The `amount` parameter is a number representing the quantity of tokens for
 * which you want to retrieve the value.
 * @param {string} mint_token - The `mint_token` parameter in the `getTokenValue` function represents
 * the unique identifier for a specific token. It is used to specify which token you are interested in
 * when fetching its value.
 * @returns The `getTokenValue` function is returning the result of the `get` function call with the
 * URL `/value?amount=&mint=` as its argument. The `get` function is likely
 * making an HTTP request to fetch the token value based on the provided amount and mint token. If
 * successful, the function will return the token value. If there is an error during
 */
export const getTokenValue = async (amount: number, mint_token: string) => {
  const url: string = '/pub/rate';

  try {
    return await get<TokenValueType>(
      `${url}/value?amount=${amount}&mint=${mint_token}`
    );
  } catch (err) {
    console.log('Error fetching Token Value:', err);
    throw err;
  }
};
