import {
  initializeSDK,
  initiate_x,
  verify,
  getBanks,
  offRampCreateOrder,
} from "paj_ramp";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  // Step 1: Initialize SDK
  console.log("🚀 Initializing PAJ Ramp SDK...");
  initializeSDK("local");

  const email = process.env.USER_EMAIL;
  const apiKey = process.env.BUSINESS_API_KEY;
  const accountNumber = process.env.ACCOUNT_NUMBER;
  const bankId = process.env.BANK_ID;

  try {
    // Step 2: Initiate session
    console.log("\n📧 Initiating session...");
    const initiated = await initiate_x(email, apiKey);
    console.log("✅ OTP sent to:", initiated.email || initiated.phone);

    const otp = process.env.OTP;
    if (!otp) {
      console.error(
        "❌ OTP not found in .env file. Please add OTP=your_otp to .env"
      );
      process.exit(1);
    }

    // Step 3: Verify session
    console.log("\n🔐 Verifying session with OTP...");
    const verified = await verify(
      email,
      otp,
      {
        uuid: "example-device-uuid-" + Date.now(),
        device: "Desktop",
        os: "MacOS",
        browser: "Chrome",
      },
      apiKey
    );
    console.log("✅ Session verified successfully!");

    // Step 4: Get available banks
    console.log("\n🏦 Fetching available banks...");
    const banks = await getBanks(verified.token);
    console.log(`✅ Found ${banks.length} banks`);
    if (banks.length > 0) {
      console.log(
        "First few banks:",
        banks
          .slice(0, 3)
          .map((b) => b.name)
          .join(", ")
      );
    }

    // Step 7: Create offramp order
    console.log("\n💸 Creating offramp order...");
    const order = await offRampCreateOrder(
      verified.token,
      bankId,
      accountNumber,
      process.env.CURRENCY || "NGN",
      parseInt(process.env.TOKEN_AMOUNT || "1"),
      process.env.TOKEN_MINT,
      process.env.WEBHOOK_URL
    );

    console.log("\n✅ Offramp order created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📋 Order Details:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Order ID:", order.id);
    console.log("Address:", order.address);
    console.log("Mint:", order.mint);
    console.log("Currency:", order.currency);
    console.log("Token Amount:", order.amount);
    console.log("Fiat Amount:", order.fiatAmount);
    console.log("Rate:", order.rate);
    console.log("Status:", order.status);
    console.log("Transaction Type:", order.transactionType);
    console.log("Created At:", order.createdAt);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    console.log("\n📝 Next Steps:");
    console.log("1. Send", order.amount, "tokens to address:", order.address);
    console.log("2. Your webhook will receive status updates");
    console.log(
      "3. Once tokens are received and confirmed, fiat will be sent to your bank account"
    );
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
    process.exit(1);
  }
}

main();
