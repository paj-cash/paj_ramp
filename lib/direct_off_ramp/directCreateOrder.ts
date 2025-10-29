import { post } from '../../utils/api.js';

enum Currency {
  NGN = 'NGN',
}

// type offRampCreateOrderType = {
//   token?: string;
//   bank: string;
//   accountNumber: string;
//   currency: Currency;
//   amount: number;
//   mint: string;
//   webhookURL: string;
// };

type offRampCreateOrderResponse = {
  amount: number;
  expectedAmount: number;
  mint: string;
  decimals: number;
  address: string;
  walletId: string;
  creatorId: string;
  bankId: string;
  accountNumber: string;
  currency: Currency;
  status: string;
  webhookURL: string;
};

export const offRampCreateOrder = async (
  token: string,
  bank: string,
  accountNumber: string,
  currency: string,
  amount: number,
  mint: string,
  webhookURL: string
) => {
  try {
    return await post<offRampCreateOrderResponse>(
      '/pub/offramp',
      {
        bank,
        accountNumber,
        currency,
        amount,
        mint,
        webhookURL,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (err) {
    console.error('Error Creating Order', err);
    throw err;
  }
};
