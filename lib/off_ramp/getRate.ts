import { get } from '../../utils/api.js';

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

type RateByRateTypeType = {
  baseCurrency: string;
  targetCurrency: string;
  isActive: true;
  rate: number;
  type: string;
};

type TokenValueType = {
  amount: number;
  usdcValue: number;
  mint: string;
};

export enum RateType {
  onRamp = 'onRamp',
  offRamp = 'offRamp',
}

/**
 * The function `getRate` in TypeScript is an asynchronous function that retrieves rate information
 * based on different parameters such as amount, rate type, and mint token.
 * @param {number | RateType} param - The `param` parameter in the `getRate` function can be either a
 * number or a `RateType`.
 * @param {string} [mint_token] - The `mint_token` parameter is an optional string parameter that
 * represents a token used for minting. It is used in the `getRate` function to calculate the rate
 * based on the specified token value.
 * @returns The `getRate` function returns different values based on the conditions inside the
 * function:
 */
export const getRate = async (
  param: number | RateType,
  mint_token?: string
) => {
  try {
    const url = '/pub/rate';

    if (!param) {
      return getAllRate(url);
    } else if (typeof param === 'number') {
      if (mint_token) return getTokenValue(url, param, mint_token);
      return getRateByAmount(url, param);
    } else {
      return getRateByRateType(url, param);
    }
  } catch (err) {
    console.error('Error fetching Rate:', err);
    throw err;
  }
};

/**
 * The function `getAllRate` fetches all rates from a specified URL and handles any errors that occur
 * during the process.
 * @param {string} url - The `url` parameter in the `getAllRate` function is a string representing the
 * URL from which the rate data will be fetched.
 * @returns The `getAllRate` function is returning the result of the `get<AllRateResponseType>(url)`
 * function call, which is fetching rate data from the specified URL. If successful, it will return the
 * rate data. If an error occurs during the fetching process, it will log the error message and rethrow
 * the error.
 */
export const getAllRate = async (url: string) => {
  try {
    return await get<AllRateResponseType>(url);
  } catch (err) {
    console.error('Error fetching Rate:', err);
    throw err;
  }
};

/**
 * The function `getRateByAmount` fetches a rate based on a specified amount from a given URL.
 * @param {string} url - The `url` parameter is a string that represents the URL endpoint where the
 * rate information is fetched from.
 * @param {number} amount - The `amount` parameter in the `getRateByAmount` function is a number
 * representing the amount for which you want to fetch the rate. This amount will be used in the URL to
 * make a request to the specified endpoint to get the rate information for that specific amount.
 * @returns The function `getRateByAmount` is returning a Promise that resolves to a `RateByAmountType`
 * object fetched from the specified URL with the provided amount.
 */
export const getRateByAmount = async (url: string, amount: number) => {
  try {
    return await get<RateByAmountType>(`${url}/${amount}`);
  } catch (err) {
    console.error('Error fetching Rate by Amount:', err);
    throw err;
  }
};

/**
 * The function `getRateByRateType` fetches a rate based on a specified rate type from a given URL.
 * @param {string} url - The `url` parameter is a string representing the base URL used to fetch data.
 * @param {RateType} rateType - RateType is a type that represents the different types of rates that
 * can be fetched. It is used as a parameter in the getRateByRateType function to specify the type of
 * rate to retrieve from the provided URL.
 * @returns The `getRateByRateType` function is returning a Promise that resolves to a
 * `RateByRateTypeType` object fetched from the specified URL with the provided rate type.
 */
export const getRateByRateType = async (url: string, rateType: RateType) => {
  try {
    return await get<RateByRateTypeType>(`${url}/${rateType}`);
  } catch (err) {
    console.error('Error fetching Rate by Rate Type:', err);
    throw err;
  }
};

/**
 * The function `getTokenValue` asynchronously fetches the value of a token based on the provided URL,
 * amount, and mint token.
 * @param {string} url - The `url` parameter is a string representing the base URL for the API endpoint
 * where you can fetch the token value.
 * @param {number} amount - The `amount` parameter in the `getTokenValue` function represents the
 * quantity or number of tokens for which you want to retrieve the value. It is a numeric value
 * (number) indicating the amount of tokens for which you are querying the value.
 * @param {string} mint_token - The `mint_token` parameter in the `getTokenValue` function represents
 * the unique identifier for a specific token. It is used to specify which token's value you want to
 * retrieve based on the provided `amount`.
 * @returns The `getTokenValue` function is returning the result of the `get` function called with the
 * URL `/value?amount=&mint=`. The `get` function is likely making an HTTP
 * request to that URL to fetch some data. The return value is expected to be of type `TokenValueType`.
 * If an error occurs during the fetch operation, an error message will
 */
export const getTokenValue = async (
  url: string,
  amount: number,
  mint_token: string
) => {
  try {
    return await get<TokenValueType>(
      `${url}/value?amount=${amount}&mint=${mint_token}`
    );
  } catch (err) {
    console.log('Error fetching Token Value:', err);
  }
};
