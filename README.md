# PAJ Ramp SDK

A comprehensive SDK for PAJ Ramp onramp and offramp operations with real-time transaction updates using Socket.IO.

## Features

- **Onramp Operations**: Create orders and observe real-time updates
- **Offramp Operations**: Complete offramp workflow with bank account management
- **Real-time Updates**: Socket.IO integration for live transaction status updates
- **TypeScript Support**: Full TypeScript definitions included
- **Multiple Environments**: Support for both staging and production environments
- **Functional API**: Clean functional approach for better composability

## Installation

```bash
npm install paj-ramp
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

// Method 1: Using observeOrder function
const observer = observeOrder({
  orderId: "your-order-id",
  environment: "staging", // or 'main' for production
  onOrderUpdate: (data) => {
    console.log("Order update:", data);
    // Handle status changes: pending, processing, completed, failed, cancelled
  },
  onError: (error) => {
    console.error("Socket error:", error);
  },
});

await observer.connect();

// Method 2: Using createOrderObserver (simpler)
const observer = await createOrderObserver("your-order-id", "staging", {
  onOrderUpdate: (data) => {
    console.log("Order update:", data);
    if (data.status === "completed") {
      observer.disconnect();
    }
  },
});

// Method 3: Using createOnRampSocket directly
const socket = createOnRampSocket({
  orderId: "your-order-id",
  environment: "main",
  onOrderUpdate: (data) => console.log("Update:", data),
  onError: (error) => console.error("Error:", error),
});

await socket.connect();
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
  amount: number;
  status: OnRampStatus; // enum: 'pending', 'processing', 'completed', 'failed', 'cancelled'
}
```

### Socket Events

The SDK listens for these Socket.IO events:

- **ORDER_UPDATE**: Real-time order status updates
- **ERROR**: Error messages from the server

### Environment Configuration

- **Staging**: `https://onramp-staging.paj.cash/onramp-socket`
- **Production**: `https://onramp.paj.cash/onramp-socket`

## API Reference

### observeOrder(options)

Creates an order observer with manual connection control.

**Parameters:**

- `options.orderId` (string, required): The order ID to observe
- `options.environment` ('main' | 'staging', optional): Environment to use
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

### createOrderObserver(orderId, environment, callbacks)

Creates and automatically connects an order observer.

**Parameters:**

- `orderId` (string, required): The order ID to observe
- `environment` ('main' | 'staging', optional): Environment to use
- `callbacks` (object, optional): Callback functions

**Returns:** Promise that resolves to the observer object

### createOnRampSocket(options)

Creates a raw Socket.IO instance for direct control.

**Parameters:**

- `options.orderId` (string, required): The order ID to observe
- `options.environment` ('main' | 'staging', optional): Environment to use
- `options.onOrderUpdate` (function, optional): Callback for order updates
- `options.onError` (function, optional): Callback for errors

**Returns:** Object with socket control methods

## Examples

See the `examples/observe-order-example.ts` file for complete usage examples.

### Basic Usage

```typescript
import { createOrderObserver } from "paj-ramp";

const observer = await createOrderObserver("order-123", "staging", {
  onOrderUpdate: (data) => {
    switch (data.status) {
      case "pending":
        console.log("Order is pending...");
        break;
      case "processing":
        console.log("Order is being processed...");
        break;
      case "completed":
        console.log("Order completed!");
        observer.disconnect();
        break;
      case "failed":
        console.log("Order failed");
        observer.disconnect();
        break;
    }
  },
  onError: (error) => {
    console.error("Error:", error);
  },
});
```

### Direct Socket Usage

```typescript
import { createOnRampSocket } from "paj-ramp";

const socket = createOnRampSocket({
  orderId: "order-123",
  environment: "main",
  onOrderUpdate: (data) => console.log("Update:", data),
  onError: (error) => console.error("Error:", error),
});

await socket.connect();
console.log("Connected:", socket.isConnected());
socket.disconnect();
```

### Manual Connection Management

```typescript
import { observeOrder } from "paj-ramp";

const observer = observeOrder({
  orderId: "order-123",
  environment: "main",
  onOrderUpdate: (data) => console.log(data),
});

// Connect manually
await observer.connect();

// Check connection status
console.log("Connected:", observer.isConnected());

// Disconnect manually
observer.disconnect();
```

## Error Handling

The SDK provides comprehensive error handling:

```typescript
const observer = observeOrder({
  orderId: "order-123",
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

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Development mode with watch
npm run dev
```

## License

MIT

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

---

## 🧑‍💻 Author

Gospel Chidiebube Chukwu


