import { get } from '../utils/api.js';

type RateType = {
  baseCurrency: string;
  targetCurrency: string;
  rate: number;
  amounts: {
    userTax: number;
    merchantTax: number;
    amountUSD: number;
    userAmountFiat: number;
  };
};

/**
 * Fetches the exchange rate and related amounts for a given amount from the public API.
 * Returns an object containing currency information, rate, and detailed amounts, or throws an error if the request fails.
 *
 * Args:
 *   amount: The amount for which to fetch the rate. If not provided or falsy, fetches the default rate.
 *
 * Returns:
 *   An object with baseCurrency, targetCurrency, rate, and amounts (userTax, merchantTax, amountUSD, userAmountFiat).
 *
 * Raises:
 *   Throws an error if the request fails.
 */
export const getRate = async (amount: number) => {
  try {
    return await get<RateType>(amount ? `/pub/rate/${amount}` : '/pub/rate');
  } catch (err) {
    console.error('Error fetching Rate:', err);
    throw err;
  }
};
