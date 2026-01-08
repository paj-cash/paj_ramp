// A JavaScript SDK for interacting with our offramp and onramp service.

// Switch Environment: "staging" | "production"
import { setBaseUrl } from "./utils/axios.js";
import { Environment } from "./utils/enums.js";

export const initializeSDK = (env: Environment) => {
  if (env === Environment.Staging) {
    setBaseUrl("https://api-staging.paj.cash");
  } else if (env === Environment.Production) {
    setBaseUrl("https://api.paj.cash");
  } else if (env === Environment.Local) {
    setBaseUrl("http://localhost:3000");
  }
};

// UTILITY ENDPOINTS

// Session Management
export { initiate } from "./lib/utility/session/initiate.js";
export { verify } from "./lib/utility/session/verify.js";

// Rate Operations
export { getAllRate } from "./lib/utility/rate/getAllRate.js";
export { getRateByAmount } from "./lib/utility/rate/getRateByAmount.js";
export { getRateByType } from "./lib/utility/rate/getRateByType.js";
export {
  getOnrampValue as getTokenValue,
  OnrampValue as TokenValue,
} from "./lib/utility/value/getOnrampValue.js";
export {
  getOfframpValue as getFiatValue,
  OfframpValue as FiatValue,
} from "./lib/utility/value/getOfframpValue.js";

// Banking Operations
export { getBanks } from "./lib/utility/bank/getBanks.js";
export { resolveBankAccount } from "./lib/utility/bank/resolveBankAccount.js";
export { addBankAccount } from "./lib/utility/bank/addBankAccount.js";
export { getBankAccounts } from "./lib/utility/bank/getBankAccounts.js";

// Transaction History
export { getAllTransactions } from "./lib/utility/transaction/getAllTransactions.js";
export {
  getTransaction,
  PajTransaction,
} from "./lib/utility/transaction/getTransaction.js";

// OFF RAMP
// DIRECT OFF RAMP
export {
  createOfframpOrder,
  CreateOfframpOrder,
  OfframpOrder,
} from "./lib/off_ramp/createOrder.js";

// ON RAMP
// Create Order
export {
  createOnrampOrder,
  CreateOnrampOrder,
  OnrampOrder,
} from "./lib/on_ramp/createOrder.js";

// Value Operations
export {
  getOnrampValue,
  OnrampValue,
} from "./lib/utility/value/getOnrampValue.js";
export {
  getOfframpValue,
  OfframpValue,
  ValueQuery,
} from "./lib/utility/value/getOfframpValue.js";

// Types
export {
  RateType,
  Currency,
  TransactionType,
  TransactionStatus,
  Environment,
  // Chain
} from "./utils/enums.js";
