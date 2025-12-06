# Webhook Integration Example

This example demonstrates a simplified webhook server that receives real-time order status updates from PAJ Ramp and can automatically create orders.

## What This Example Shows

- 🔗 Simple webhook endpoint to receive PAJ Ramp notifications
- 📡 Handling different order statuses (INIT, PAID, COMPLETED, FAILED, CANCELLED)
- 💾 In-memory order tracking
- 🚀 Automatic order creation on server startup

## Prerequisites

- Node.js 16 or higher
- A PAJ business API key
- A way to expose your local server to the internet (ngrok, localtunnel, or a deployed server)

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Copy the environment file:**

   ```bash
   cp .env.example .env
   ```

3. **Configure your .env file:**

   ```bash
   BUSINESS_API_KEY=your_business_api_key
   USER_EMAIL=your_email@example.com
   WALLET_ADDRESS=your_solana_wallet_address
   TOKEN_MINT=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
   FIAT_AMOUNT=10000
   CURRENCY=NGN
   ```

4. **Start the server:**

   ```bash
   npm start
   ```

   The server will start and request an OTP. Check your email, add the OTP to your `.env` file:

   ```bash
   OTP=123456
   ```

5. **Restart the server:**

   ```bash
   npm start
   ```

6. **Expose your server to the internet:**

   Using ngrok:

   ```bash
   ngrok http 3000
   ```

   Copy the ngrok URL (e.g., `https://abc123.ngrok.io`) and update `BASE_URL` in your `.env` file.

7. **Enable auto-order creation (optional):**

   ```bash
   AUTO_CREATE_ORDER=true
   ```

   When enabled, the server will automatically create an order on startup.

## The Webhook Endpoint

### POST `/webhook/paj-ramp`

This is the **only** endpoint in the server. It receives order status updates from PAJ Ramp.

**Request body (from PAJ Ramp):**

```json
{
  "id": "order_123",
  "status": "COMPLETED",
  "transactionType": "ON_RAMP",
  "amount": 6.55,
  "currency": "NGN",
  "fiatAmount": 10000,
  "rate": 1525
}
```

**Response:**

```json
{
  "received": true
}
```

## Creating Orders

The server includes a `createExampleOrder()` function that demonstrates the complete flow:

1. **Initiates** a session with PAJ
2. **Verifies** the session with OTP
3. **Creates** an onramp order with webhook URL
4. **Receives** webhook updates when order status changes

### Auto-Create on Startup

Set `AUTO_CREATE_ORDER=true` in your `.env` to automatically create an order when the server starts.

### Manual Creation

You can also call the function manually by importing it:

```javascript
import { createExampleOrder } from "./server.js";

// Call whenever you want to create an order
await createExampleOrder();
```

## Order Status Flow

```
INIT → PAID → COMPLETED
  ↓      ↓
CANCELLED  FAILED
```

### Status Meanings

- **INIT**: Order created, waiting for payment
- **PAID**: Payment received, processing transaction
- **COMPLETED**: Transaction completed successfully
- **FAILED**: Transaction failed (refund may be initiated)
- **CANCELLED**: Order cancelled by user or system

## Expected Console Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 PAJ Ramp Webhook Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Server running on http://localhost:3000
🔗 Webhook endpoint: http://localhost:3000/webhook/paj-ramp
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 Starting order creation example...

📧 Initiating session...
✅ OTP sent to: your@email.com

🔐 Verifying session...
✅ Session verified!

💰 Creating onramp order...
Webhook URL: https://abc123.ngrok.io/webhook/paj-ramp

✅ Order created successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Order ID: abc123
Account Number: 1234567890
Account Name: PAJ CASH
Fiat Amount: 10000 NGN
Bank: GTBank
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Transfer 10000 NGN to account: 1234567890
💡 Webhook updates will appear above when status changes

🔔 Webhook received!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Order ID: abc123
Status: PAID
Transaction Type: ON_RAMP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Payment received - processing transaction
```

## Testing Webhooks Locally

### Using curl:

```bash
curl -X POST http://localhost:3000/webhook/paj-ramp \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test_order_123",
    "status": "PAID",
    "transactionType": "ON_RAMP",
    "amount": 10,
    "currency": "NGN"
  }'
```

## Production Considerations

### Security

- ✅ Validate webhook signatures (if provided by PAJ Ramp)
- ✅ Use HTTPS in production
- ✅ Implement rate limiting
- ✅ Store sensitive data in environment variables

### Reliability

- ✅ Always respond with 200 OK quickly
- ✅ Process webhooks asynchronously
- ✅ Implement idempotency (handle duplicate webhooks)
- ✅ Use a database instead of in-memory storage
- ✅ Log all webhook events

### Deployment

Replace in-memory storage with a database:

```javascript
// Instead of Map
const orders = new Map();

// Use a database
import { MongoClient } from "mongodb";
// or
import pg from "pg";
```

## Next Steps

- Add database storage (MongoDB, PostgreSQL, etc.)
- Implement user notifications (email, SMS, push)
- Add webhook retry logic
- Deploy to production (Heroku, Railway, Vercel, AWS, etc.)
- See the [basic onramp](../basic-onramp) and [offramp](../basic-offramp) examples

## Troubleshooting

### Webhooks not being received

- Check that your server is publicly accessible via ngrok
- Verify the webhook URL is correct in your `.env`
- Make sure ngrok is still running

### OTP not received

- Check your email spam folder
- Verify your `USER_EMAIL` is correct
- Ensure your `BUSINESS_API_KEY` is valid

### Order creation fails

- Verify all required fields in `.env` are filled
- Check that your wallet address is valid
- Ensure you're using the correct token mint address

## Support

For issues or questions, please visit the [GitHub repository](https://github.com/paj-cash/paj_ramp).
