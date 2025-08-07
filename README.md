# PAJ Ramp SDK

A comprehensive SDK for PAJ Ramp onramp and offramp operations with real-time transaction updates using Socket.IO.

## Features

- **Onramp Operations**: Create orders and observe real-time updates
- **Offramp Operations**: Complete offramp workflow with bank account management
- **Real-time Updates**: Socket.IO integration for live transaction status updates
- **TypeScript Support**: Full TypeScript definitions included
- **Functional API**: Clean functional approach for better composability

## Installation

```bash
npm install paj-ramp
```

```bash
yarn add paj-ramp
```

---

# Onramp SDK (Real-time Order Observation)

## Quick Start

### Real-time Order Observation

The SDK provides Socket.IO functionality to observe onramp orders in real-time:

```typescript
import {
  observeOrder,
  createOrderObserver,
  createOnRampSocket,
} from "paj-ramp";

// Using observeOrder function
const observer = observeOrder({
  orderId: "your_order_id",
  onOrderUpdate: (data) => {
    console.log("Order update:", data);
    // Handle status changes: pending, processing, completed, failed, cancelled
  },
  onError: (error) => {
    console.error("Socket error:", error);
  },
});

await observer.connect();
```

### Order Update Data Structure

```typescript
interface OnRampOrderUpdate {
  id: string;
  fiatAmount: string;
  currency: string;
  recipient: string; // wallet address
  mint: string; // token address
  chain: Chain; // enum: 'solana', 'ethereum', 'polygon'
  status: OnRampStatus; // enum: 'pending', 'processing', 'completed', 'failed', 'cancelled'
}
```

### Socket Events

The SDK listens for these Socket.IO events:

- **ORDER_UPDATE**: Real-time order status updates
- **ERROR**: Error messages from the server

## API Reference

### observeOrder(options)

Creates an order observer.

**Parameters:**

- `options.orderId` (string, required): The order ID to observe
- `options.onOrderUpdate` (function, optional): Callback for order updates
- `options.onError` (function, optional): Callback for errors
- `options.onConnect` (function, optional): Callback when connected
- `options.onDisconnect` (function, optional): Callback when disconnected
- `options.onConnectionStatusChange` (function, optional): Callback for connection status changes

**Returns:**

- `socket`: The Socket.IO instance
- `isConnected()`: Function to check connection status
- `connect()`: Function to connect to the socket
- `disconnect()`: Function to disconnect from the socket

### createOrder(orderData)

Creates a new onramp order.

**Parameters:**

- `orderData` (object, required): Order creation data
- `orderData.fiatAmount` (number, required): Order amount
- `orderData.currency` (string, required): Currency code (e.g., 'USD', 'NGN')
- `orderData.recipient` (string, required): Wallet address to receive tokens
- `orderData.mint` (string, required): Token mint address
- `orderData.chain` (Chain, required): Blockchain network ('solana', 'ethereum', 'polygon')
- `orderData.token` (string, required): Verification token

**Returns:**

- `id` (string): Unique order identifier
- `accountNumber` (string): Bank account number for payment
- `accountName` (string): Bank account holder name
- `fiatAmount` (number): Order amount in fiat currency
- `bank` (string): Bank name

**Example:**

```typescript
import { createOrder } from "paj-ramp";

const order = await createOrder({
  fiatAmount: 10000,
  currency: "NGN",
  recipient: "wallet_address_here",
  mint: "token_mint_address_here",
  chain: "SOLANA",
  token: "token_from_verification",
});
// Response: { id: string, accountNumber: string, accountName: string, fiatAmount: number, bank: string }
```

### Basic Usage

```typescript
import { observeOrder } from "paj-ramp";

const observer = observeOrder({
  orderId: "your_order_id",
  onOrderUpdate: (data) => console.log(data),
});

// Connect manually
await observer.connect();

// Check connection status
console.log("Connected:", observer.isConnected());

// Disconnect manually: you could use setTimeout to keep the socket alive for a certain amount of time before you disconnect
observer.disconnect();
```

## Error Handling

The SDK provides comprehensive error handling:

```typescript
const observer = observeOrder({
  orderId: "your_order_id",
  onError: (error) => {
    // Handle connection errors, order not found, etc.
    console.error("Socket error:", error);
  },
});
```

Common error messages:

- `"Order not found: {orderId}"`
- `"Connection failed"`
- `"Socket timeout"`

### Usage Example

