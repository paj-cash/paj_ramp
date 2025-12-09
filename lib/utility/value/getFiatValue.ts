import { get } from "../../../utils/api";
import { Currency } from "../../../utils/enums";

interface ValueQuery {
  amount: number;
  mint: string;
  currency: Currency;
}

export interface FiatValue extends ValueQuery {
  fiatAmount: number;
}

export async function getFiatValue(query: ValueQuery, sessionToken: string) {
  try {
    return await get<FiatValue>("/pub/rates/fiat-value", query, {
      Authorization: `Bearer ${sessionToken}`,
    });
  } catch (err) {
    throw err;
  }
}
