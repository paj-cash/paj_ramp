import { post } from "../../utils/api.js";
import {
  Currency,
} from "../../utils/enums.js";

interface CreateOfframpOrder {
  bank: string;
  accountNumber: string;
  currency: Currency;
  amount: number;
  mint: string;
  webhookURL: string;
}

export interface OfframpOrder {
  id: string;
  address: string;
  mint: string;
  currency: Currency;
  amount: number;
  fiatAmount: number;
  rate: number;
}

export const createOfframpOrder = async (
  order: CreateOfframpOrder,
  sessionToken: string
) => {
  try {
    return await post<OfframpOrder>(
      "/pub/offramp",
      {
        ...order,
      },
      {
        Authorization: `Bearer ${sessionToken}`,
      }
    );
  } catch (err) {
    console.error("Error Creating Order", err);
    throw err;
  }
};
