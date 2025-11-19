// A JavaScript SDK for interacting with our offramp and onramp service.

// Switch Environment: "staging" | "production"
import { setBaseUrl } from './utils/axios.js';

export const initializeSDK = (env: 'staging' | 'production') => {
  if (env === 'staging') {
    setBaseUrl('https://api-staging.paj.cash');
  } else {
    setBaseUrl('https://api.paj.cash');
  }
};

// UTILITY ENDPOINTS

// Session Management
export { initiate } from './lib/utility/initiate.js';
export { verify } from './lib/utility/verify.js';

// Rate Operations
export { getAllRate } from './lib/utility/getAllRate.js';
export { getRateByAmount } from './lib/utility/getRateByAmount.js';
export { getRateByType } from './lib/utility/getRateByType.js';
export { getTokenValue } from './lib/utility/getTokenValue.js';

// Banking Operations
export { getBanks } from './lib/utility/getBanks.js';
export { resolveBankAccount } from './lib/utility/resolveBankAccount.js';
export { addBankAccount } from './lib/utility/addBankAccount.js';
export { getBankAccounts } from './lib/utility/getBankAccounts.js';

// Transaction History
export { getAllTransactions } from './lib/utility/getAllTransactions.js';
export { getTransaction } from './lib/utility/getTransaction.js';

// OFF RAMP
// DIRECT OFF RAMP
export { offRampCreateOrder } from './lib/off_ramp/directCreateOrder.js';

// ON RAMP
// Create Order
export { createOrder } from './lib/on_ramp/createOrder.js';

// Types
export {
  RateType,
  Currency,
  TransactionType,
  TransactionStatus,
  // Chain
} from './utils/enums.js';
