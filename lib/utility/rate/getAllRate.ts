import { get } from '../../../utils/api.js';

type AllRateResponseType = {
  onRampRate: {
    baseCurrency: string;
    targetCurrency: string;
    isActive: boolean;
    rate: number;
    type: string;
  };
  offRampRate: {
    baseCurrency: string;
    targetCurrency: string;
    isActive: boolean;
    rate: number;
    type: string;
  };
};

/**
 * This TypeScript function asynchronously fetches all rates from a specified URL and handles any
 * errors that may occur.
 * @returns The `getAllRate` function is returning the result of the `get<AllRateResponseType>(url)`
 * function call, which is fetching rate data from the specified URL '/pub/rate'. The function is using
 * async/await syntax to handle asynchronous operations and is catching any errors that occur during
 * the fetch operation. If successful, the function will return the rate data, and if an error occurs,
 * it
 */
export const getAllRate = async () => {
  const url: string = '/pub/rate';

  try {
    return await get<AllRateResponseType>(url);
  } catch (err) {
    console.error('Error fetching Rate:', err);
    throw err;
  }
};
