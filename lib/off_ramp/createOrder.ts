import { Chain } from "../../sdk.js";
import { post } from "../../utils/api.js";
import { Currency } from "../../utils/enums.js";

export interface CreateOfframpOrder {
  bank: string;
  accountNumber: string;
  currency: Currency;
  amount?: number;
  fiatAmount?: number;
  mint: string;
  chain: Chain;
  description?: string;
  webhookURL: string;
  fee?: number;
}

export interface OfframpOrder {
  id: string;
  address: string;
  mint: string;
  currency: Currency;
  amount: number;
  fiatAmount: number;
  rate: number;
  fee: number;
}

export const createOfframpOrder = async (
  order: CreateOfframpOrder,
  sessionToken: string,
) => {
  try {
    const { fee, ...rest } = order;
    return await post<OfframpOrder>(
      "/pub/offramp",
      {
        ...rest,
        businessUSDCFee: fee,
      },
      {
        Authorization: `Bearer ${sessionToken}`,
      },
    );
  } catch (err) {
    console.error("Error Creating Order", err);
    throw err;
  }
};
