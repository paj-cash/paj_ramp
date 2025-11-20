import { get } from '../../../utils/api.js';

type RateByAmountType = {
  rate: {
    baseCurrency: string;
    targetCurrency: string;
    rate: number;
  };
  amounts: {
    userTax: number;
    merchantTax: number;
    amountUSD: number;
    userAmountFiat: number;
  };
};

/**
 * The function `getRateByAmount` fetches a rate based on a specified amount asynchronously.
 * @param {number} amount - The `amount` parameter in the `getRateByAmount` function is a number
 * representing the amount for which you want to retrieve the rate. This function makes an asynchronous
 * request to the `/pub/rate` endpoint with the specified amount to fetch the rate information. If
 * successful, it returns the rate
 * @returns The `getRateByAmount` function is returning a Promise that resolves to the rate for a
 * specific amount. The rate is fetched from the specified URL endpoint `/pub/rate` with the provided
 * amount as a parameter. If the rate is successfully fetched, it will be returned. If there is an
 * error during the fetching process, an error message will be logged to the console and the error will
 * be
 */
export const getRateByAmount = async (amount: number) => {
  const url: string = '/pub/rate';

  try {
    return await get<RateByAmountType>(`${url}/${amount}`);
  } catch (err) {
    console.error('Error fetching Rate by Amount:', err);
    throw err;
  }
};
