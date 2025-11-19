import { post } from '../../utils/api.js';
import { Currency, TransactionStatus, TransactionType } from '../../utils/enums.js';



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
  id: string;
  address: string;
  signature?: string;
  mint: string;
  currency: Currency;
  amount: number;
  usdcAmount: number;
  fiatAmount: number;
  sender: string;
  receipiant: string;
  rate: number;
  status: TransactionStatus;
  transactionType: TransactionType;
  createdAt: string;
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
