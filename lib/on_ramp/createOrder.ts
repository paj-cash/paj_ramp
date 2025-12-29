import { post } from "../../utils/api.js";
import { Currency } from "../../utils/enums.js";

type CreateOnrampOrder = {
  amount?: number;
  fiatAmount?: number;
  currency: string;
  recipient: string;
  mint: string;
  chain: string;
  webhookURL: string;
};

export interface OnrampOrder {
  id: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  fiatAmount: number;
  bank: string;
  rate: number;
  recipient: string;
  currency: Currency;
  mint: string;
  fee: number;
}

export const createOnrampOrder = async (
  order: CreateOnrampOrder,
  sessionToken: string
): Promise<OnrampOrder> => {
  try {
    return await post<OnrampOrder>(
      "/pub/onramp",
      {
        ...order,
      },
      {
        Authorization: `Bearer ${sessionToken}`,
      }
    );
  } catch (err) {
    console.error("Error creating order:", err);
    throw err;
  }
};
