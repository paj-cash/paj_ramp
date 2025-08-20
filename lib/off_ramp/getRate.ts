import { get } from "../../utils/api.js";

type AllRateResponseType = {
  onRampRate: {
    baseCurrency: "USD";
    targetCurrency: "NGN";
    isActive: true;
    rate: 1510;
    type: "onRamp";
  };
  offRampRate: {
    baseCurrency: "USD";
    targetCurrency: "NGN";
    isActive: true;
    rate: 1525;
    type: "offRamp";
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
  baseCurrency: "USD";
  targetCurrency: "NGN";
  isActive: true;
  rate: 1525;
  type: "offRamp";
};

export enum RateType {
  onRamp = "onRamp",
  offRamp = "offRamp",
}

/**
 * Fetches rate information based on the provided parameter, which can be a number or a rate type.
 * This function returns all rates, rates by amount, or rates by type depending on the input.
 *
 * Args:
 *   param: A number representing the amount or a RateType enum value.
 *
 * Returns:
 *   A promise resolving to the rate information relevant to the input parameter.
 *
 * Raises:
 *   Throws an error if the rate information cannot be fetched.
 */
export const getRate = async (param: number | RateType) => {
  try {
    const url = "/pub/rate";

    if (!param) {
      return getAllRate(url);
    } else if (typeof param === "number") {
      return getRateByAmount(url, param);
    } else {
      return getRateByRateType(url, param);
    }
  } catch (err) {
    console.error("Error fetching Rate:", err);
    throw err;
  }
};

/**
 * Retrieves all available rate information for on-ramp and off-ramp transactions.
 * This function returns a promise that resolves to the complete set of rate data.
 *
 * Args:
 *   url: The endpoint URL to fetch rate information from.
 *
 * Returns:
 *   A promise resolving to the full rate response data.
 *
 * Raises:
 *   Throws an error if the rate information cannot be fetched.
 */
const getAllRate = async (url: string) => {
  try {
    return await get<AllRateResponseType>(url);
  } catch (err) {
    console.error("Error fetching Rate:", err);
    throw err;
  }
};

/**
 * Retrieves rate information based on a specific amount for on-ramp or off-ramp transactions.
 * This function returns a promise that resolves to the rate and associated amounts for the given value.
 *
 * Args:
 *   url: The endpoint URL to fetch rate information from.
 *   amount: The amount for which the rate information is requested.
 *
 * Returns:
 *   A promise resolving to the rate and amount details for the specified value.
 *
 * Raises:
 *   Throws an error if the rate information cannot be fetched.
 */
export const getRateByAmount = async (url: string, amount: number) => {
  try {
    return await get<RateByAmountType>(`/pub/rate/${amount}`);
  } catch (err) {
    console.error("Error fetching Rate by Amount:", err);
    throw err;
  }
};

/**
 * Retrieves rate information based on a specific rate type for on-ramp or off-ramp transactions.
 * This function returns a promise that resolves to the rate details for the given rate type.
 *
 * Args:
 *   url: The endpoint URL to fetch rate information from.
 *   rateType: The type of rate to retrieve, specified as a RateType enum value.
 *
 * Returns:
 *   A promise resolving to the rate details for the specified rate type.
 *
 * Raises:
 *   Throws an error if the rate information cannot be fetched.
 */
export const getRateByRateType = async (url: string, rateType: RateType) => {
  try {
    return await get<RateByRateTypeType>(`/pub/rate/${rateType}`);
  } catch (err) {
    console.error("Error fetching Rate by Rate Type:", err);
    throw err;
  }
};
