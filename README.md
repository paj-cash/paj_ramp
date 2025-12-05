# PAJ Ramp SDK

A comprehensive SDK for PAJ Ramp onramp and offramp operations with real-time transaction updates using webhooks.

## Installation

```bash
npm install paj_ramp
```

```bash
yarn add paj_ramp
```

## Getting Started

### Initialize SDK (select environment: "staging" | "production")

```typescript
import { initializeSDK } from "paj_ramp";

// Selects the environment you want to work with
initializeSDK("staging"); // or production
```

### Initiate Session

```typescript
import { initiate } from 'paj_ramp';

// You can get otp by either adding your phone number or email address
// Phone number must start with a country code
const initiated = await initiate(
  'your_email@gmail.com' // +2349053231563
  'business_api_key'
  );
// Response: { email?: string, phone?: string}
```

### Verify Session

```typescript
import { verify } from "paj_ramp";

// You can get otp by either adding your phone number or email address
// Phone number must start with a country code
const verified = await verify(
  "your_email@gmail.com", // or +2349053231563
  "otp",
  {
    uuid: string,
    device: string,
    //optionL ↓↓↓↓↓
    os: string, //IOS
    browser: string, //chrome
    ip: string,
  },
  "business_api_key"
);
/* Response: {
email?: string,
phone?: string,
isActive: string,
expiresAt: string,
token: string 
} */
```

## 📚 Examples

Check out our [examples directory](./examples) for complete, runnable examples:

- **[Basic Onramp](./examples/basic-onramp)** - Simple onramp transaction flow showing how users can buy crypto with fiat
- **[Basic Offramp](./examples/basic-offramp)** - Simple offramp transaction flow showing how users can sell crypto for fiat
- **[Webhook Integration](./examples/webhook-integration)** - Express server with webhook handling for real-time order updates

Each example includes its own README with detailed setup instructions. Perfect for understanding how to integrate PAJ Ramp into your application!

```bash
cd examples/basic-onramp
npm install
cp .env.example .env
# Edit .env with your credentials
npm start
```

## Utility Endpoints

### Handle Rate:

**_Get All Rate_**

```typescript
import { getAllRate } from "paj_ramp";

const rate = await getAllRate();
/*
Response:
{
    "onRampRate": {
        "baseCurrency": "USD",
        "targetCurrency": "NGN",
        "isActive": true,
        "rate": 1510,
        "type": "onRamp"
    },
    "offRampRate": {
        "baseCurrency": "USD",
        "targetCurrency": "NGN",
        "isActive": true,
        "rate": 1525,
        "type": "offRamp"
    }
}*/
```

**_Get Rate by Amount_**

```typescript
import { getRateByAmount } from "paj_ramp";

const rate = await getRateByAmount(50000);
/*
Response:
{
 rate: {
  baseCurrency: string,
  targetCurrency: string,
  rate: number
  },
 amounts: {
  userTax": number,
  merchantTax": number,
  amountUSD": number,
  userAmountFiat": number
  }
}*/
```

**_Get Rate by Rate Type_**

```typescript
import { getRateByType, RateType } from "paj_ramp";

const rate = await getRateByType(RateType.offRamp); // or RateType.onRamp

/*
Response:
"offRampRate": {
  "baseCurrency": "USD",
  "targetCurrency": "NGN",
  "isActive": true,
  "rate": 1525,
  "type": "offRamp"
}*/
```

**_Get Token Value from Amount and Mint Token_**

```typescript
import { getTokenValue } from "paj_ramp";

const tokenValue = await getTokenValue(50000, "token_mint_address");
/*
Response:
{
  amount: number,        // requested token amount
  usdcValue: number,     // USDC value of the token amount
  mint: string           // token mint address
}
*/
```

### Handle Banks:

**_Get Banks_**

```typescript
import { getBanks } from "paj_ramp";

const banks = await getBanks("token");
// Response: [ { id: string, name: string, country: string } ]
```

**_Resolve Bank Account_**

```typescript
import { resolveBankAccount } from "paj_ramp";

const resolvedBankAccount = await resolveBankAccount(
  "token",
  "bank_id",
  "account_number"
);
// Response: { accountName: string, accountNumber: string, bank: { id: string, name: string, code: string, country: string } }
```

**_Add Bank Account_**

```typescript
import { addBankAccount } from "paj_ramp";

const addedBankAccount = await addBankAccount(
  "token",
  "bank_id",
  "account_number"
);
// Response: { id: string, accountName: string, accountNumber: string, bank: string }
```

**_Get Bank Accounts_**

```typescript
import { getBankAccounts } from "paj_ramp";

const accounts = await getBankAccounts("token");
// Response: [ { id: string, accountName: string, accountNumber: string, bank: string } ]
```

### Transaction History:

**_Get All Transactions_**

```typescript
import { getAllTransactions } from "paj_ramp";

const transactions = await getAllTransactions("token_from_verification");
/* Response: [{
id: string;
address: string;
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
createdAt: string | Date;
}]*/
```

**_Get Transaction_**

