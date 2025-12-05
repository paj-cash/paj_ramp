import express from "express";
import { initializeSDK, createOrder } from "paj_ramp";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory storage for demo purposes
// In production, use a database
const orders = new Map();

/**
 * Webhook endpoint to receive order status updates from PAJ Ramp
 * This endpoint will be called whenever an order status changes
 */
app.post("/webhook/paj-ramp", (req, res) => {
  const orderUpdate = req.body;

  console.log("\n🔔 Webhook received!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Order ID:", orderUpdate.id);
  console.log("Status:", orderUpdate.status);
  console.log("Transaction Type:", orderUpdate.transactionType);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Full data:", JSON.stringify(orderUpdate, null, 2));

  // Store order update
  orders.set(orderUpdate.id, {
    ...orderUpdate,
    lastUpdated: new Date().toISOString(),
  });

  // Handle different statuses
  switch (orderUpdate.status) {
    case "INIT":
      console.log("📝 Order initialized - waiting for payment");
      // You might want to notify the user that their order is created
      break;

    case "PAID":
      console.log("💰 Payment received - processing transaction");
      // Update your database, notify user that payment was detected
      break;

    case "COMPLETED":
      console.log("✅ Transaction completed successfully!");
      // Notify user that they received their tokens/fiat
      // Update order status in your database
      break;

    case "FAILED":
      console.log("❌ Transaction failed");
      // Notify user, handle refund if necessary
      break;

    case "CANCELLED":
      console.log("🚫 Transaction cancelled");
      // Update your records
      break;

    default:
      console.log("ℹ️ Unknown status:", orderUpdate.status);
  }

  // Always respond with 200 OK to acknowledge receipt
  res.status(200).json({ received: true });
});

/**
 * Endpoint to get order status
 */
app.get("/orders/:orderId", (req, res) => {
  const { orderId } = req.params;
  const order = orders.get(orderId);

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  res.json(order);
});

/**
 * Endpoint to list all orders
 */
app.get("/orders", (req, res) => {
  const allOrders = Array.from(orders.values());
  res.json({
    total: allOrders.length,
    orders: allOrders,
  });
});

/**
 * Health check endpoint
 */
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    totalOrders: orders.size,
  });
});

/**
 * Example endpoint that creates an onramp order
 * In production, this would be protected and require authentication
 */
app.post("/create-onramp-order", async (req, res) => {
  try {
    initializeSDK(process.env.ENVIRONMENT || "staging");

    const { fiatAmount, currency, recipient, mint, chain, token } = req.body;

    // Validate required fields
    if (!fiatAmount || !currency || !recipient || !mint || !token) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["fiatAmount", "currency", "recipient", "mint", "token"],
      });
    }

    // Create webhook URL
    const webhookURL = `${process.env.BASE_URL}/webhook/paj-ramp`;

    console.log("\n💰 Creating onramp order...");
    console.log("Webhook URL:", webhookURL);

    const order = await createOrder({
      fiatAmount,
      currency,
      recipient,
      mint,
      chain: chain || "SOLANA",
      webhookURL,
      token,
    });

    // Store initial order
    orders.set(order.id, {
      ...order,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    });

    console.log("✅ Order created:", order.id);

    res.status(201).json(order);
  } catch (error) {
    console.error("❌ Error creating order:", error.message);
    res.status(500).json({
      error: "Failed to create order",
      message: error.message,
    });
  }
});

/**
 * Root endpoint with API documentation
 */
app.get("/", (req, res) => {
  res.json({
    name: "PAJ Ramp Webhook Integration Example",
    version: "1.0.0",
    endpoints: {
      "POST /webhook/paj-ramp": "Receive order status updates from PAJ Ramp",
      "POST /create-onramp-order": "Create a new onramp order",
      "GET /orders": "List all orders",
      "GET /orders/:orderId": "Get specific order details",
      "GET /health": "Health check",
    },
    documentation: "See README.md for more details",
  });
});

// Start server
app.listen(PORT, () => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🚀 PAJ Ramp Webhook Server");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🔗 Webhook endpoint: http://localhost:${PORT}/webhook/paj-ramp`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n📝 Next steps:");
  console.log("1. Expose this server to the internet using ngrok or similar");
  console.log("2. Use the public URL as your webhook URL when creating orders");
  console.log("3. Monitor this console for webhook events\n");
});
