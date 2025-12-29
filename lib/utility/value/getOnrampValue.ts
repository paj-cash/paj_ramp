import { get } from "../../../utils/api.js";
import { Currency } from "../../../utils/enums.js";

interface ValueQuery {
  amount?: number;
  fiatAmount?: number;
  mint: string;
  currency: Currency;
}

export interface OnrampValue extends ValueQuery {
  rate: number;
  tokenRate: number;
}

export async function getOnrampValue(query: ValueQuery, sessionToken: string) {
  try {
    return await get<OnrampValue>("/pub/rates/onramp-value", query, {
      Authorization: `Bearer ${sessionToken}`,
    });
  } catch (err) {
    throw err;
  }
}
