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
import { initializeSDK, Environment } from 'paj_ramp';

// Selects the environment you want to work with
initializeSDK(Environment.Production); // or Environment.Staging
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
import { verify } from 'paj_ramp';

// You can get otp by either adding your phone number or email address
// Phone number must start with a country code
const verified = await verify(
  'your_email@gmail.com', // or +2349053231563
  'otp',
  {
    uuid: string,
    device: string,
    //optionL ↓↓↓↓↓
    os: string, //IOS
    browser: string, //chrome
    ip: string,
  },
  'business_api_key'
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
import { getAllRate } from 'paj_ramp';

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
import { getRateByAmount } from 'paj_ramp';

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
import { getRateByType, RateType } from 'paj_ramp';

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
import { getTokenValue } from 'paj_ramp';

const tokenValue = await getTokenValue(50000, 'token_mint_address');
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
import { getBanks } from 'paj_ramp';

const banks = await getBanks('token');
// Response: [ { id: string, name: string, country: string } ]
```

**_Resolve Bank Account_**

```typescript
import { resolveBankAccount } from 'paj_ramp';

const resolvedBankAccount = await resolveBankAccount(
  'token',
  'bank_id',
  'account_number'
);
// Response: { accountName: string, accountNumber: string, bank: { id: string, name: string, code: string, country: string } }
```

**_Add Bank Account_**

```typescript
import { addBankAccount } from 'paj_ramp';

const addedBankAccount = await addBankAccount(
  'token',
  'bank_id',
  'account_number'
);
// Response: { id: string, accountName: string, accountNumber: string, bank: string }
```

**_Get Bank Accounts_**

```typescript
import { getBankAccounts } from 'paj_ramp';

const accounts = await getBankAccounts('token');
// Response: [ { id: string, accountName: string, accountNumber: string, bank: string } ]
```

### Transaction History:

**_Get All Transactions_**

```typescript
import { getAllTransactions } from 'paj_ramp';

const transactions = await getAllTransactions('token_from_verification');
/* Response: [{
id: string;
address: string;
mint: string;
currency: Currency;
amount: number;
usdcAmount: number;
fiatAmount: number;
sender: string;
receipient: string;
rate: number;
status: TransactionStatus;
transactionType: TransactionType;
createdAt: string | Date;
}]*/
```

**_Get Transaction_**

```typescript
import { getTransaction } from 'paj_ramp';

const transactions = await getTransaction(
  'token_from_verification',
  'transaction_id'
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
receipint: string;
rate: number;
status: TransactionStatus;
transactionType: TransactionType;
createdAt: string | Date;
}*/
```

## Offramp Webhook (Direct Offramp)

### Usage Example

```typescript
import { createOfframpOrder, Currency } from 'paj_ramp';

const createOrder = await createOfframpOrder(
  {
    bank: 'bank_id',
    accountNumber: 'account_number',
    currency: 'NGN' as Currency, // Currency
    amount: 10000, // amount
    mint: 'token_mint_address',
    webhookURL: 'webhook_url', // https://your-domain.com/webhook
  },
  'token'
);
/* Response: {
id: string,
address: string,
mint: string,
currency: Currency,
amount: number,
fiatAmount: number,
sender: string,
rate: number,
status: TransactionStatus,
transactionType: TransactionType
createdAt: string
}*/
```

## Onramp Webhook: Creates a new onramp order and sends status to the webhook url.

### Usage Example

```typescript
import { createOrder, Currency } from 'paj_ramp';

const order = await createOrder(
  {
    fiatAmount: 10000,
    currency: 'NGN' as Currency,
    recipient: 'wallet_address_here',
    mint: 'token_mint_address_here',
    chain: 'SOLANA', //ethereum, polygon, etc
    webhookURL: 'your_webhook_url', // https://your-domain.com/webhook
  },
  'token_from_verification'
);
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
  receipient: string;
  rate: number;
  status: TransactionStatus; // eg. INIT, PAID, COMPLETED
  transactionType: TransactionType; // ON_RAMP or OFF_RAMP
}
```

## SDK Reference

### Complete On-Ramp Flow Example

```typescript
import {
  initializeSDK,
  initiate,
  verify,
  createOnrampOrder,
  getTransaction,
  getAllTransactions,
  Environment,
} from 'paj_ramp';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  // Step 1: Initialize SDK
  console.log('🚀 Initializing PAJ Ramp SDK...');
  initializeSDK(Environment.Local);

  const email = process.env.USER_EMAIL!;
  const apiKey = process.env.BUSINESS_API_KEY!;
  const fiatAmount = parseInt(process.env.FIAT_AMOUNT!);
  const currency = process.env.CURRENCY!;
  const recipient = process.env.WALLET_ADDRESS!;
  const mint = process.env.TOKEN_MINT!;
  const webhookURL = process.env.WEBHOOK_URL!;

  try {
    // Step 2: Initiate session
    console.log('\n📧 Initiating session...');
    console.log('Email:', email);
    console.log('API Key:', apiKey);
    const initiated = await initiate(email, apiKey);
    console.log('✅ OTP sent to:', initiated.email || initiated.phone);

    // In a real application, you would wait for the user to receive and enter the OTP
    // For this example, we assume you have the OTP from your email
    console.log(
      '\n⏳ Please check your email for the OTP and add it to your .env file'
    );

    const otp = process.env.OTP;
    if (!otp) {
      console.error(
        '❌ OTP not found in .env file. Please add OTP=your_otp to .env'
      );
      process.exit(1);
    }

    // Step 3: Verify session
    console.log('\n🔐 Verifying session with OTP...');
    const verified = await verify(
      email,
      otp,
      {
        uuid: 'example-device-uuid-' + Date.now(),
        device: 'Desktop',
        os: 'MacOS',
        browser: 'Chrome',
      },
      apiKey
    );
    console.log('✅ Session verified successfully!');
    console.log(
      'Token (first 20 chars):',
      verified.token.substring(0, 20) + '...'
    );

    const sessionToken = verified.token;

    // Step 4: Create onramp order
    console.log('\n💰 Creating onramp order...');
    const order = await createOnrampOrder(
      {
        fiatAmount,
        currency,
        recipient,
        mint,
        chain: 'SOLANA',
        webhookURL,
      },
      sessionToken
    );

    console.log('\n✅ Order created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Order Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Order ID:', order.id);
    console.log('Account Number:', order.accountNumber);
    console.log('Account Name:', order.accountName);
    console.log(
      'Fiat Amount (to send):',
      order.fiatAmount,
      process.env.CURRENCY
    );
    console.log('Token Amount (to receive):', order.amount);
    console.log('Bank:', order.bank);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Step 5: Fetch the transaction details
    console.log('\n🔍 Fetching transaction details...');
    const transaction = await getTransaction(sessionToken, order.id);

    console.log('\n✅ Transaction fetched successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Transaction Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Transaction ID:', transaction.id);
    console.log('Status:', transaction.status);
    console.log('Type:', transaction.transactionType);
    console.log('Mint:', transaction.mint);
    console.log('Currency:', transaction.currency);
    console.log('Token Amount:', transaction.amount);
    console.log('USDC Amount:', transaction.usdcAmount);
    console.log('Fiat Amount:', transaction.fiatAmount);
    console.log('Rate:', transaction.rate);
    console.log('Recipient:', transaction.recipient);
    console.log('Created At:', transaction.createdAt);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Step 6: Fetch all transactions
    console.log('\n📜 Fetching all transactions...');
    const allTransactions = await getAllTransactions(sessionToken);

    console.log(`\n✅ Found ${allTransactions.length} transaction(s)!\n`);

    if (allTransactions.length > 0) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📋 All Transactions:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      allTransactions.forEach((tx, index) => {
        console.log(`\n${index + 1}. Transaction ID: ${tx.id}`);
        console.log(`   Status: ${tx.status}`);
        console.log(`   Type: ${tx.transactionType}`);
        console.log(`   Amount: ${tx.amount} (${tx.currency})`);
        console.log(`   Fiat: ${tx.fiatAmount}`);
        console.log(`   Created: ${tx.createdAt}`);
      });

      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

    console.log('\n📝 Next Steps:');
    console.log(
      '1. Transfer',
      order.fiatAmount,
      process.env.CURRENCY,
      'to the account number above'
    );
    console.log('2. Your webhook will receive status updates');
    console.log('3. Once payment is confirmed, you will receive tokens');
  } catch (error) {
    console.error(
      '\n❌ Error:',
      error instanceof Error ? error.message : String(error)
    );
    if (error && typeof error === 'object' && 'response' in error) {
      console.error('Response data:', (error as any).response.data);
    }
    process.exit(1);
  }
}

