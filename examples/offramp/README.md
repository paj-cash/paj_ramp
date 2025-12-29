# Basic Offramp Example

This example demonstrates a complete offramp flow using the PAJ Ramp SDK, where a user can sell crypto tokens for fiat currency.

## What This Example Shows

- 🔧 Initializing the SDK
- 📧 Session management (initiate and verify)
- 🏦 Fetching available banks
- 🔍 Resolving and verifying bank account details
- ➕ Adding bank account to user profile
- 💸 Creating an offramp order
- 📋 Handling order details and next steps

## Prerequisites

- Node.js 16 or higher
- A PAJ business API key
- A valid email address or phone number
- Your bank account details for receiving fiat
- Crypto tokens to sell
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
   - `ACCOUNT_NUMBER`: Your bank account number

4. **Run the example (first time to get OTP and see available banks):**

   ```bash
   npm start
   ```

5. **Add OTP and BANK_ID to `.env`:**
   The script will show available banks. Copy the bank ID you want to use:

   ```
   OTP=123456
   BANK_ID=your_bank_id_from_the_list
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

🏦 Fetching available banks...
✅ Found 15 banks
First few banks: GTBank, Access Bank, First Bank

🔍 Resolving bank account...
✅ Bank account verified!
Account Name: John Doe
Account Number: 1234567890
Bank: GTBank

➕ Adding bank account to profile...
✅ Bank account added to profile
Saved Account ID: abc123...

💸 Creating offramp order...

✅ Offramp order created successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Order Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Order ID: xyz789...
Status: INIT
Crypto Amount: 6.55
USDC Amount: 6.55
Fiat Amount: 10000 NGN
Rate: 1525
Recipient: 1234567890
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Next Steps:
1. Send 6.55 tokens to address: SoLxxx...
2. Your webhook will receive status updates
3. Once tokens are received and confirmed, fiat will be sent to your bank account
```

## How It Works

### 1. SDK Initialization

```javascript
initializeSDK("staging"); // or 'production'
```

### 2. Session Management

```javascript
const initiated = await initiate(email, apiKey);
const verified = await verify(email, otp, deviceInfo, apiKey);
```

### 3. Bank Account Setup

```javascript
// Get available banks
const banks = await getBanks(token);

// Verify account exists
const resolved = await resolveBankAccount(token, bankId, accountNumber);

// Save to profile
const added = await addBankAccount(token, bankId, accountNumber);
```

### 4. Create Offramp Order

```javascript
const order = await offRampCreateOrder(
  token,
  bankAccountId,
  accountNumber,
  "NGN",
  10000,
  tokenMint,
  webhookUrl
);
```

### 5. Send Tokens

Transfer the specified amount of tokens to the address provided in the order. The system will:

- Detect the token transfer
- Verify the transaction
- Send updates to your webhook
- Transfer fiat to your bank account

## Next Steps

- Check out the [webhook integration example](../webhook-integration) to see how to handle status updates
- See the [basic onramp example](../basic-onramp) for the reverse flow
- Read the [main documentation](../../README.md) for all available features

## Troubleshooting

### "OTP not found in .env file"

Run the script once without OTP to receive it via email, then add it to `.env`.

### "BANK_ID and ACCOUNT_NUMBER are required"

The script will list available banks. Choose one and add its ID to `.env`.

### "Bank account not found"

Verify that your account number is correct and belongs to the selected bank.

### "Invalid API key"

Ensure your `BUSINESS_API_KEY` is correct and active.

## Support

For issues or questions, please visit the [GitHub repository](https://github.com/paj-cash/paj_ramp).