```typescript
import { getTransaction } from "paj_ramp";

const transactions = await getTransaction(
  "token_from_verification",
  "transaction_id"
);
/* Response: {
id: string;
address: string;
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
createdAt: string | Date;
}*/
```

## Offramp Webhook (Direct Offramp)

### Usage Example

```typescript
import { offRampCreateOrder } from 'paj_ramp';

const createOrder = await offRampCreateOrder(
  'token',
  'bank_id',
  'account_number',
  'NGN', // Currency
  10000, // amount
  'token_mint_address'
  'webhook_url'
);
/* Response: {
id: string,
address: string,
signature?: string,
mint: string,
currency: Currency,
amount: number,
usdcAmount: number,
fiatAmount: number,
sender: string,
receipiant: string,
rate: number,
status: TransactionStatus,
transactionType: TransactionType
}*/
```

## Onramp Webhook: Creates a new onramp order and sends status to the webhook url.

### Usage Example

```typescript
import { createOrder } from "paj_ramp";

const order = await createOrder({
  fiatAmount: 10000,
  currency: "NGN",
  recipient: "wallet_address_here",
  mint: "token_mint_address_here",
  chain: "SOLANA", //ethereum, polygon, etc
  webhookURL: "your_webhook_url",
  token: "token_from_verification",
});
// Response: { id: string, accountNumber: string, accountName: string, fiatAmount: number, bank: string }
```

## Webhook Response Data Structure

### For both onramp and offramp

```typescript
{
  id: string;
  address: string;
  signature?: string;
  mint: string;
  currency: Currency; // eg. NGN, USD
  amount: number;
  usdcAmount: number;
  fiatAmount: number;
  sender: string;
  receipiant: string;
  rate: number;
  status: TransactionStatus; // eg. INIT, PAID, COMPLETED
  transactionType: TransactionType; // ON_RAMP or OFF_RAMP
}
```

## Other types

```typescript
import {
  // Chain, // SOLANA, etc
  TransactionStatus, // INIT, etc
  TransactionType, // ON_RAMP, etc
  Currency, // NGN
} from "paj_ramp";
```

<!--
## Quick Start

### Real-time Order Observation

The SDK provides Socket.IO functionality to observe onramp orders in real-time:

```typescript
import { observeOrder } from 'paj_ramp';

// Using observeOrder function
const observer = observeOrder({
  orderId: 'your_order_id',
  onOrderUpdate: data => {
    console.log('Order update:', data);
    // Handle status changes: pending, processing, completed, failed, cancelled
  },
  onError: error => {
    console.error('Socket error:', error);
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

**Example:**

```typescript
import { observeOrder } from 'paj_ramp';

const observer = observeOrder({
  orderId: 'your_order_id',
  onOrderUpdate: data => console.log(data),
});

// Connect manually
await observer.connect();

// Check connection status
console.log('Connected:', observer.isConnected());

// Disconnect manually: you could use setTimeout to keep the socket alive for a certain amount of time before you disconnect
observer.disconnect();
```

## Error Handling

The SDK provides comprehensive error handling:

```typescript
const observer = observeOrder({
  orderId: 'your_order_id',
  onError: error => {
    // Handle connection errors, order not found, etc.
    console.error('Socket error:', error);
  },
});
```

Common error messages:

- `"Order not found: {orderId}"`
- `"Connection failed"`
- `"Socket timeout"`

### Usage Example

```typescript
import { observeOrder, createOrder } from 'paj_ramp';

async function example(orderId) {
  console.log('Observe Order');

  const observer = observeOrder({
    orderId,
    onOrderUpdate: data => {
      console.log('Order update received:', data);
      console.log('Status:', data.status);
      console.log('Amount:', data.amount);
      console.log('Currency:', data.currency);
    },
    onError: error => {
      console.error('Socket error:', error);
    },
    onConnect: () => {
      console.log('Connected to order socket');
    },
    onDisconnect: () => {
      console.log('Disconnected from order socket');
    },
    onConnectionStatusChange: connected => {
      console.log(
        'Connection status changed:',
        connected ? 'Connected' : 'Disconnected'
      );
    },
  });

  try {
    await observer.connect();
    console.log('Successfully connected to order observer');

    // Keep the connection alive for 1 minute
    setTimeout(() => {
      console.log('Disconnecting after 1 minute...');
      observer.disconnect();
    }, 1 * 60 * 1000);
  } catch (error) {
    console.error('Failed to connect:', error);
  }
}

const order = await createOrder({
  fiatAmount: 10000,
  currency: 'NGN',
  recipient: 'your_wallet_address',
  mint: 'your_token_mint_address',
  chain: 'SOLANA',
  webhookURL: 'webhook_url',
  token: token_from_verification,
});

await example(order.id);
// Response: { id: string, fiatAmount: string, currency: string, , recipient: string,  mint: string, chain: Chain, amount: number, status: OnRampStatus }
``` -->

---

## License

MIT

## 🧑‍💻 Author

Gospel Chidiebube Chukwu
