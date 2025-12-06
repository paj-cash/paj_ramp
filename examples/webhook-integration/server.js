import express from "express";
import { initializeSDK, initiate, verify, createOnrampOrder } from "paj_ramp";
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

  // Store or update order
  orders.set(orderUpdate.id, {
    ...orderUpdate,
    lastUpdated: new Date().toISOString(),
  });

  // Handle different statuses
  switch (orderUpdate.status) {
    case "INIT":
      console.log("📝 Order initialized - waiting for payment");
      break;

    case "PAID":
      console.log("💰 Payment received - processing transaction");
      break;

    case "COMPLETED":
      console.log("✅ Transaction completed successfully!");
      break;

    case "FAILED":
      console.log("❌ Transaction failed");
      break;

    case "CANCELLED":
      console.log("🚫 Transaction cancelled");
      break;

    default:
      console.log("ℹ️ Unknown status:", orderUpdate.status);
  }

  // Always respond with 200 OK to acknowledge receipt
  res.status(200).json({ received: true });
});

/**
 * Example function to create an order
 * This demonstrates how to create an order with proper webhook integration
 */
async function createExampleOrder() {
  try {
    console.log("\n🚀 Starting order creation example...\n");

    // Initialize SDK
    initializeSDK(process.env.ENVIRONMENT || "staging");

    const email = process.env.USER_EMAIL;
    const apiKey = process.env.BUSINESS_API_KEY;

    if (!email || !apiKey) {
      console.error("❌ Missing USER_EMAIL or BUSINESS_API_KEY in .env");
      return;
    }

    // Step 1: Initiate session
    console.log("📧 Initiating session...");
    await initiate(email, apiKey);
    console.log("✅ OTP sent to:", email);

    const otp = process.env.OTP;
    if (!otp) {
      console.log("\n⏳ Please add OTP to .env file and restart the server");
      return;
    }

    // Step 2: Verify session
    console.log("\n🔐 Verifying session...");
    const verified = await verify(
      email,
      otp,
      {
        uuid: "webhook-server-" + Date.now(),
        device: "Server",
        os: "Node.js",
        browser: "Express",
      },
      apiKey
    );
    console.log("✅ Session verified!");

    // Step 3: Create order with webhook
    const webhookURL = `${process.env.BASE_URL}/webhook/paj-ramp`;

    console.log("\n💰 Creating onramp order...");
    console.log("Webhook URL:", webhookURL);

    console.log({ webhookURL });
    const order = await createOnrampOrder(
      {
        fiatAmount: parseInt(process.env.FIAT_AMOUNT || "10000"),
        currency: process.env.CURRENCY || "NGN",
        recipient: process.env.WALLET_ADDRESS,
        mint: process.env.TOKEN_MINT,
        chain: "SOLANA",
        webhookURL,
      },
      verified.token
    );

    // Store order
    orders.set(order.id, {
      ...order,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    });

    console.log("\n✅ Order created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Order ID:", order.id);
    console.log("Account Number:", order.accountNumber);
    console.log("Account Name:", order.accountName);
    console.log("Fiat Amount:", order.fiatAmount, process.env.CURRENCY);
    console.log("Bank:", order.bank);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(
      "\n📝 Transfer",
      order.fiatAmount,
      process.env.CURRENCY,
      "to account:",
      order.accountNumber
    );
    console.log("💡 Webhook updates will appear above when status changes\n");
  } catch (error) {
    console.error("\n❌ Error creating order:", error.message);
  }
}

// Start server
app.listen(PORT, () => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🚀 PAJ Ramp Webhook Server");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🔗 Webhook endpoint: http://localhost:${PORT}/webhook/paj-ramp`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Automatically create an example order when server starts
  // Comment this out if you don't want auto-creation
  console.log({ AUTO_CREATE_ORDER: process.env.AUTO_CREATE_ORDER });
  if (process.env.AUTO_CREATE_ORDER === "true") {
    setTimeout(() => {
      createExampleOrder();
    }, 1000);
  } else {
    console.log(
      "\n💡 Set AUTO_CREATE_ORDER=true in .env to auto-create an order on startup"
    );
    console.log("📝 Or call createExampleOrder() manually from the console\n");
  }
});

// Export for manual testing
export { createExampleOrder };
