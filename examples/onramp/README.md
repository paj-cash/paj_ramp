# Onramp Example

This example demonstrates a complete onramp flow using the PAJ Ramp SDK, where a user can purchase crypto tokens with fiat currency.

## What This Example Shows

- 🔧 Initializing the SDK with the correct environment
- 📧 Starting a user session with email/phone
- 🔐 Verifying the session with OTP
- 💰 Creating an onramp order
- 📋 Handling the bank account details for payment
- 🔍 Fetching transaction details
- 📜 Listing all transactions

## Prerequisites

- Node.js 16 or higher
- A PAJ business API key
- A valid email address or phone number
- A Solana wallet address
- A webhook endpoint (optional for testing)

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Copy the environment file:**

   ```bash
   cp .env.example .env
   ```

3. **Fill in your credentials in `.env`:**

   - `BUSINESS_API_KEY`: Your PAJ business API key
   - `USER_EMAIL`: Your email address
   - `WALLET_ADDRESS`: Your Solana wallet address
   - `TOKEN_MINT`: Token mint address (USDC provided as default)
   - `FIAT_AMOUNT`: Amount of fiat to spend (e.g. `10000`)
   - `CURRENCY`: Currency code (e.g. `NGN`)
   - `WEBHOOK_URL`: Your webhook endpoint

4. **Run the example (first time to get OTP):**

   ```bash
   npm start
   ```

5. **Check your email for the OTP and add it to `.env`:**

   ```
   OTP=123456
   ```

6. **Run again to complete the flow:**
   ```bash
   npm start
   ```

## Expected Output

```
🚀 Initializing PAJ Ramp SDK...

📧 Initiating session...
✅ OTP sent to: your_email@example.com

🔐 Verifying session with OTP...
✅ Session verified successfully!
Token (first 20 chars): eyJhbGciOiJIUzI1NiIs...

💰 Creating onramp order...

✅ Order created successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Order Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Order ID: 123abc...
Account Number: 1234567890
Account Name: PAJ CASH
Fiat Amount (to send): 10000 NGN
Token Amount (to receive): 6.55
Bank: GTBank
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Next Steps:
1. Transfer 10000 NGN to the account number above
2. Your webhook will receive status updates
3. Once payment is confirmed, you will receive tokens
```

## How It Works

### 1. SDK Initialization

```typescript
import { initializeSDK, Environment } from 'paj_ramp';

initializeSDK(Environment.Staging); // or Environment.Production
```

### 2. Session Initiation

The SDK sends an OTP to your email/phone:

```typescript
import { initiate } from 'paj_ramp';

const initiated = await initiate(email, apiKey);
```

### 3. Session Verification

User enters the OTP to verify their identity:

```typescript
import { verify } from 'paj_ramp';

const verified = await verify(email, otp, deviceInfo, apiKey);
const sessionToken = verified.token;
```

### 4. Order Creation

Create an onramp order with the verified session token:

```typescript
import { createOnrampOrder, Currency, Chain } from 'paj_ramp';

const order = await createOnrampOrder(
  {
    fiatAmount: 10000,
    currency: Currency.NGN,
    recipient: walletAddress,
    mint: tokenMint,
    chain: Chain.SOLANA,     // Chain.SOLANA or Chain.MONAD
    webhookURL: webhookUrl,
  },
  sessionToken
);
/* Response: {
  id: string,
  accountNumber: string,
  accountName: string,
  fiatAmount: number,
  bank: string
} */
```

### 5. Payment

Transfer the fiat amount to the provided bank account. The system will automatically:

- Detect the payment
- Send updates to your webhook
- Transfer tokens to your wallet

## Next Steps

- Check out the [webhook integration example](../webhook-integration) to see how to handle status updates
- See the [offramp example](../offramp) for the reverse flow
- Read the [main documentation](../../README.md) for all available features

## Troubleshooting

### "OTP not found in .env file"

Make sure you've added the OTP to your `.env` file after receiving it in your email.

### "Invalid API key"

Verify that your `BUSINESS_API_KEY` is correct and active.

### "Invalid wallet address"

Ensure your `WALLET_ADDRESS` is a valid Solana address.

## Support

For issues or questions, please visit the [GitHub repository](https://github.com/paj-cash/paj_ramp).
