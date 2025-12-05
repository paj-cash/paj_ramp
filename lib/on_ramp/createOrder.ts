import { post } from "../../utils/api.js";

type CreateOrderType = {
  fiatAmount: number;
  currency: string;
  recipient: string;
  mint: string;
  chain: string;
  webhookURL: string;
  token?: string;
};

type CreateOrderResponseType = {
  id: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  bank: string;
};

export const createOnrampOrder = async (
  options: CreateOrderType
): Promise<CreateOrderResponseType> => {
  const { fiatAmount, currency, recipient, mint, chain, webhookURL, token } =
    options;
  try {
    return await post<CreateOrderResponseType>(
      "/pub/onramp",
      {
        fiatAmount,
        currency,
        recipient,
        mint,
        chain,
        webhookURL,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (err) {
    console.error("Error creating order:", err);
    throw err;
  }
};
