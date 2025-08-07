//Web3.js - A JavaScript library for interacting with the Web3 ecosystem.

//OFF RAMP

//Wallet Info
export { getTXPoolAddress } from "./lib/off_ramp/getTXPoolAddress.js";
export { getRate } from "./lib/off_ramp/getRate.js";

//Session Management
export { initiate } from "./lib/off_ramp/initiate.js";
export { verify } from "./lib/off_ramp/verify.js";

//Banking Operations
export { getBanks } from "./lib/off_ramp/getBanks.js";
export { resolveBankAccount } from "./lib/off_ramp/resolveBankAccount.js";
export { addBankAccount } from "./lib/off_ramp/addBankAccount.js";
export { getBankAccounts } from "./lib/off_ramp/getBankAccounts.js";

//Wallet Operations
export { getWallet } from "./lib/off_ramp/getWallet.js";
export { addWallet } from "./lib/off_ramp/addWallet.js";
export { switchWalletBankAccount } from "./lib/off_ramp/switchWalletBankAccount.js";

// ON RAMP
export { createOrder } from "./lib/on_ramp/createOrder.js";

// NEW: Socket.IO exports
export { observeOrder, OnRampOrderUpdate } from "./lib/on_ramp/observeOrder.js";
