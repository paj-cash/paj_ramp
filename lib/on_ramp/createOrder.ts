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

export const createOrder = async (options: CreateOrderType) => {
  const { fiatAmount, currency, recipient, mint, chain, webhookURL, token } = options;
  try {
    return await post<CreateOrderType>(
      "/pub/onramp",
      {
        fiatAmount,
        currency,
        recipient,
        mint,
        chain,
        webhookURL
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
