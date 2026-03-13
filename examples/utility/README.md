# PAJ Ramp - Utility Functions Example

This example demonstrates how to use the PAJ Ramp SDK's utility functions for fetching banks, converting between token amounts and fiat values, and more.

## Features

- **getBanks**: Fetch the list of supported banks
- **getTokenValue**: Convert a fiat amount to its token equivalent
- **getFiatValue**: Convert a token amount to its fiat equivalent
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
   - The script will display available banks
   - Token-to-fiat conversions
   - Fiat-to-token conversions

## What This Example Does

1. **Initializes** the PAJ Ramp SDK
2. **Authenticates** using email and OTP verification
3. **Fetches banks** - lists the first 3 available banks with name, code, country, and logo
4. **Fetches token value** - converts a fiat amount to its token equivalent
5. **Fetches fiat value** - converts a token amount to its fiat equivalent
6. **Displays** all conversion results

## Functions Used

### getBanks

```typescript
import { getBanks } from 'paj_ramp';

const banks = await getBanks(sessionToken);
// Response: [ { id: string, code: string, name: string, logo: string, country: string } ]
```

### getTokenValue

```typescript
import { getTokenValue, Currency } from 'paj_ramp';

const tokenValueResult = await getTokenValue(
  {
    amount: 50000,              // fiat amount
    mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    currency: Currency.NGN,
  },
  sessionToken
);
// Response: { amount: number, mint: string, currency: string }
```

### getFiatValue

```typescript
import { getFiatValue, Currency } from 'paj_ramp';

const fiatValueResult = await getFiatValue(
  {
    amount: 100,                // token amount
    mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    currency: Currency.NGN,
  },
  sessionToken
);
// Response: { amount: number, mint: string, currency: string, fiatAmount: number }
```

## Expected Output

```
🚀 Initializing PAJ Ramp SDK...

📧 Initiating session...
Email: your-email@example.com
✅ OTP sent to: your-email@example.com

🔐 Verifying session with OTP...
✅ Session verified successfully!

🏦 Fetching available banks...
✅ Found 25 banks
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 First 3 Banks:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. GTBank (058) - NG
   Logo: https://...
2. Access Bank (044) - NG
   Logo: https://...
3. First Bank (011) - NG
   Logo: https://...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 Getting onramp value...

✅ Onramp value fetched successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Onramp Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Token Amount: 6.55
Mint: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
Currency: NGN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💵 Getting offramp value...

✅ Offramp value fetched successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Offramp Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Token Amount: 100
Mint: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
Currency: NGN
Fiat Value: 152500 NGN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ Summary:
• 1010 NGN = 6.55 USDC
• 1000 USDC = 152500 NGN
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
