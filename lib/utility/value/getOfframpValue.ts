import { get } from "../../../utils/api.js";
import { Currency } from "../../../utils/enums.js";

export interface ValueQuery {
  amount?: number;
  fiatAmount?: number;
  mint: string;
  currency: Currency;
}

export interface OfframpValue extends ValueQuery {
  fiatAmount: number;
  tokenRate: number;
}

export async function getOfframpValue(query: ValueQuery, sessionToken: string) {
  try {
    return await get<OfframpValue>("/pub/rates/offramp-value", query, {
      Authorization: `Bearer ${sessionToken}`,
    });
  } catch (err) {
    throw err;
  }
}
