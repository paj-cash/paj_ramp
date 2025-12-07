import { get } from "../../../utils/api";
import { Currency } from "../../../utils/enums";

interface ValueQuery {
  amount: number;
  mint: string;
  currency: Currency;
}

export interface TokenValue extends ValueQuery {
  tokenAmount: number;
}

export async function getTokenValue(query: ValueQuery, sessionToken: string) {
  try {
    return await get<TokenValue>("/pub/rates/token-value", query, {
      Authorization: `Bearer ${sessionToken}`,
    });
  } catch (err) {
    throw err;
  }
}
