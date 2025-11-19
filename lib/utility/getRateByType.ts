import { get } from '../../utils/api.js';
import { RateType } from '../../utils/enums.js';

type RateByType = {
  baseCurrency: string;
  targetCurrency: string;
  isActive: true;
  rate: number;
  type: string;
};

/**
 * This function fetches a rate based on a specified rate type asynchronously.
 * @param {RateType} rateType - RateType is a type that specifies the type of rate being requested,
 * such as 'standard', 'premium', 'discount', etc.
 * @returns The `getRateByType` function is returning a Promise that resolves to a `RateByType` object
 * fetched from the specified URL based on the `rateType` parameter. If an error occurs during the
 * fetching process, the function will log an error message and rethrow the error.
 */
export const getRateByType = async (rateType: RateType) => {
  const url: string = '/pub/rate';

  try {
    return await get<RateByType>(`${url}/${rateType}`);
  } catch (err) {
    console.error('Error fetching Rate by Rate Type:', err);
    throw err;
  }
};