```typescript
import { observeOrder } from "paj-ramp";

async function example(orderId) {
  console.log("Observe Order");

  const observer = observeOrder({
    orderId,
    onOrderUpdate: (data) => {
      console.log("Order update received:", data);
      console.log("Status:", data.status);
      console.log("Amount:", data.amount);
      console.log("Currency:", data.currency);
    },
    onError: (error) => {
      console.error("Socket error:", error);
    },
    onConnect: () => {
      console.log("Connected to order socket");
    },
    onDisconnect: () => {
      console.log("Disconnected from order socket");
    },
    onConnectionStatusChange: (connected) => {
      console.log(
        "Connection status changed:",
        connected ? "Connected" : "Disconnected"
      );
    },
  });

  try {
    await observer.connect();
    console.log("Successfully connected to order observer");

    // Keep the connection alive for 1 minute
    setTimeout(() => {
      console.log("Disconnecting after 1 minute...");
      observer.disconnect();
    }, 1 * 60 * 1000);
  } catch (error) {
    console.error("Failed to connect:", error);
  }
}

const order = await createOrder({
  fiatAmount: 10000,
  currency: "NGN",
  recipient: "your_wallet_address",
  mint: "your_token_mint_address",
  chain: "SOLANA",
  token: token_from_verification,
});

await example(order.id);
// Response: { id: string, fiatAmount: string, currency: string, , recipient: string,  mint: string, chain: Chain, amount: number, status: OnRampStatus }
```

---

# Offramp SDK

## Overview

The Offramp SDK provides a set of functions to help users convert Solana-based digital assets to fiat and transfer the resulting funds to traditional bank accounts. It includes session management, rate queries, bank account management, and wallet operations.

## Usage Examples

### Get TX Pool Address

```typescript
import { getTXPoolAddress } from "paj-ramp";

const txpooladdress = await getTXPoolAddress();
// Response: { address: string }
```

### Get Rate

```typescript
import { getRate } from "paj-ramp";

const rate = await getRate();
// Response: { baseCurrency: string, targetCurrency: string, rate: number }
```

### Get Rate with Amount

```typescript
import { getRate } from "paj-ramp";

const rate = await getRate(50000);
// Response:
// {
//   rate: { baseCurrency: string, targetCurrency: string, rate: number },
//   amounts: { userTax: number, merchantTax: number, amountUSD: number, userAmountFiat: number }
// }
```

### Initiate Session

```typescript
import { initiate } from "paj-ramp";

const initialized = await initiate("your_email@gmail.com");
// Response: { email: string }
```

### Verify Session

```typescript
import { verify } from "paj-ramp";

const verified = await verify(
  "your_email@gmail.com",
  "1234",
  "device signature"
);
// Response: { email: string, isActive: string, expiresAt: string, token: string }
```

### Get Banks

```typescript
import { getBanks } from "paj-ramp";

const banks = await getBanks();
// Response: [ { id: string, name: string, country: string } ]
```

### Resolve Bank Account

```typescript
import { resolveBankAccount } from "paj-ramp";

const resolvedBankAccount = await resolveBankAccount(
  "bank id",
  "account number"
);
// Response: { accountName: string, accountNumber: string, bank: { id: string, name: string, code: string, country: string } }
```

### Add Bank Account

```typescript
import { addBankAccount } from "paj-ramp";

const addedBankAccount = await addBankAccount(
  "token",
  "bank id",
  "account number"
);
// Response: { id: string, accountName: string, accountNumber: string, bank: string }
```

### Get Bank Accounts

```typescript
import { getBankAccounts } from "paj-ramp";

const accounts = await getBankAccounts("token");
// Response: [ { id: string, accountName: string, accountNumber: string, bank: string } ]
```

### Get Wallet Info

```typescript
import { getWallet } from "paj-ramp";

const wallet = await getWallet("wallet public key");
// Response: { id: string, publicKey: string, bankAccount: { id: string, accountName: string, accountNumber: string, bank: string } }
```

### Add Wallet

```typescript
import { addWallet } from "paj-ramp";

const addedWallet = await addWallet("token", "bank account id", "secret key");
// Response: { id: string, publicKey: string, bankAccount: { id: string, accountName: string, accountNumber: string, bank: string } }
```

### Switch Bank Account on Wallet

```typescript
import { switchWalletBankAccount } from "paj-ramp";

const switchedWallet = await switchWalletBankAccount(
  "token",
  "bank account id to switch to",
  "wallet id",
  "secret key"
);
// Response: { id: string, publicKey: string, bankAccount: { id: string, accountName: string, accountNumber: string, bank: string } }
```

## License

MIT

## 🧑‍💻 Author

Gospel Chidiebube Chukwu
