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
export {
  initiate,
  InitiateResponse,
} from "./lib/utility/session/initiate.js";
export {
  verify,
  Verify,
  DeviceSignature,
} from "./lib/utility/session/verify.js";

// Rate Operations
export { getAllRate } from "./lib/utility/rate/getAllRate.js";
export {
  getRateByAmount,
  RateByAmount,
} from "./lib/utility/rate/getRateByAmount.js";
export {
  getRateByType,
  RateBy,
} from "./lib/utility/rate/getRateByType.js";
export {
  getOnrampValue as getTokenValue,
  OnrampValue as TokenValue,
} from "./lib/utility/value/getOnrampValue.js";
export {
  getOfframpValue as getFiatValue,
  OfframpValue as FiatValue,
} from "./lib/utility/value/getOfframpValue.js";

// Banking Operations
export {
  getBanks,
  Bank,
} from "./lib/utility/bank/getBanks.js";
export {
  resolveBankAccount,
  ResolveBankAccount,
} from "./lib/utility/bank/resolveBankAccount.js";
export {
  addBankAccount,
  AddBankAccount,
} from "./lib/utility/bank/addBankAccount.js";
export {
  getBankAccounts,
  GetBankAccounts,
} from "./lib/utility/bank/getBankAccounts.js";

// Token Operations
export {
  getTokenInfo,
  TokenInfo,
} from "./lib/utility/token/getTokenInfo.js";

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
export {
  observeOrder,
  ObserveOrderOptions,
  ObserveOrderReturn,
} from "./lib/on_ramp/observeOrder.js";

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

// Enums
export {
  RateType,
  Currency,
  TransactionType,
  TransactionStatus,
  Environment,
} from "./utils/enums.js";
export {
  Chain,
  OnRampStatus,
  OnRampOrderUpdate,
  OnRampSocketEvents,
  OnRampSocketOptions,
  OnRampSocketInstance,
} from "./utils/onramp-socket.js";
