# Webhook Integration Example

This example demonstrates how to set up a webhook server to receive real-time order status updates from PAJ Ramp using Express.js.

## What This Example Shows

- 🔗 Setting up webhook endpoints to receive PAJ Ramp notifications
- 📡 Handling different order statuses (INIT, PAID, COMPLETED, FAILED, CANCELLED)
- 💾 Storing and tracking order updates
- 🌐 Creating a REST API to query order status
- 🔧 Best practices for webhook security and reliability

## Prerequisites

- Node.js 16 or higher
- A way to expose your local server to the internet (ngrok, localtunnel, or a deployed server)
- Optional: PAJ business API key (if you want to create orders from this server)

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Copy the environment file:**

   ```bash
   cp .env.example .env
   ```

3. **Start the server:**

   ```bash
   npm start
   ```

   For development with auto-reload:

   ```bash
   npm run dev
   ```

4. **Expose your server to the internet:**

   Using ngrok:

   ```bash
   ngrok http 3000
   ```

   Copy the ngrok URL (e.g., `https://abc123.ngrok.io`) and update `BASE_URL` in your `.env` file.

5. **Use the webhook URL when creating orders:**
   ```
   https://abc123.ngrok.io/webhook/paj-ramp
   ```

## API Endpoints

### POST `/webhook/paj-ramp`

Receives order status updates from PAJ Ramp.

**Request body (from PAJ Ramp):**

```json
{
  "id": "order_123",
  "address": "SolanaAddress...",
  "signature": "transaction_signature",
  "mint": "token_mint_address",
  "currency": "NGN",
  "amount": 6.55,
  "usdcAmount": 6.55,
  "fiatAmount": 10000,
  "sender": "sender_address",
  "receipiant": "recipient_address",
  "rate": 1525,
  "status": "COMPLETED",
  "transactionType": "ON_RAMP"
}
```

**Response:**

```json
{
  "received": true
}
```

### GET `/orders`

List all received orders.

**Response:**

```json
{
  "total": 5,
  "orders": [...]
}
```

### GET `/orders/:orderId`

Get details for a specific order.

**Response:**

```json
{
  "id": "order_123",
  "status": "COMPLETED",
  "lastUpdated": "2024-12-04T00:00:00.000Z",
  ...
}
```

### POST `/create-onramp-order`

Create a new onramp order (example endpoint).

**Request:**

```json
{
  "fiatAmount": 10000,
  "currency": "NGN",
  "recipient": "wallet_address",
  "mint": "token_mint",
  "chain": "SOLANA",
  "token": "verified_session_token"
}
```

### GET `/health`

Health check endpoint.

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

📝 Next steps:
1. Expose this server to the internet using ngrok or similar
2. Use the public URL as your webhook URL when creating orders
3. Monitor this console for webhook events

🔔 Webhook received!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Order ID: abc123
Status: PAID
Transaction Type: ON_RAMP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Payment received - processing transaction
```

## How It Works

### 1. Server Setup

```javascript
const app = express();
app.use(express.json());
```

### 2. Webhook Handler

```javascript
app.post("/webhook/paj-ramp", (req, res) => {
  const orderUpdate = req.body;

  // Process the update
  handleOrderUpdate(orderUpdate);

  // Always respond 200 OK
  res.status(200).json({ received: true });
});
```

### 3. Status Processing

```javascript
switch (orderUpdate.status) {
  case "PAID":
    // Notify user, update database
    break;
  case "COMPLETED":
    // Mark order complete, release goods
    break;
  // ... handle other statuses
}
```

## Testing Webhooks

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

### Check order status:

```bash
curl http://localhost:3000/orders/test_order_123
```

## Production Considerations

### Security

- ✅ Validate webhook signatures (if provided by PAJ Ramp)
- ✅ Use HTTPS in production
- ✅ Implement rate limiting
- ✅ Add authentication for admin endpoints

### Reliability

- ✅ Always respond with 200 OK quickly
- ✅ Process webhooks asynchronously
- ✅ Implement idempotency (handle duplicate webhooks)
- ✅ Log all webhook events

### Example with signature verification:

```javascript
app.post("/webhook/paj-ramp", (req, res) => {
  // Verify signature
  const signature = req.headers["x-paj-signature"];
  if (!verifySignature(req.body, signature)) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  // Respond immediately
  res.status(200).json({ received: true });

  // Process asynchronously
  processWebhook(req.body).catch(console.error);
});
```

## Next Steps

- Add database storage (MongoDB, PostgreSQL, etc.)
- Implement user notifications (email, SMS, push)
- Add webhook retry logic
- Deploy to production (Heroku, Railway, AWS, etc.)
- See the [basic onramp](../basic-onramp) and [offramp](../basic-offramp) examples for creating orders

## Troubleshooting

### Webhooks not being received

- Check that your server is publicly accessible
- Verify the webhook URL is correct
- Check firewall settings

### Duplicate webhooks

- Implement idempotency using order ID
- Store processed webhook IDs

### Server crashes

- Add error handling and logging
- Use process managers like PM2
- Implement health checks

## Support

For issues or questions, please visit the [GitHub repository](https://github.com/paj-cash/paj_ramp).