main();
```

### Complete Off-Ramp Flow Example

```typescript
import {
  initializeSDK,
  initiate,
  verify,
  getBanks,
  createOfframpOrder,
  Currency,
  Environment,
} from 'paj_ramp';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  // Step 1: Initialize SDK
  console.log('🚀 Initializing PAJ Ramp SDK...');
  initializeSDK(Environment.Local);

  const email = process.env.USER_EMAIL!;
  const apiKey = process.env.BUSINESS_API_KEY!;
  const accountNumber = process.env.ACCOUNT_NUMBER!;
  const bankId = process.env.BANK_ID!;
  const currency = process.env.CURRENCY! as Currency;
  const mint = process.env.TOKEN_MINT!;
  const webhookURL = process.env.WEBHOOK_URL!;

  try {
    // Step 2: Initiate session
    console.log('\n📧 Initiating session...');
    const initiated = await initiate(email, apiKey);
    console.log('✅ OTP sent to:', initiated.email || initiated.phone);

    const otp = process.env.OTP;
    if (!otp) {
      console.error(
        '❌ OTP not found in .env file. Please add OTP=your_otp to .env'
      );
      process.exit(1);
    }

    // Step 3: Verify session
    console.log('\n🔐 Verifying session with OTP...');
    const verified = await verify(
      email,
      otp,
      {
        uuid: 'example-device-uuid-' + Date.now(),
        device: 'Desktop',
        os: 'MacOS',
        browser: 'Chrome',
      },
      apiKey
    );
    console.log('✅ Session verified successfully!');

    const sessionToken = verified.token;

    // Step 4: Get available banks
    console.log('\n🏦 Fetching available banks...');
    const banks = await getBanks(sessionToken);
    console.log(`✅ Found ${banks.length} banks`);
    if (banks.length > 0) {
      console.log(
        'First few banks:',
        banks
          .slice(0, 3)
          .map(b => b.name)
          .join(', ')
      );
    }

    // Step 7: Create offramp order
    console.log('\n💸 Creating offramp order...');
    const order = await createOfframpOrder(
      {
        token: verified.token,
        bank: bankId,
        accountNumber,
        currency,
        amount: parseInt(process.env.TOKEN_AMOUNT || '1'),
        mint,
        webhookURL,
      },
      sessionToken
    );

    console.log('\n✅ Offramp order created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Order Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Order ID:', order.id);
    console.log('Address:', order.address);
    console.log('Mint:', order.mint);
    console.log('Token Amount (to pay):', order.amount);
    console.log('Fiat Amount (to receive):', order.fiatAmount);
    console.log('Rate:', order.rate);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    console.log('\n📝 Next Steps:');
    console.log('1. Send', order.amount, 'tokens to address:', order.address);
    console.log('2. Your webhook will receive status updates');
    console.log(
      '3. Once tokens are received and confirmed, fiat will be sent to your bank account'
    );
  } catch (error) {
    console.error(
      '\n❌ Error:',
      error instanceof Error ? error.message : String(error)
    );
    if (error && typeof error === 'object' && 'response' in error) {
      console.error('Response data:', (error as any).response.data);
    }
    process.exit(1);
  }
}

main();
```

## Other types

```typescript
import {
  // Chain, // SOLANA, etc
  TransactionStatus, // INIT, etc
  TransactionType, // ON_RAMP, etc
  Currency, // NGN
  Environment,
  RateType,
} from 'paj_ramp';
```

## License

MIT

## 🧑‍💻 Author

Gospel Chidiebube Chukwu
