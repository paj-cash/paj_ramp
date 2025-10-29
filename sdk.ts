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

// OFF RAMP

// Wallet Info
// export { getTXPoolAddress } from "./lib/off_ramp/getTXPoolAddress.js";
export { getRate } from './lib/off_ramp/getRate.js';

// Session Management
export { initiate } from './lib/off_ramp/initiate.js';
export { verify } from './lib/off_ramp/verify.js';

//  // Banking Operations
export { getBanks } from "./lib/off_ramp/getBanks.js";
export { resolveBankAccount } from "./lib/off_ramp/resolveBankAccount.js";
export { addBankAccount } from "./lib/off_ramp/addBankAccount.js";
export { getBankAccounts } from "./lib/off_ramp/getBankAccounts.js";

// Wallet Operations
// export { getWallet } from './lib/off_ramp/getWallet.js';
// export { addWallet } from './lib/off_ramp/addWallet.js';
// export { switchWalletBankAccount } from './lib/off_ramp/switchWalletBankAccount.js';

// DIRECT OFF RAMP
export { offRampCreateOrder } from './lib/direct_off_ramp/directCreateOrder.js';


// ON RAMP

// Create Order
export { createOrder } from './lib/on_ramp/createOrder.js';

// Observe Order Socket.IO
export { observeOrder } from './lib/on_ramp/observeOrder.js';

// Types
export { RateType } from './lib/off_ramp/getRate.js';