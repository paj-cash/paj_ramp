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

// UTILS || CORE

// Session Management
export { initiate } from './lib/core/initiate.js';
export { verify } from './lib/core/verify.js';

// Rate Operations
export { getAllRate } from './lib/core/getAllRate.js';
export { getRateByAmount } from './lib/core/getRateByAmount.js';
export { getRateByType } from './lib/core/getRateByType.js';
export { getTokenValue } from './lib/core/getTokenValue.js';

// Banking Operations
export { getBanks } from './lib/core/getBanks.js';
export { resolveBankAccount } from './lib/core/resolveBankAccount.js';
export { addBankAccount } from './lib/core/addBankAccount.js';
export { getBankAccounts } from './lib/core/getBankAccounts.js';

// Transaction History
export { getAllTransactions } from './lib/core/getAllTransactions.js';
export { getTransaction } from './lib/core/getTransaction.js';

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
