# PAJ Ramp - Utility Functions Example

This example demonstrates how to use the PAJ Ramp SDK's utility functions for converting between token amounts and fiat values.

## Features

- **getTokenValue**: Convert token amounts to their fiat equivalent
- **getFiatValue**: Convert fiat amounts to their token equivalent
- Authentication flow (initiate & verify)

## Prerequisites

- Node.js (v16 or higher)
- A valid PAJ Ramp business API key
- A registered email address

## Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Configure environment variables**:

   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` file** with your credentials:
   ```env
   USER_EMAIL=your-email@example.com
   BUSINESS_API_KEY=your-business-api-key
   TOKEN_MINT=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
   CURRENCY=NGN
   ```

## Running the Example

1. **Start the example**:

   ```bash
   npm start
   ```

2. **Follow the prompts**:

   - An OTP will be sent to your email
   - Add the OTP to your `.env` file: `OTP=123456`
   - Run the script again

3. **View the results**:
   - The script will display token-to-fiat conversions
   - And fiat-to-token conversions

## What This Example Does

1. **Initializes** the PAJ Ramp SDK
2. **Authenticates** using email and OTP verification
3. **Fetches token value** - converts 100 tokens to fiat currency
4. **Fetches fiat value** - converts 1000 currency units to token amount
5. **Displays** both conversion results

## Functions Used

### getTokenValue

```typescript
const tokenValueResult = await getTokenValue(
  {
    amount: tokenAmount,
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    currency: Currency.NGN,
  },
  sessionToken
);
```

### getFiatValue

```typescript
const fiatValueResult = await getFiatValue(
  {
    amount: fiatAmount,
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    currency: Currency.NGN,
  },
  sessionToken
);
```

## Expected Output

```
🚀 Initializing PAJ Ramp SDK...

📧 Initiating session...
Email: your-email@example.com
✅ OTP sent to: your-email@example.com

🔐 Verifying session with OTP...
✅ Session verified successfully!

💰 Getting token value...

✅ Token value fetched successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Token Value Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Token Amount: 100
Mint: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
Currency: NGN
Fiat Value: 150000 NGN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💵 Getting fiat value...

✅ Fiat value fetched successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Fiat Value Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Fiat Amount: 1000
Mint: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
Currency: NGN
Fiat Value: 1000 NGN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ Summary:
• 100 tokens = 150000 NGN
• 1000 NGN = 1000 (fiat equivalent)
```

## Troubleshooting

- **OTP not received**: Check your spam folder or contact support
- **Invalid API key**: Verify your business API key is correct
- **Connection errors**: Ensure you have internet connectivity
- **Token mint issues**: Verify the token mint address is valid on Solana

## Next Steps

- Integrate these utility functions into your application
- Use them for price quotes before creating orders
- Display real-time conversion rates to your users
